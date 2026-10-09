// Shared pieces of the Midnight payroll integration, used by both the local
// simulator backend and the Preprod (Lace) backend.

import {
  pureCircuits,
  calculatePayslip,
  createEmployerBook,
  createSalaryRules,
  bandViolation,
  periodToUint,
  toHex,
  PayslipStatus,
  LEVEL_NAMES,
  type EmployerBook,
  type Ledger,
  type PayslipOpening,
  type PayslipDetails,
  type SalaryRules,
} from '@payroll/midnight-contract';
import { seal, open, type Keystore, type SealedBox } from '../privacy';

export { calculatePayslip, bandViolation, periodToUint, toHex, pureCircuits, PayslipStatus, LEVEL_NAMES };
export type { EmployerBook, Ledger, PayslipOpening, PayslipDetails, SalaryRules };

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
  /** Publishes the commitment to the employer book's salary rules. */
  setSalaryRules(): Promise<TxInfo>;
  fundPeriod(period: bigint, budget: bigint): Promise<TxInfo>;
  issuePayslip(employeePk: Uint8Array, period: bigint, opening: PayslipOpening): Promise<TxInfo>;
  claimPayslip(employeeId: string, period: bigint, opening: PayslipOpening): Promise<TxInfo>;
  closePeriod(period: bigint): Promise<TxInfo>;
  attestPeriod(period: bigint): Promise<TxInfo>;
  /** Sends `amount` shielded pay tokens from the employer's wallet. */
  payEmployee(shieldedAddress: string, amount: bigint): Promise<TxInfo | null>;
}

// ---------------------------------------------------------------------------
// JSON with Uint8Array / bigint support, for localStorage.

// Reads the raw value from the holder: some libraries define BigInt.prototype.toJSON,
// which would otherwise turn bigints into plain strings before the replacer sees them.
export const stringify = (value: unknown) =>
  JSON.stringify(value, function (this: Record<string, unknown>, key, v) {
    const raw = key === '' ? value : this[key];
    if (raw instanceof Uint8Array) return { $u8: toHex(raw) };
    if (typeof raw === 'bigint') return { $bi: raw.toString() };
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

// Keys derived from a wallet signature for this session (see lib/chain/wallet-keys.ts).
// They take precedence over the demo vault and are never written to storage.
const derivedKeys = new Map<RoleId, Uint8Array>();
export const setDerivedSecretKey = (role: RoleId, sk: Uint8Array) => void derivedKeys.set(role, sk);
export const hasDerivedSecretKey = (role: RoleId) => derivedKeys.has(role);

export function secretKeyFor(role: RoleId): Uint8Array {
  const derived = derivedKeys.get(role);
  if (derived) return derived;
  const vault = load<Record<string, Uint8Array>>(VAULT_KEY, {});
  if (!vault[role]) {
    vault[role] = crypto.getRandomValues(new Uint8Array(32));
    save(VAULT_KEY, vault);
  }
  return vault[role];
}

export const publicKeyFor = (role: RoleId) => pureCircuits.publicKey(secretKeyFor(role));

// ---------------------------------------------------------------------------
// Employer book (salary rules, issued openings, running totals) per contract.

const BOOK_KEY = 'payrollEmployerBooks.v1';

export function employerBook(contract: string): EmployerBook {
  const books = load<Record<string, EmployerBook>>(BOOK_KEY, {});
  if (!books[contract]) {
    books[contract] = createEmployerBook(createSalaryRules());
    save(BOOK_KEY, books);
  }
  return books[contract];
}

export function saveEmployerBook(contract: string, book: EmployerBook) {
  save(BOOK_KEY, { ...load<Record<string, EmployerBook>>(BOOK_KEY, {}), [contract]: book });
}

// ---------------------------------------------------------------------------
// Employee directory: what employees publish during onboarding (their Midnight
// public key and shielded payout address). Stands in for the HR system.

const DIRECTORY_KEY = 'payrollEmployeeDirectory.v1';
type DirectoryEntry = { midnightPk?: string; shieldedAddress?: string };

const directory = () => load<Record<string, DirectoryEntry>>(DIRECTORY_KEY, {});

export function registerEmployee(employeeId: string, entry: DirectoryEntry) {
  const all = directory();
  save(DIRECTORY_KEY, { ...all, [employeeId]: { ...all[employeeId], ...entry } });
}

export const registerShieldedAddress = (employeeId: string, address: string) =>
  registerEmployee(employeeId, { shieldedAddress: address });
export const shieldedAddressOf = (employeeId: string) => directory()[employeeId]?.shieldedAddress;

/** The employee's Midnight public key: as registered, else from this browser's keys. */
export function employeePublicKey(employeeId: string): Uint8Array {
  const registered = directory()[employeeId]?.midnightPk;
  return registered ? fromHex(registered) : publicKeyFor(employeeRole(employeeId));
}

export const isEmployeeRegistered = (employeeId: string) => !!directory()[employeeId]?.midnightPk;

// The auditor publishes its key the same way; the employer deploys with it.
const AUDITOR_ENTRY = '#auditor';
export const registerAuditor = (midnightPk: string) => registerEmployee(AUDITOR_ENTRY, { midnightPk });
export function auditorPublicKey(): Uint8Array {
  const registered = directory()[AUDITOR_ENTRY]?.midnightPk;
  return registered ? fromHex(registered) : publicKeyFor('auditor');
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
  const privateKey = keystore[holder]?.privateKey;
  if (!sealed?.[holder] || !privateKey) return null;
  try {
    const opening = openingFromJson(await open(privateKey, sealed[holder]));
    return { opening, verified: toHex(pureCircuits.payslipCommitment(opening)) === record.commitment };
  } catch {
    return null;
  }
}

/** Shares the salary rules with the auditor, so payslips can be checked against their bands. */
export async function postRules(contract: string, rules: SalaryRules, holder: string, keystore: Keystore) {
  const box = await seal(keystore[holder].publicKey, {
    bands: rules.bands.map(b => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, Number(v)]))),
    salt: toHex(rules.salt),
  });
  save(MAILBOX_KEY, { ...load<Mailbox>(MAILBOX_KEY, {}), [`${contract}:rules`]: { [holder]: box } });
}

