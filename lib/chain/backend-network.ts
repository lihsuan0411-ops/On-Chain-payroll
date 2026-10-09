// Network backend: deploys and calls payroll.compact on a real Midnight network
// through Midnight.js 4.1.1. It is wallet-agnostic: the browser builds its
// providers from Lace (lib/chain/lace.ts), the devnet test builds them from a
// Node wallet (scripts/devnet). Proofs are generated for every circuit call
// and verified by the node when the transaction is applied.

import { deployContract, findDeployedContract, type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { CompiledContract } from '@midnight-ntwrk/midnight-js-protocol/compact-js';
import {
  Contract,
  ledger,
  witnesses,
  withOpening,
  createPayrollPrivateState,
  prepareClose,
  prepareIssue,
  prepareSetRules,
  pureCircuits,
  type PayrollPrivateState,
} from '@payroll/midnight-contract';
import {
  auditorPublicKey,
  employeeRole,
  employerBook,
  saveEmployerBook,
  secretKeyFor,
  type PayrollBackend,
  type PayslipOpening,
  type RoleId,
  type TxInfo,
} from './core';

export type PayrollContract = Contract<PayrollPrivateState>;
export type CircuitId = 'setSalaryRules' | 'fundPeriod' | 'issuePayslip' | 'claimPayslip' | 'closePeriod' | 'attestPeriod';
export type PayrollProviders = MidnightProviders<CircuitId, RoleId, PayrollPrivateState>;
/** Sends shielded pay tokens from the employer's wallet; null when the wallet cannot. */
export type Payout = (shieldedAddress: string, amount: bigint, contractAddress: string) => Promise<TxInfo | null>;

export const compiledPayroll = (assetsPath = '/midnight/payroll') =>
  CompiledContract.make<PayrollContract>('Payroll', Contract<PayrollPrivateState>).pipe(
    CompiledContract.withWitnesses(witnesses),
    CompiledContract.withCompiledFileAssets(assetsPath),
  );

const txInfo = (data: { public: { txId: unknown } }): TxInfo => ({ txId: String(data.public.txId), mode: 'preprod' });

export class NetworkPayrollBackend implements PayrollBackend {
  readonly mode = 'preprod' as const;
  private readonly handles = new Map<RoleId, Promise<FoundContract<PayrollContract>>>();

  private constructor(
    readonly contractAddress: string,
    private readonly providers: PayrollProviders,
    private readonly payout: Payout,
    private readonly compiled: ReturnType<typeof compiledPayroll>,
  ) {}

  /** Deploys a new payroll contract; the connected wallet pays the fees. */
  static async deploy(providers: PayrollProviders, payout: Payout, compiled = compiledPayroll()) {
    const deployed = await deployContract(providers, {
      compiledContract: compiled,
      privateStateId: 'employer',
      initialPrivateState: createPayrollPrivateState(secretKeyFor('employer')),
      args: [auditorPublicKey()],
    });
    return new NetworkPayrollBackend(deployed.deployTxData.public.contractAddress, providers, payout, compiled);
  }

  static async join(providers: PayrollProviders, contractAddress: string, payout: Payout, compiled = compiledPayroll()) {
    const backend = new NetworkPayrollBackend(contractAddress, providers, payout, compiled);
    await backend.readLedger(); // fails fast on a wrong address or network
    return backend;
  }

  async readLedger() {
    const state = await this.providers.publicDataProvider.queryContractState(this.contractAddress);
    if (!state) throw new Error(`No payroll contract at ${this.contractAddress}`);
    return ledger(state.data);
  }

  /** Joins the contract as `role` after seeding that role's private state. */
  private async as(role: RoleId, state: PayrollPrivateState) {
    this.providers.privateStateProvider.setContractAddress(this.contractAddress);
    await this.providers.privateStateProvider.set(role, state);
    if (!this.handles.has(role)) {
      this.handles.set(
        role,
        findDeployedContract(this.providers, {
          contractAddress: this.contractAddress,
          compiledContract: this.compiled,
          privateStateId: role,
          initialPrivateState: state,
        }),
      );
    }
    return this.handles.get(role)!;
  }

  private employerState() {
    return prepareSetRules(employerBook(this.contractAddress), secretKeyFor('employer')).privateState;
  }

  async setSalaryRules() {
    const c = await this.as('employer', this.employerState());
    return txInfo(await c.callTx.setSalaryRules());
  }

  async fundPeriod(period: bigint, budget: bigint) {
    const c = await this.as('employer', this.employerState());
    return txInfo(await c.callTx.fundPeriod(period, budget));
  }

  async issuePayslip(employeePk: Uint8Array, period: bigint, opening: PayslipOpening) {
    const { privateState, next } = prepareIssue(
      employerBook(this.contractAddress),
      secretKeyFor('employer'),
      employeePk,
      period,
      opening,
    );
    const c = await this.as('employer', privateState);
    const tx = txInfo(await c.callTx.issuePayslip(employeePk, period));
    saveEmployerBook(this.contractAddress, next);
    return tx;
  }

  async claimPayslip(employeeId: string, period: bigint, opening: PayslipOpening) {
    const role = employeeRole(employeeId);
    const sk = secretKeyFor(role);
    const state = withOpening(createPayrollPrivateState(sk), pureCircuits.payslipId(pureCircuits.publicKey(sk), period), opening);
    const c = await this.as(role, state);
    return txInfo(await c.callTx.claimPayslip(period));
  }

  async closePeriod(period: bigint) {
    const { privateState } = prepareClose(employerBook(this.contractAddress), secretKeyFor('employer'));
    const c = await this.as('employer', privateState);
    return txInfo(await c.callTx.closePeriod(period));
  }

  async attestPeriod(period: bigint) {
    const c = await this.as('auditor', createPayrollPrivateState(secretKeyFor('auditor')));
    return txInfo(await c.callTx.attestPeriod(period));
  }

  payEmployee(shieldedAddress: string, amount: bigint) {
    return this.payout(shieldedAddress, amount, this.contractAddress);
  }
}
