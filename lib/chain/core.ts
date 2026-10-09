// Shared pieces of the Midnight payroll integration, used by both the local
// simulator backend and the Preprod (Lace) backend.

import {
  pureCircuits,
  calculatePayslip,
  periodToUint,
  toHex,
  PayslipStatus,
  type Ledger,
  type PayslipOpening,
  type PayslipDetails,
} from '@payroll/midnight-contract';
import { seal, open, type Keystore, type SealedBox } from '../privacy';

export { calculatePayslip, periodToUint, toHex, pureCircuits, PayslipStatus };
export type { Ledger, PayslipOpening, PayslipDetails };

export type ChainMode = 'local' | 'preprod';

/** Private-state id of each party; one browser plays every role in this demo. */
export type RoleId = 'employer' | 'auditor' | `employee:${string}`;
export const employeeRole = (id: string): RoleId => `employee:${id}`;

export type TxInfo = { txId: string; mode: ChainMode };

/** The operations both backends provide. Each runs a real circuit of payroll.compact. */
export interface PayrollBackend {
  readonly mode: ChainMode;
  readonly contractAddress: string;
  readLedger(): Promise<Ledger>;
  fundPeriod(period: bigint, budget: bigint): Promise<TxInfo>;
  issuePayslip(employeePk: Uint8Array, period: bigint, opening: PayslipOpening): Promise<TxInfo>;
  claimPayslip(employeeId: string, period: bigint, opening: PayslipOpening): Promise<TxInfo>;
  attestPeriod(period: bigint): Promise<TxInfo>;
  /** Sends `amount` shielded pay tokens from the employer's wallet. */
  payEmployee(shieldedAddress: string, amount: bigint): Promise<TxInfo | null>;
}

// ---------------------------------------------------------------------------
// JSON with Uint8Array / bigint support, for localStorage.

export const stringify = (value: unknown) =>
  JSON.stringify(value, (_k, v) => {
    if (v instanceof Uint8Array) return { $u8: toHex(v) };
    if (typeof v === 'bigint') return { $bi: v.toString() };
    return v;
  });

export const parse = <T>(text: string): T =>
  JSON.parse(text, (_k, v) => {
    if (v && typeof v === 'object' && typeof v.$u8 === 'string') return fromHex(v.$u8);
    if (v && typeof v === 'object' && typeof v.$bi === 'string') return BigInt(v.$bi);
    return v;
  });

export const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g) ?? [], b => parseInt(b, 16));

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? parse<T>(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown) {
  localStorage.setItem(key, stringify(value));
}

// ---------------------------------------------------------------------------
// Midnight secret keys per role. In production each key lives in its owner's
// wallet/private state; this single-browser demo keeps them together.

const VAULT_KEY = 'payrollMidnightKeys.v1';

export function secretKeyFor(role: RoleId): Uint8Array {
  const vault = load<Record<string, Uint8Array>>(VAULT_KEY, {});
  if (!vault[role]) {
    vault[role] = crypto.getRandomValues(new Uint8Array(32));
    save(VAULT_KEY, vault);
  }
  return vault[role];
}

export const publicKeyFor = (role: RoleId) => pureCircuits.publicKey(secretKeyFor(role));

// ---------------------------------------------------------------------------
// Shielded addresses employees register when they connect Lace (Preprod).

const ADDRESS_KEY = 'payrollShieldedAddresses.v1';
export const shieldedAddressOf = (employeeId: string) => load<Record<string, string>>(ADDRESS_KEY, {})[employeeId];
export function registerShieldedAddress(employeeId: string, address: string) {
  save(ADDRESS_KEY, { ...load<Record<string, string>>(ADDRESS_KEY, {}), [employeeId]: address });
}

// ---------------------------------------------------------------------------
// Off-chain mailbox: the opening of each payslip, sealed for the employee and
// the auditor (lib/privacy). Only the commitment goes on chain.

const MAILBOX_KEY = 'payrollMailbox.v1';
type Mailbox = Record<string, Record<string, SealedBox>>; // `${contract}:${payslipId}` -> holder -> box

const openingToJson = (o: PayslipOpening) => ({
  details: Object.fromEntries(Object.entries(o.details).map(([k, v]) => [k, Number(v)])),
  salt: toHex(o.salt),
});
const openingFromJson = (j: { details: Record<string, number>; salt: string }): PayslipOpening => ({
  details: Object.fromEntries(Object.entries(j.details).map(([k, v]) => [k, BigInt(v)])) as PayslipDetails,
  salt: fromHex(j.salt),
});

export async function postOpening(
  contract: string,
  payslipIdHex: string,
  opening: PayslipOpening,
  holders: string[],
  keystore: Keystore,
) {
  const boxes: Record<string, SealedBox> = {};
  for (const h of holders) boxes[h] = await seal(keystore[h].publicKey, openingToJson(opening));
  save(MAILBOX_KEY, { ...load<Mailbox>(MAILBOX_KEY, {}), [`${contract}:${payslipIdHex}`]: boxes });
}

/**
 * Decrypts the opening of a payslip for `holder` and checks it against the
 * on-chain commitment using the contract's own payslipCommitment circuit.
 */
export async function readOpening(
  contract: string,
  record: PayslipView,
  holder: string,
  keystore: Keystore,
): Promise<{ opening: PayslipOpening; verified: boolean } | null> {
  const sealed = load<Mailbox>(MAILBOX_KEY, {})[`${contract}:${record.id}`];
  if (!sealed?.[holder] || !keystore[holder]) return null;
  try {
    const opening = openingFromJson(await open(keystore[holder].privateKey, sealed[holder]));
    return { opening, verified: toHex(pureCircuits.payslipCommitment(opening)) === record.commitment };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Ledger -> UI records.

export type PayslipView = {
  id: string; // hex payslipId
  employeePk: string;
  employeeId?: string;
  period: string; // "2026-05"
  commitment: string;
  status: 'Pending' | 'Claimed';
};

export const periodLabel = (p: bigint) => `${p / 100n}-${String(p % 100n).padStart(2, '0')}`;

export function payslipViews(ledger: Ledger, employeeIds: string[]): PayslipView[] {
  const byPk = new Map(employeeIds.map(id => [toHex(publicKeyFor(employeeRole(id))), id]));
  return Array.from(ledger.payslips, ([id, rec]) => ({
    id: toHex(id),
    employeePk: toHex(rec.employee),
    employeeId: byPk.get(toHex(rec.employee)),
    period: periodLabel(rec.period),
    commitment: toHex(rec.commitment),
    status: rec.status === PayslipStatus.claimed ? ('Claimed' as const) : ('Pending' as const),
  }));
}

export type PeriodSummary = {
  root: string | null;
  issued: number;
  budget: bigint | null;
  audited: boolean;
};

export function periodSummary(ledger: Ledger, period: bigint): PeriodSummary {
  return {
    root: ledger.periodRoots.member(period) ? toHex(ledger.periodRoots.lookup(period)) : null,
    issued: ledger.periodIssued.member(period) ? Number(ledger.periodIssued.lookup(period)) : 0,
    budget: ledger.periodBudgets.member(period) ? ledger.periodBudgets.lookup(period) : null,
    audited: ledger.auditedPeriods.member(period),
  };
}

/** A fresh opening with a random 32-byte salt. */
export const newOpening = (base: number, allowance: number, bonus: number): PayslipOpening => ({
  details: calculatePayslip(BigInt(base), BigInt(allowance), BigInt(bonus)),
  salt: crypto.getRandomValues(new Uint8Array(32)),
});