export async function readRules(contract: string, ledger: Ledger, holder: string, keystore: Keystore) {
  const box = load<Mailbox>(MAILBOX_KEY, {})[`${contract}:rules`]?.[holder];
  const privateKey = keystore[holder]?.privateKey;
  if (!box || !privateKey) return null;
  try {
    const j = await open<{ bands: Record<string, number>[]; salt: string }>(privateKey, box);
    const rules: SalaryRules = {
      bands: j.bands.map(b => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, BigInt(v)]))) as SalaryRules['bands'],
      salt: fromHex(j.salt),
    };
    return { rules, verified: toHex(pureCircuits.salaryRulesCommitment(rules)) === toHex(ledger.rulesCommitment) };
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
  const byPk = new Map(employeeIds.map(id => [toHex(employeePublicKey(id)), id]));
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
  closedTotal: bigint | null;
  audited: boolean;
  rulesPublished: boolean;
};

export function periodSummary(ledger: Ledger, period: bigint): PeriodSummary {
  return {
    closedTotal: ledger.periodClosed.member(period) ? ledger.periodClosed.lookup(period) : null,
    rulesPublished: ledger.rulesVersion > 0n,
    root: ledger.periodRoots.member(period) ? toHex(ledger.periodRoots.lookup(period)) : null,
    issued: ledger.periodIssued.member(period) ? Number(ledger.periodIssued.lookup(period)) : 0,
    budget: ledger.periodBudgets.member(period) ? ledger.periodBudgets.lookup(period) : null,
    audited: ledger.auditedPeriods.member(period),
  };
}

/** A fresh opening with a random 32-byte salt. */
export const newOpening = (level: number, base: number, allowance: number, bonus: number): PayslipOpening => ({
  details: calculatePayslip(BigInt(level), BigInt(base), BigInt(allowance), BigInt(bonus)),
  salt: crypto.getRandomValues(new Uint8Array(32)),
});
