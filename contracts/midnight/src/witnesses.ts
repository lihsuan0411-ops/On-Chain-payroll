// Private state and witness implementations for payroll.compact.
//
// Nothing in the private state ever leaves the caller's device: the secret key
// identifies the caller (employer, employee or auditor), `openings` holds the
// plaintext figures + salt for payslips the caller issued or received, and the
// employer additionally keeps its salary rules and each period's running total.

import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { Ledger, PayslipOpening, SalaryRules, TotalOpening } from './managed/payroll/contract/index.js';

export type PayrollPrivateState = {
  readonly secretKey: Uint8Array;
  // keyed by hex-encoded payslipId
  readonly openings: Readonly<Record<string, PayslipOpening>>;
  // employer only: opening being replaced when a pending payslip is re-issued
  readonly replaced?: Readonly<Record<string, PayslipOpening>>;
  // employer only
  readonly rules?: SalaryRules;
  // employer only, keyed by period (e.g. "202605")
  readonly totals?: Readonly<Record<string, TotalOpening>>;
  readonly nextTotalSalts?: Readonly<Record<string, Uint8Array>>;
};

export const toHex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');

export const createPayrollPrivateState = (secretKey: Uint8Array): PayrollPrivateState => ({ secretKey, openings: {} });

export const withOpening = (state: PayrollPrivateState, id: Uint8Array, opening: PayslipOpening): PayrollPrivateState => ({
  ...state,
  openings: { ...state.openings, [toHex(id)]: opening },
});

export const ZERO_BYTES = new Uint8Array(32);

export const ZERO_OPENING: PayslipOpening = {
  details: { level: 0n, base: 0n, allowance: 0n, bonus: 0n, labor: 0n, health: 0n, tax: 0n, net: 0n },
  salt: ZERO_BYTES,
};

type Ctx = WitnessContext<Ledger, PayrollPrivateState>;

export const witnesses = {
  localSecretKey: ({ privateState }: Ctx): [PayrollPrivateState, Uint8Array] => [privateState, privateState.secretKey],

  payslipOpening: ({ privateState }: Ctx, id: Uint8Array): [PayrollPrivateState, PayslipOpening] => {
    const opening = privateState.openings[toHex(id)];
    if (!opening) throw new Error(`No payslip opening in private state for ${toHex(id)}`);
    return [privateState, opening];
  },

  replacedOpening: ({ privateState }: Ctx, id: Uint8Array): [PayrollPrivateState, PayslipOpening] => [
    privateState,
    privateState.replaced?.[toHex(id)] ?? ZERO_OPENING,
  ],

  salaryRules: ({ privateState }: Ctx): [PayrollPrivateState, SalaryRules] => {
    if (!privateState.rules) throw new Error('Salary rules missing from private state');
    return [privateState, privateState.rules];
  },

  periodTotal: ({ privateState }: Ctx, period: bigint): [PayrollPrivateState, TotalOpening] => [
    privateState,
    privateState.totals?.[period.toString()] ?? { total: 0n, salt: ZERO_BYTES },
  ],

  nextTotalSalt: ({ privateState }: Ctx, period: bigint): [PayrollPrivateState, Uint8Array] => {
    const salt = privateState.nextTotalSalts?.[period.toString()];
    if (!salt) throw new Error(`No next total salt for period ${period}`);
    return [privateState, salt];
  },
};
