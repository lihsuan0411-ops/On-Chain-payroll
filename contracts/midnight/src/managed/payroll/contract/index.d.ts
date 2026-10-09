import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type PayslipDetails = { level: bigint;
                               base: bigint;
                               allowance: bigint;
                               bonus: bigint;
                               labor: bigint;
                               health: bigint;
                               tax: bigint;
                               net: bigint
                             };

export type PayslipOpening = { details: PayslipDetails; salt: Uint8Array };

export type SalaryBand = { minBase: bigint;
                           maxBase: bigint;
                           maxAllowance: bigint;
                           maxBonus: bigint
                         };

export type SalaryRules = { bands: SalaryBand[]; salt: Uint8Array };

export type TotalOpening = { total: bigint; salt: Uint8Array };

export enum PayslipStatus { issued = 0, claimed = 1 }

export type PayslipRecord = { employee: Uint8Array;
                              period: bigint;
                              commitment: Uint8Array;
                              status: PayslipStatus
                            };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  payslipOpening(context: __compactRuntime.WitnessContext<Ledger, PS>,
                 id_0: Uint8Array): [PS, PayslipOpening];
  replacedOpening(context: __compactRuntime.WitnessContext<Ledger, PS>,
                  id_0: Uint8Array): [PS, PayslipOpening];
  salaryRules(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, SalaryRules];
  periodTotal(context: __compactRuntime.WitnessContext<Ledger, PS>,
              period_0: bigint): [PS, TotalOpening];
  nextTotalSalt(context: __compactRuntime.WitnessContext<Ledger, PS>,
                period_0: bigint): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  setSalaryRules(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  fundPeriod(context: __compactRuntime.CircuitContext<PS>,
             period_0: bigint,
             budget_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  issuePayslip(context: __compactRuntime.CircuitContext<PS>,
               employee_0: Uint8Array,
               period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimPayslip(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closePeriod(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  attestPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  setSalaryRules(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  fundPeriod(context: __compactRuntime.CircuitContext<PS>,
             period_0: bigint,
             budget_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  issuePayslip(context: __compactRuntime.CircuitContext<PS>,
               employee_0: Uint8Array,
               period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimPayslip(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closePeriod(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  attestPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  publicKey(sk_0: Uint8Array): Uint8Array;
  payslipId(employee_0: Uint8Array, period_0: bigint): Uint8Array;
  payslipCommitment(opening_0: PayslipOpening): Uint8Array;
  salaryRulesCommitment(rules_0: SalaryRules): Uint8Array;
  totalCommitment(opening_0: TotalOpening): Uint8Array;
  payTokenDomain(): Uint8Array;
}

export type Circuits<PS> = {
  publicKey(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): __compactRuntime.CircuitResults<PS, Uint8Array>;
  payslipId(context: __compactRuntime.CircuitContext<PS>,
            employee_0: Uint8Array,
            period_0: bigint): __compactRuntime.CircuitResults<PS, Uint8Array>;
  payslipCommitment(context: __compactRuntime.CircuitContext<PS>,
                    opening_0: PayslipOpening): __compactRuntime.CircuitResults<PS, Uint8Array>;
  salaryRulesCommitment(context: __compactRuntime.CircuitContext<PS>,
                        rules_0: SalaryRules): __compactRuntime.CircuitResults<PS, Uint8Array>;
  totalCommitment(context: __compactRuntime.CircuitContext<PS>,
                  opening_0: TotalOpening): __compactRuntime.CircuitResults<PS, Uint8Array>;
  payTokenDomain(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, Uint8Array>;
  setSalaryRules(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  fundPeriod(context: __compactRuntime.CircuitContext<PS>,
             period_0: bigint,
             budget_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  issuePayslip(context: __compactRuntime.CircuitContext<PS>,
               employee_0: Uint8Array,
               period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  claimPayslip(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  closePeriod(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  attestPeriod(context: __compactRuntime.CircuitContext<PS>, period_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly employer: Uint8Array;
  readonly auditor: Uint8Array;
  readonly rulesCommitment: Uint8Array;
  readonly rulesVersion: bigint;
  payslips: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): PayslipRecord;
    [Symbol.iterator](): Iterator<[Uint8Array, PayslipRecord]>
  };
  periodRoots: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  periodIssued: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  periodTotals: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): Uint8Array;
    [Symbol.iterator](): Iterator<[bigint, Uint8Array]>
  };
  periodClosed: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  periodBudgets: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: bigint): boolean;
    lookup(key_0: bigint): bigint;
    [Symbol.iterator](): Iterator<[bigint, bigint]>
  };
  auditedPeriods: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: bigint): boolean;
    [Symbol.iterator](): Iterator<bigint>
  };
  readonly mintCount: bigint;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               auditorPk_0: Uint8Array): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
