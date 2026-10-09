// Local backend: runs the compiled payroll.compact circuits in the browser via
// compact-runtime, exactly as the network would execute them, but without
// generating proofs or submitting transactions. Contract state is persisted in
// localStorage so the demo survives reloads.

import {
  ContractState,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
  type CircuitContext,
} from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger, witnesses, withOpening, pureCircuits, type PayrollPrivateState } from '@payroll/midnight-contract';
import {
  employeeRole,
  fromHex,
  publicKeyFor,
  secretKeyFor,
  toHex,
  type PayrollBackend,
  type PayslipOpening,
  type RoleId,
  type TxInfo,
} from './core';

const STATE_KEY = 'payrollLocalContract.v1';
const COIN_PK = '0'.repeat(64);

type Persisted = { address: string; state: string };

export class LocalPayrollBackend implements PayrollBackend {
  readonly mode = 'local' as const;
  readonly contractAddress: string;
  private readonly contract = new Contract<PayrollPrivateState>(witnesses);
  private contractState: ContractState;
  private txCount = 0;

  private constructor(address: string, state: ContractState) {
    this.contractAddress = address;
    this.contractState = state;
  }

  /** Loads the persisted local contract, deploying a fresh one on first use. */
  static open(): LocalPayrollBackend {
    try {
      const saved = localStorage.getItem(STATE_KEY);
      if (saved) {
        const { address, state } = JSON.parse(saved) as Persisted;
        return new LocalPayrollBackend(address, ContractState.deserialize(fromHex(state)));
      }
    } catch {
      // fall through to a fresh deployment
    }
    return LocalPayrollBackend.deploy();
  }

  static deploy(): LocalPayrollBackend {
    const contract = new Contract<PayrollPrivateState>(witnesses);
    const { currentContractState } = contract.initialState(
      createConstructorContext({ secretKey: secretKeyFor('employer'), openings: {} }, COIN_PK),
      publicKeyFor('auditor'),
    );
    const backend = new LocalPayrollBackend(sampleContractAddress(), currentContractState);
    backend.persist();
    return backend;
  }

  static reset() {
    localStorage.removeItem(STATE_KEY);
  }

  private persist() {
    const saved: Persisted = { address: this.contractAddress, state: toHex(this.contractState.serialize()) };
    localStorage.setItem(STATE_KEY, JSON.stringify(saved));
  }

  /** Runs one impure circuit as `role`; throws with the circuit's assert message on failure. */
  private run(
    role: RoleId,
    openings: Record<string, PayslipOpening>,
    call: (ctx: CircuitContext<PayrollPrivateState>) => { context: CircuitContext<PayrollPrivateState> },
  ): TxInfo {
    const ctx = createCircuitContext(this.contractAddress, COIN_PK, this.contractState, {
      secretKey: secretKeyFor(role),
      openings,
    });
    const { context } = call(ctx);
    const next = ContractState.deserialize(this.contractState.serialize());
    next.data = context.currentQueryContext.state;
    this.contractState = next;
    this.persist();
    this.txCount += 1;
    return { txId: `local-${Date.now().toString(16)}-${this.txCount}`, mode: 'local' };
  }

  async readLedger() {
    return ledger(this.contractState.data);
  }

  async fundPeriod(period: bigint, budget: bigint) {
    return this.run('employer', {}, ctx => this.contract.impureCircuits.fundPeriod(ctx, period, budget));
  }

  async issuePayslip(employeePk: Uint8Array, period: bigint, opening: PayslipOpening) {
    const state = withOpening({ secretKey: new Uint8Array(), openings: {} }, pureCircuits.payslipId(employeePk, period), opening);
    return this.run('employer', state.openings, ctx => this.contract.impureCircuits.issuePayslip(ctx, employeePk, period));
  }

  async claimPayslip(employeeId: string, period: bigint, opening: PayslipOpening) {
    const id = pureCircuits.payslipId(publicKeyFor(employeeRole(employeeId)), period);
    return this.run(employeeRole(employeeId), { [toHex(id)]: opening }, ctx =>
      this.contract.impureCircuits.claimPayslip(ctx, period),
    );
  }

  async attestPeriod(period: bigint) {
    return this.run('auditor', {}, ctx => this.contract.impureCircuits.attestPeriod(ctx, period));
  }

  async payEmployee() {
    // No wallets locally: the shielded transfer only happens on Preprod.
    return null;
  }
}
