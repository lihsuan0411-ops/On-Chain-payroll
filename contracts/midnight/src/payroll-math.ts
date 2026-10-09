// Off-chain payroll calculation and demo salary rules. Must stay in sync with
// assertValidCalculation / assertWithinRules in payroll.compact, which re-check
// these figures inside the ZK proof.

import type { PayslipDetails, SalaryBand, SalaryRules } from './managed/payroll/contract/index.js';

export const RATES_PER_MILLE = { labor: 25n, health: 15n, tax: 50n } as const;

export function calculatePayslip(level: bigint, base: bigint, allowance: bigint, bonus: bigint): PayslipDetails {
  if (base < 0n || allowance < 0n || bonus < 0n) throw new Error('Amounts must be non-negative');
  const gross = base + allowance + bonus;
  const labor = (base * RATES_PER_MILLE.labor) / 1000n;
  const health = (base * RATES_PER_MILLE.health) / 1000n;
  const tax = (gross * RATES_PER_MILLE.tax) / 1000n;
  return { level, base, allowance, bonus, labor, health, tax, net: gross - labor - health - tax };
}

/** Converts a period like "2026-05" to the contract's Uint<32> form (202605). */
export const periodToUint = (period: string): bigint => BigInt(period.replace('-', ''));

const band = (minBase: number, maxBase: number, maxAllowance: number, maxBonus: number): SalaryBand => ({
  minBase: BigInt(minBase),
  maxBase: BigInt(maxBase),
  maxAllowance: BigInt(maxAllowance),
  maxBonus: BigInt(maxBonus),
});

export const LEVEL_NAMES = ['Intern', 'Associate', 'Senior', 'Lead', 'Executive'] as const;

/** Demo salary bands (TWD / month) for levels 1..5. */
export const DEMO_SALARY_BANDS: SalaryBand[] = [
  band(25_000, 45_000, 3_000, 10_000),
  band(40_000, 65_000, 4_000, 20_000),
  band(60_000, 85_000, 6_000, 40_000),
  band(80_000, 110_000, 10_000, 80_000),
  band(100_000, 200_000, 20_000, 200_000),
];

export const createSalaryRules = (bands: SalaryBand[] = DEMO_SALARY_BANDS, salt?: Uint8Array): SalaryRules => ({
  bands,
  salt: salt ?? crypto.getRandomValues(new Uint8Array(32)),
});

/** Off-chain check mirroring assertWithinRules, for friendly UI errors before proving. */
export function bandViolation(rules: SalaryRules, d: PayslipDetails): string | null {
  const b = rules.bands[Number(d.level) - 1];
  if (!b) return 'Unknown level';
  if (d.base < b.minBase || d.base > b.maxBase) return 'Base salary is outside the band for this level';
  if (d.allowance > b.maxAllowance) return 'Allowance exceeds the band for this level';
  if (d.bonus > b.maxBonus) return 'Bonus exceeds the band for this level';
  return null;
}
