// Off-chain payroll calculation. Must stay in sync with assertValidCalculation
// in payroll.compact, which re-checks these figures inside the ZK proof.

import type { PayslipDetails } from './managed/payroll/contract/index.js';

export const RATES_PER_MILLE = { labor: 25n, health: 15n, tax: 50n } as const;

export function calculatePayslip(base: bigint, allowance: bigint, bonus: bigint): PayslipDetails {
  if (base < 0n || allowance < 0n || bonus < 0n) throw new Error('Amounts must be non-negative');
  const gross = base + allowance + bonus;
  const labor = (base * RATES_PER_MILLE.labor) / 1000n;
  const health = (base * RATES_PER_MILLE.health) / 1000n;
  const tax = (gross * RATES_PER_MILLE.tax) / 1000n;
  return { base, allowance, bonus, labor, health, tax, net: gross - labor - health - tax };
}

/** Converts a period like "2026-05" to the contract's Uint<32> form (202605). */
export const periodToUint = (period: string): bigint => BigInt(period.replace('-', ''));
