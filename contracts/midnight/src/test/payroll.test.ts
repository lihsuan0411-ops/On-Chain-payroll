import { describe, it, expect, beforeEach } from 'vitest';
import { pureCircuits, PayslipStatus, type PayslipOpening } from '../managed/payroll/contract/index.js';
import { calculatePayslip, createSalaryRules, DEMO_SALARY_BANDS, bandViolation } from '../payroll-math';
import { PayrollSimulator } from './payroll-simulator';

const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(n));
const PERIOD = 202605n;

const opening = (level: number, base: number, allowance: number, bonus: number): PayslipOpening => ({
  details: calculatePayslip(BigInt(level), BigInt(base), BigInt(allowance), BigInt(bonus)),
  salt: randomBytes(32),
});

describe('payroll contract', () => {
  let employerSk: Uint8Array;
  let aliceSk: Uint8Array;
  let bobSk: Uint8Array;
  let auditorSk: Uint8Array;
  let alicePk: Uint8Array;
  let bobPk: Uint8Array;
  let sim: PayrollSimulator;

  // Alice is level 3 (Senior): base 60k-85k, allowance <= 6k, bonus <= 40k.
  const aliceOpening = () => opening(3, 75000, 5000, 6000);

  beforeEach(() => {
    [employerSk, aliceSk, bobSk, auditorSk] = [0, 1, 2, 3].map(() => randomBytes(32));
    alicePk = pureCircuits.publicKey(aliceSk);
    bobPk = pureCircuits.publicKey(bobSk);
    sim = new PayrollSimulator(employerSk, pureCircuits.publicKey(auditorSk));
    sim.setSalaryRules();
  });

  describe('setup', () => {
    it('records employer and auditor public keys, never secrets', () => {
      expect(sim.ledger.employer).toEqual(pureCircuits.publicKey(employerSk));
      expect(sim.ledger.auditor).toEqual(pureCircuits.publicKey(auditorSk));
    });

    it('publishes only a commitment to the salary rules', () => {
      expect(sim.ledger.rulesCommitment).toEqual(pureCircuits.salaryRulesCommitment(sim.book.rules));
      expect(sim.ledger.rulesVersion).toEqual(1n);
    });

    it('only lets the employer publish rules', () => {
      expect(() => sim.setSalaryRules(aliceSk)).toThrow(/not the employer/);
    });

    it('matches the off-chain calculation used by the UI', () => {
      expect(calculatePayslip(3n, 75000n, 5000n, 6000n)).toEqual({
        level: 3n, base: 75000n, allowance: 5000n, bonus: 6000n, labor: 1875n, health: 1125n, tax: 4300n, net: 78700n,
      });
    });
  });

  describe('issuing', () => {
    it('publishes only the commitment', () => {
      const o = aliceOpening();
      sim.issuePayslip(alicePk, PERIOD, o);
      const record = sim.ledger.payslips.lookup(pureCircuits.payslipId(alicePk, PERIOD));
      expect(record).toEqual({ employee: alicePk, period: PERIOD, commitment: pureCircuits.payslipCommitment(o), status: PayslipStatus.issued });
      const json = JSON.stringify(sim.ledger, (_k, v) => (typeof v === 'bigint' ? v.toString() : v));
      expect(json).not.toContain('78700');
      expect(json).not.toContain('75000');
    });

    it('rejects figures that break the statutory deductions', () => {
      const o = aliceOpening();
      expect(() => sim.issuePayslip(alicePk, PERIOD, { ...o, details: { ...o.details, net: o.details.net + 1n } })).toThrow(/Net pay/);
      expect(() =>
        sim.issuePayslip(alicePk, PERIOD, { ...o, details: { ...o.details, tax: 0n, net: o.details.net + o.details.tax } }),
      ).toThrow(/Income tax/);
      expect(() =>
        sim.issuePayslip(alicePk, PERIOD, { ...o, details: { ...o.details, labor: 0n, net: o.details.net + o.details.labor } }),
      ).toThrow(/Labor insurance/);
    });

    it('rejects a wrong level for the salary (Senior pay filed as Intern)', () => {
      expect(() => sim.issuePayslip(alicePk, PERIOD, opening(1, 75000, 5000, 6000))).toThrow(/outside the band/);
    });

    it('rejects allowance or bonus above the band', () => {
      expect(() => sim.issuePayslip(alicePk, PERIOD, opening(3, 75000, 7000, 0))).toThrow(/Allowance exceeds/);
      expect(() => sim.issuePayslip(alicePk, PERIOD, opening(3, 75000, 5000, 50000))).toThrow(/Bonus exceeds/);
    });

    it('rejects unknown levels', () => {
      expect(() => sim.issuePayslip(alicePk, PERIOD, opening(0, 30000, 0, 0))).toThrow(/Unknown level/);
      expect(() => sim.issuePayslip(alicePk, PERIOD, opening(6, 30000, 0, 0))).toThrow(/Unknown level/);
    });

    it('rejects issuing with rules that do not match the published commitment', () => {
      sim.book = { ...sim.book, rules: createSalaryRules(DEMO_SALARY_BANDS.map(b => ({ ...b, maxBase: b.maxBase * 2n }))) };
      expect(() => sim.issuePayslip(alicePk, PERIOD, opening(1, 80000, 0, 0))).toThrow(/do not match the published/);
    });

    it('requires published rules', () => {
      const fresh = new PayrollSimulator(employerSk, pureCircuits.publicKey(auditorSk));
      expect(() => fresh.issuePayslip(alicePk, PERIOD, aliceOpening())).toThrow(/not published/);
    });

    it('only lets the employer issue payslips or fund periods', () => {
      expect(() => sim.issuePayslip(alicePk, PERIOD, aliceOpening(), aliceSk)).toThrow(/not the employer/);
      expect(() => sim.fundPeriod(PERIOD, 1n, aliceSk)).toThrow(/not the employer/);
    });

    it('chains commitments into a per-period root for Cardano anchoring', () => {
      sim.issuePayslip(alicePk, PERIOD, aliceOpening());
      const root1 = sim.ledger.periodRoots.lookup(PERIOD);
      sim.issuePayslip(bobPk, PERIOD, opening(4, 90000, 8000, 0));
      expect(sim.ledger.periodRoots.lookup(PERIOD)).not.toEqual(root1);
      expect(sim.ledger.periodIssued.lookup(PERIOD)).toEqual(2n);
    });

    it('lets the employer re-issue a pending payslip', () => {
      sim.issuePayslip(alicePk, PERIOD, aliceOpening());
      const updated = opening(3, 75000, 5000, 10000);
      sim.issuePayslip(alicePk, PERIOD, updated);
      const id = pureCircuits.payslipId(alicePk, PERIOD);
      expect(sim.ledger.payslips.lookup(id).commitment).toEqual(pureCircuits.payslipCommitment(updated));
    });
  });

  // Every level in the demo org chart, at the band edges and inside: all must prove.
  describe('rule validation across levels', () => {
    const cases = DEMO_SALARY_BANDS.flatMap((b, i) => {
      const level = i + 1;
      const mid = (b.minBase + b.maxBase) / 2n;
      return [
        { level, base: b.minBase, allowance: 0n, bonus: 0n },
        { level, base: mid, allowance: b.maxAllowance / 2n, bonus: b.maxBonus / 2n },
        { level, base: b.maxBase, allowance: b.maxAllowance, bonus: b.maxBonus },
      ];
    });

    it.each(cases)('level $level, base $base: compliant payslip is accepted', ({ level, base, allowance, bonus }) => {
      const pk = pureCircuits.publicKey(randomBytes(32));
      sim.issuePayslip(pk, PERIOD, { details: calculatePayslip(BigInt(level), base, allowance, bonus), salt: randomBytes(32) });
      expect(sim.ledger.payslips.member(pureCircuits.payslipId(pk, PERIOD))).toBe(true);
    });

    const violations = DEMO_SALARY_BANDS.flatMap((b, i) => {
      const level = BigInt(i + 1);
      return [
        { level, base: b.minBase - 1n, allowance: 0n, bonus: 0n },
        { level, base: b.maxBase + 1n, allowance: 0n, bonus: 0n },
        { level, base: b.minBase, allowance: b.maxAllowance + 1n, bonus: 0n },
        { level, base: b.minBase, allowance: 0n, bonus: b.maxBonus + 1n },
      ];
    });

    it.each(violations)('level $level: out-of-band payslip is rejected (base $base, allowance $allowance, bonus $bonus)', v => {
      const details = calculatePayslip(v.level, v.base, v.allowance, v.bonus);
      expect(bandViolation(sim.book.rules, details)).not.toBeNull();
      expect(() => sim.issuePayslip(pureCircuits.publicKey(randomBytes(32)), PERIOD, { details, salt: randomBytes(32) })).toThrow(
        /band for this level/,
      );
    });
  });

  describe('claiming', () => {
    it('lets the employee claim with their key and opening, exactly once', () => {
      const o = aliceOpening();
      sim.issuePayslip(alicePk, PERIOD, o);
      sim.claimPayslip(aliceSk, PERIOD, o);
      expect(sim.ledger.payslips.lookup(pureCircuits.payslipId(alicePk, PERIOD)).status).toEqual(PayslipStatus.claimed);
      expect(() => sim.claimPayslip(aliceSk, PERIOD, o)).toThrow(/already claimed/);
      expect(() => sim.issuePayslip(alicePk, PERIOD, o)).toThrow(/already claimed/);
    });

    it('rejects claims from another employee or with a wrong opening', () => {
      const o = aliceOpening();
      sim.issuePayslip(alicePk, PERIOD, o);
      expect(() => sim.claimPayslip(bobSk, PERIOD, o)).toThrow(/No payslip/);
      expect(() => sim.claimPayslip(aliceSk, PERIOD, { ...o, salt: randomBytes(32) })).toThrow(/does not match/);
    });
  });

  describe('period totals', () => {
    it('keeps a hidden running total, adjusted on re-issue', () => {
      sim.issuePayslip(alicePk, PERIOD, aliceOpening()); // 78,700
      sim.issuePayslip(bobPk, PERIOD, opening(4, 90000, 8000, 0)); // 89,500
      sim.issuePayslip(alicePk, PERIOD, opening(3, 75000, 5000, 10000)); // 82,500 replaces 78,700
      expect(sim.book.totals[PERIOD.toString()].total).toEqual(82500n + 89500n);
      expect(sim.ledger.periodTotals.lookup(PERIOD)).toEqual(pureCircuits.totalCommitment(sim.book.totals[PERIOD.toString()]));
    });

    it('rejects a forged running total', () => {
      sim.issuePayslip(alicePk, PERIOD, aliceOpening());
      const p = PERIOD.toString();
      sim.book = { ...sim.book, totals: { [p]: { ...sim.book.totals[p], total: 1n } } };
      expect(() => sim.issuePayslip(bobPk, PERIOD, opening(4, 90000, 8000, 0))).toThrow(/total opening does not match/);
    });

    it('closes a period within budget and discloses only the aggregate', () => {
      sim.fundPeriod(PERIOD, 250000n);
      sim.issuePayslip(alicePk, PERIOD, aliceOpening());
      sim.issuePayslip(bobPk, PERIOD, opening(4, 90000, 8000, 0));
      sim.closePeriod(PERIOD);
      expect(sim.ledger.periodClosed.lookup(PERIOD)).toEqual(78700n + 89500n);
      expect(() => sim.issuePayslip(alicePk, PERIOD, aliceOpening())).toThrow(/already closed/);
    });

    it('refuses to close a period over budget or unfunded', () => {
      sim.issuePayslip(alicePk, PERIOD, aliceOpening());
      expect(() => sim.closePeriod(PERIOD)).toThrow(/not funded/);
      sim.fundPeriod(PERIOD, 50000n);
      expect(() => sim.closePeriod(PERIOD)).toThrow(/exceeds the funded budget/);
    });

    it('records the funded budget once per period', () => {
      sim.fundPeriod(PERIOD, 250000n);
      expect(sim.ledger.periodBudgets.lookup(PERIOD)).toEqual(250000n);
      expect(sim.ledger.mintCount).toEqual(1n);
      expect(() => sim.fundPeriod(PERIOD, 1n)).toThrow(/already funded/);
    });
  });

  describe('audit', () => {
    it('only lets the auditor attest, and only a closed period', () => {
      sim.fundPeriod(PERIOD, 250000n);
      sim.issuePayslip(alicePk, PERIOD, aliceOpening());
      expect(() => sim.attestPeriod(auditorSk, PERIOD)).toThrow(/not closed/);
      sim.closePeriod(PERIOD);
      expect(() => sim.attestPeriod(employerSk, PERIOD)).toThrow(/not the auditor/);
      sim.attestPeriod(auditorSk, PERIOD);
      expect(sim.ledger.auditedPeriods.member(PERIOD)).toBe(true);
    });
  });
});
