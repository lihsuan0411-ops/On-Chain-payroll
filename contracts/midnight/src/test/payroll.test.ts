import { describe, it, expect, beforeEach } from 'vitest';
import { pureCircuits, PayslipStatus } from '../managed/payroll/contract/index.js';
import { createPayrollPrivateState, type PayrollPrivateState } from '../witnesses';
import { calculatePayslip } from '../payroll-math';
import { PayrollSimulator } from './payroll-simulator';

const randomBytes = (n: number) => crypto.getRandomValues(new Uint8Array(n));
const PERIOD = 202605n;

describe('payroll contract', () => {
  let employer: PayrollPrivateState;
  let alice: PayrollPrivateState;
  let bob: PayrollPrivateState;
  let auditor: PayrollPrivateState;
  let alicePk: Uint8Array;
  let sim: PayrollSimulator;

  const aliceOpening = () => ({ details: calculatePayslip(75000n, 5000n, 6000n), salt: randomBytes(32) });

  beforeEach(() => {
    employer = createPayrollPrivateState(randomBytes(32));
    alice = createPayrollPrivateState(randomBytes(32));
    bob = createPayrollPrivateState(randomBytes(32));
    auditor = createPayrollPrivateState(randomBytes(32));
    alicePk = pureCircuits.publicKey(alice.secretKey);
    sim = new PayrollSimulator(employer.secretKey, pureCircuits.publicKey(auditor.secretKey));
  });

  it('records employer and auditor public keys, never secrets', () => {
    expect(sim.ledger.employer).toEqual(pureCircuits.publicKey(employer.secretKey));
    expect(sim.ledger.auditor).toEqual(pureCircuits.publicKey(auditor.secretKey));
  });

  it('matches the off-chain calculation used by the UI', () => {
    expect(calculatePayslip(75000n, 5000n, 6000n)).toEqual({
      base: 75000n, allowance: 5000n, bonus: 6000n, labor: 1875n, health: 1125n, tax: 4300n, net: 78700n,
    });
  });

  it('issues a payslip publishing only the commitment', () => {
    const opening = aliceOpening();
    sim.remember(alicePk, PERIOD, opening).issuePayslip(alicePk, PERIOD);

    const record = sim.ledger.payslips.lookup(pureCircuits.payslipId(alicePk, PERIOD));
    expect(record.employee).toEqual(alicePk);
    expect(record.period).toEqual(PERIOD);
    expect(record.status).toEqual(PayslipStatus.issued);
    expect(record.commitment).toEqual(pureCircuits.payslipCommitment(opening));
    expect(sim.ledger.periodIssued.lookup(PERIOD)).toEqual(1n);
    expect(JSON.stringify(sim.ledger, (_k, v) => (typeof v === 'bigint' ? v.toString() : v))).not.toContain('78700');
  });

  it('rejects payslips whose figures break the payroll rules', () => {
    const opening = aliceOpening();
    const inflated = { ...opening, details: { ...opening.details, net: opening.details.net + 1n } };
    expect(() => sim.remember(alicePk, PERIOD, inflated).issuePayslip(alicePk, PERIOD)).toThrow(/Net pay/);

    const lowTax = { ...opening, details: { ...opening.details, tax: 0n, net: opening.details.net + opening.details.tax } };
    expect(() => sim.remember(alicePk, PERIOD, lowTax).issuePayslip(alicePk, PERIOD)).toThrow(/Income tax/);
  });

  it('only lets the employer issue payslips or fund periods', () => {
    const opening = aliceOpening();
    sim.as(alice).remember(alicePk, PERIOD, opening);
    expect(() => sim.issuePayslip(alicePk, PERIOD)).toThrow(/not the employer/);
    expect(() => sim.fundPeriod(PERIOD, 1n)).toThrow(/not the employer/);
  });

  it('chains commitments into a per-period root for Cardano anchoring', () => {
    const o1 = aliceOpening();
    sim.remember(alicePk, PERIOD, o1).issuePayslip(alicePk, PERIOD);
    const root1 = sim.ledger.periodRoots.lookup(PERIOD);

    const bobPk = pureCircuits.publicKey(bob.secretKey);
    const o2 = { details: calculatePayslip(90000n, 8000n, 0n), salt: randomBytes(32) };
    sim.remember(bobPk, PERIOD, o2).issuePayslip(bobPk, PERIOD);
    const root2 = sim.ledger.periodRoots.lookup(PERIOD);

    expect(root2).not.toEqual(root1);
    expect(sim.ledger.periodIssued.lookup(PERIOD)).toEqual(2n);
  });

  it('lets the employee claim with their key and opening, exactly once', () => {
    const opening = aliceOpening();
    sim.remember(alicePk, PERIOD, opening).issuePayslip(alicePk, PERIOD);

    sim.as(alice).remember(alicePk, PERIOD, opening).claimPayslip(PERIOD);
    const id = pureCircuits.payslipId(alicePk, PERIOD);
    expect(sim.ledger.payslips.lookup(id).status).toEqual(PayslipStatus.claimed);

    expect(() => sim.claimPayslip(PERIOD)).toThrow(/already claimed/);
    sim.as(employer);
    expect(() => sim.issuePayslip(alicePk, PERIOD)).toThrow(/already claimed/);
  });

  it('rejects claims from another employee or with a wrong opening', () => {
    const opening = aliceOpening();
    sim.remember(alicePk, PERIOD, opening).issuePayslip(alicePk, PERIOD);

    // Bob holds Alice's opening but not her key: he can only reach his own (missing) payslip.
    expect(() => sim.as(bob).remember(alicePk, PERIOD, opening).claimPayslip(PERIOD)).toThrow();

    const forged = { ...opening, salt: randomBytes(32) };
    expect(() => sim.as(alice).remember(alicePk, PERIOD, forged).claimPayslip(PERIOD)).toThrow(/does not match/);
  });

  it('lets the employer re-issue a payslip before it is claimed', () => {
    sim.remember(alicePk, PERIOD, aliceOpening()).issuePayslip(alicePk, PERIOD);
    const updated = { details: calculatePayslip(75000n, 5000n, 10000n), salt: randomBytes(32) };
    sim.remember(alicePk, PERIOD, updated).issuePayslip(alicePk, PERIOD);
    const id = pureCircuits.payslipId(alicePk, PERIOD);
    expect(sim.ledger.payslips.lookup(id).commitment).toEqual(pureCircuits.payslipCommitment(updated));
  });

  it('records the funded budget once per period', () => {
    sim.fundPeriod(PERIOD, 250000n);
    expect(sim.ledger.periodBudgets.lookup(PERIOD)).toEqual(250000n);
    expect(sim.ledger.mintCount).toEqual(1n);
    expect(() => sim.fundPeriod(PERIOD, 1n)).toThrow(/already funded/);
  });

  it('only lets the auditor attest an issued period', () => {
    expect(() => sim.as(auditor).attestPeriod(PERIOD)).toThrow(/Nothing issued/);
    sim.as(employer).remember(alicePk, PERIOD, aliceOpening()).issuePayslip(alicePk, PERIOD);
    expect(() => sim.attestPeriod(PERIOD)).toThrow(/not the auditor/);
    sim.as(auditor).attestPeriod(PERIOD);
    expect(sim.ledger.auditedPeriods.member(PERIOD)).toBe(true);
  });
});
