import {
  type CircuitContext,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, type Ledger, ledger, pureCircuits, type PayslipOpening } from '../managed/payroll/contract/index.js';
import { type PayrollPrivateState, createPayrollPrivateState, withOpening, witnesses } from '../witnesses';

const COIN_PK = '0'.repeat(64);

/** Runs the payroll contract in-process, switching between parties by private state. */
export class PayrollSimulator {
  readonly contract = new Contract<PayrollPrivateState>(witnesses);
  context: CircuitContext<PayrollPrivateState>;

  constructor(employerSk: Uint8Array, auditorPk: Uint8Array) {
    const { currentPrivateState, currentContractState, currentZswapLocalState } = this.contract.initialState(
      createConstructorContext(createPayrollPrivateState(employerSk), COIN_PK),
      auditorPk,
    );
    this.context = createCircuitContext(
      sampleContractAddress(),
      currentZswapLocalState,
      currentContractState,
      currentPrivateState,
    );
  }

  as(state: PayrollPrivateState): this {
    this.context = { ...this.context, currentPrivateState: state };
    return this;
  }

  get privateState(): PayrollPrivateState {
    return this.context.currentPrivateState;
  }

  get ledger(): Ledger {
    return ledger(this.context.currentQueryContext.state);
  }

  /** Stores an opening in the current caller's private state. */
  remember(employeePk: Uint8Array, period: bigint, opening: PayslipOpening): this {
    return this.as(withOpening(this.privateState, pureCircuits.payslipId(employeePk, period), opening));
  }

  fundPeriod(period: bigint, budget: bigint) {
    this.context = this.contract.impureCircuits.fundPeriod(this.context, period, budget).context;
  }

  issuePayslip(employeePk: Uint8Array, period: bigint) {
    this.context = this.contract.impureCircuits.issuePayslip(this.context, employeePk, period).context;
  }

  claimPayslip(period: bigint) {
    this.context = this.contract.impureCircuits.claimPayslip(this.context, period).context;
  }

  attestPeriod(period: bigint) {
    this.context = this.contract.impureCircuits.attestPeriod(this.context, period).context;
  }
}
