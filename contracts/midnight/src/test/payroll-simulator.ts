import {
  type CircuitContext,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, type Ledger, ledger, pureCircuits, type PayslipOpening } from '../managed/payroll/contract/index.js';
import { type PayrollPrivateState, createPayrollPrivateState, withOpening, witnesses } from '../witnesses';
import { createEmployerBook, prepareClose, prepareIssue, prepareSetRules, type EmployerBook } from '../employer-book';
import { createSalaryRules } from '../payroll-math';

const COIN_PK = '0'.repeat(64);

/** Runs the payroll contract in-process, switching between parties by private state. */
export class PayrollSimulator {
  readonly contract = new Contract<PayrollPrivateState>(witnesses);
  context: CircuitContext<PayrollPrivateState>;
  book: EmployerBook;

  constructor(
    readonly employerSk: Uint8Array,
    auditorPk: Uint8Array,
  ) {
    const { currentPrivateState, currentContractState, currentZswapLocalState } = this.contract.initialState(
      createConstructorContext(createPayrollPrivateState(employerSk), COIN_PK),
      auditorPk,
    );
    this.context = createCircuitContext(sampleContractAddress(), currentZswapLocalState, currentContractState, currentPrivateState);
    this.book = createEmployerBook(createSalaryRules());
  }

  as(state: PayrollPrivateState): this {
    this.context = { ...this.context, currentPrivateState: state };
    return this;
  }

  get ledger(): Ledger {
    return ledger(this.context.currentQueryContext.state);
  }

  private exec(state: PayrollPrivateState, run: (ctx: CircuitContext<PayrollPrivateState>) => { context: CircuitContext<PayrollPrivateState> }) {
    this.context = run({ ...this.context, currentPrivateState: state }).context;
  }

  setSalaryRules(sk = this.employerSk) {
    this.exec(prepareSetRules(this.book, sk).privateState, c => this.contract.impureCircuits.setSalaryRules(c));
  }

  fundPeriod(period: bigint, budget: bigint, sk = this.employerSk) {
    this.exec(prepareSetRules(this.book, sk).privateState, c => this.contract.impureCircuits.fundPeriod(c, period, budget));
  }

  /** Issues as the employer, keeping the employer book in sync on success. */
  issuePayslip(employeePk: Uint8Array, period: bigint, opening: PayslipOpening, sk = this.employerSk) {
    const { privateState, next } = prepareIssue(this.book, sk, employeePk, period, opening);
    this.exec(privateState, c => this.contract.impureCircuits.issuePayslip(c, employeePk, period));
    this.book = next;
  }

  claimPayslip(employeeSk: Uint8Array, period: bigint, opening: PayslipOpening) {
    const id = pureCircuits.payslipId(pureCircuits.publicKey(employeeSk), period);
    const state = withOpening(createPayrollPrivateState(employeeSk), id, opening);
    this.exec(state, c => this.contract.impureCircuits.claimPayslip(c, period));
  }

  closePeriod(period: bigint, sk = this.employerSk) {
    this.exec(prepareClose(this.book, sk).privateState, c => this.contract.impureCircuits.closePeriod(c, period));
  }

  attestPeriod(auditorSk: Uint8Array, period: bigint) {
    this.exec(createPayrollPrivateState(auditorSk), c => this.contract.impureCircuits.attestPeriod(c, period));
  }
}
