// Private state and witness implementations for payroll.compact.
//
// Nothing in the private state ever leaves the caller's device: the secret key
// identifies the caller (employer, employee or auditor) and `openings` holds
// the plaintext figures + salt for payslips the caller issued or received.

import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { Ledger, PayslipOpening } from './managed/payroll/contract/index.js';

export type PayrollPrivateState = {
  readonly secretKey: Uint8Array;
  // keyed by hex-encoded payslipId
  readonly openings: Readonly<Record<string, PayslipOpening>>;
};

export const toHex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');

export const createPayrollPrivateState = (secretKey: Uint8Array): PayrollPrivateState => ({ secretKey, openings: {} });

export const withOpening = (state: PayrollPrivateState, id: Uint8Array, opening: PayslipOpening): PayrollPrivateState => ({
  ...state,
  openings: { ...state.openings, [toHex(id)]: opening },
});

export const witnesses = {
  localSecretKey: ({ privateState }: WitnessContext<Ledger, PayrollPrivateState>): [PayrollPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey,
  ],
  payslipOpening: (
    { privateState }: WitnessContext<Ledger, PayrollPrivateState>,
    id: Uint8Array,
  ): [PayrollPrivateState, PayslipOpening] => {
    const opening = privateState.openings[toHex(id)];
    if (!opening) throw new Error(`No payslip opening in private state for ${toHex(id)}`);
    return [privateState, opening];
  },
};
