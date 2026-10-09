import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

export var PayslipStatus;
(function (PayslipStatus) {
  PayslipStatus[PayslipStatus['issued'] = 0] = 'issued';
  PayslipStatus[PayslipStatus['claimed'] = 1] = 'claimed';
})(PayslipStatus || (PayslipStatus = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_2 = __compactRuntime.CompactTypeBoolean;

const _descriptor_3 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_4 = new __compactRuntime.CompactTypeEnum(1, 1);

class _PayslipRecord_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment())));
  }
  fromValue(value_0) {
    return {
      employee: _descriptor_3.fromValue(value_0),
      period: _descriptor_0.fromValue(value_0),
      commitment: _descriptor_3.fromValue(value_0),
      status: _descriptor_4.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.employee).concat(_descriptor_0.toValue(value_0.period).concat(_descriptor_3.toValue(value_0.commitment).concat(_descriptor_4.toValue(value_0.status))));
  }
}

const _descriptor_5 = new _PayslipRecord_0();

const _descriptor_6 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _TotalOpening_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_3.alignment());
  }
  fromValue(value_0) {
    return {
      total: _descriptor_1.fromValue(value_0),
      salt: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.total).concat(_descriptor_3.toValue(value_0.salt));
  }
}

const _descriptor_7 = new _TotalOpening_0();

const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

class _PayslipDetails_0 {
  alignment() {
    return _descriptor_8.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())))))));
  }
  fromValue(value_0) {
    return {
      level: _descriptor_8.fromValue(value_0),
      base: _descriptor_1.fromValue(value_0),
      allowance: _descriptor_1.fromValue(value_0),
      bonus: _descriptor_1.fromValue(value_0),
      labor: _descriptor_1.fromValue(value_0),
      health: _descriptor_1.fromValue(value_0),
      tax: _descriptor_1.fromValue(value_0),
      net: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_8.toValue(value_0.level).concat(_descriptor_1.toValue(value_0.base).concat(_descriptor_1.toValue(value_0.allowance).concat(_descriptor_1.toValue(value_0.bonus).concat(_descriptor_1.toValue(value_0.labor).concat(_descriptor_1.toValue(value_0.health).concat(_descriptor_1.toValue(value_0.tax).concat(_descriptor_1.toValue(value_0.net))))))));
  }
}

const _descriptor_9 = new _PayslipDetails_0();

class _PayslipOpening_0 {
  alignment() {
    return _descriptor_9.alignment().concat(_descriptor_3.alignment());
  }
  fromValue(value_0) {
    return {
      details: _descriptor_9.fromValue(value_0),
      salt: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_9.toValue(value_0.details).concat(_descriptor_3.toValue(value_0.salt));
  }
}

const _descriptor_10 = new _PayslipOpening_0();

class _SalaryBand_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment().concat(_descriptor_1.alignment())));
  }
  fromValue(value_0) {
    return {
      minBase: _descriptor_1.fromValue(value_0),
      maxBase: _descriptor_1.fromValue(value_0),
      maxAllowance: _descriptor_1.fromValue(value_0),
      maxBonus: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.minBase).concat(_descriptor_1.toValue(value_0.maxBase).concat(_descriptor_1.toValue(value_0.maxAllowance).concat(_descriptor_1.toValue(value_0.maxBonus))));
  }
}

const _descriptor_11 = new _SalaryBand_0();

const _descriptor_12 = new __compactRuntime.CompactTypeVector(5, _descriptor_11);

class _SalaryRules_0 {
  alignment() {
    return _descriptor_12.alignment().concat(_descriptor_3.alignment());
  }
  fromValue(value_0) {
    return {
      bands: _descriptor_12.fromValue(value_0),
      salt: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_12.toValue(value_0.bands).concat(_descriptor_3.toValue(value_0.salt));
  }
}

const _descriptor_13 = new _SalaryRules_0();

class _ZswapCoinPublicKey_0 {
  alignment() {
    return _descriptor_3.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.bytes);
  }
}

const _descriptor_14 = new _ZswapCoinPublicKey_0();

const _descriptor_15 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ShieldedCoinInfo_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_15.alignment()));
  }
  fromValue(value_0) {
    return {
      nonce: _descriptor_3.fromValue(value_0),
      color: _descriptor_3.fromValue(value_0),
      value: _descriptor_15.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.nonce).concat(_descriptor_3.toValue(value_0.color).concat(_descriptor_15.toValue(value_0.value)));
  }
}

const _descriptor_16 = new _ShieldedCoinInfo_0();

class _ContractAddress_0 {
  alignment() {
    return _descriptor_3.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.bytes);
  }
}

const _descriptor_17 = new _ContractAddress_0();

class _Either_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_14.alignment().concat(_descriptor_17.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_14.fromValue(value_0),
      right: _descriptor_17.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_14.toValue(value_0.left).concat(_descriptor_17.toValue(value_0.right)));
  }
}

const _descriptor_18 = new _Either_0();

const _descriptor_19 = __compactRuntime.CompactTypeField;

const _descriptor_20 = new __compactRuntime.CompactTypeVector(2, _descriptor_3);

const _descriptor_21 = new __compactRuntime.CompactTypeBytes(21);

class _CoinPreimage_0 {
  alignment() {
    return _descriptor_21.alignment().concat(_descriptor_16.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment())));
  }
  fromValue(value_0) {
    return {
      domain_sep: _descriptor_21.fromValue(value_0),
      info: _descriptor_16.fromValue(value_0),
      dataType: _descriptor_2.fromValue(value_0),
      data: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_21.toValue(value_0.domain_sep).concat(_descriptor_16.toValue(value_0.info).concat(_descriptor_2.toValue(value_0.dataType).concat(_descriptor_3.toValue(value_0.data))));
  }
}

const _descriptor_22 = new _CoinPreimage_0();

const _descriptor_23 = new __compactRuntime.CompactTypeVector(3, _descriptor_19);

const _descriptor_24 = new __compactRuntime.CompactTypeVector(3, _descriptor_3);

class _Either_1 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_3.alignment().concat(_descriptor_3.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_2.fromValue(value_0),
      left: _descriptor_3.fromValue(value_0),
      right: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.is_left).concat(_descriptor_3.toValue(value_0.left).concat(_descriptor_3.toValue(value_0.right)));
  }
}

const _descriptor_25 = new _Either_1();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.localSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localSecretKey');
    }
    if (typeof(witnesses_0.payslipOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named payslipOpening');
    }
    if (typeof(witnesses_0.replacedOpening) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named replacedOpening');
    }
    if (typeof(witnesses_0.salaryRules) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named salaryRules');
    }
    if (typeof(witnesses_0.periodTotal) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named periodTotal');
    }
    if (typeof(witnesses_0.nextTotalSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named nextTotalSalt');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      publicKey(context, ...args_1) {
        return { result: pureCircuits.publicKey(...args_1), context };
      },
      payslipId(context, ...args_1) {
        return { result: pureCircuits.payslipId(...args_1), context };
      },
      payslipCommitment(context, ...args_1) {
        return { result: pureCircuits.payslipCommitment(...args_1), context };
      },
      salaryRulesCommitment(context, ...args_1) {
        return { result: pureCircuits.salaryRulesCommitment(...args_1), context };
      },
      totalCommitment(context, ...args_1) {
        return { result: pureCircuits.totalCommitment(...args_1), context };
      },
      payTokenDomain(context, ...args_1) {
        return { result: pureCircuits.payTokenDomain(...args_1), context };
      },
      setSalaryRules: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`setSalaryRules: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('setSalaryRules',
                                     'argument 1 (as invoked from Typescript)',
                                     'payroll.compact line 184 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._setSalaryRules_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      fundPeriod: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`fundPeriod: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const period_0 = args_1[1];
        const budget_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('fundPeriod',
                                     'argument 1 (as invoked from Typescript)',
                                     'payroll.compact line 192 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(period_0) === 'bigint' && period_0 >= 0n && period_0 <= 4294967295n)) {
          __compactRuntime.typeError('fundPeriod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'payroll.compact line 192 char 1',
                                     'Uint<0..4294967296>',
                                     period_0)
        }
        if (!(typeof(budget_0) === 'bigint' && budget_0 >= 0n && budget_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('fundPeriod',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'payroll.compact line 192 char 1',
                                     'Uint<0..18446744073709551616>',
                                     budget_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(period_0).concat(_descriptor_1.toValue(budget_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._fundPeriod_0(context,
                                            partialProofData,
                                            period_0,
                                            budget_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      issuePayslip: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`issuePayslip: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const employee_0 = args_1[1];
        const period_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('issuePayslip',
                                     'argument 1 (as invoked from Typescript)',
                                     'payroll.compact line 206 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(employee_0.buffer instanceof ArrayBuffer && employee_0.BYTES_PER_ELEMENT === 1 && employee_0.length === 32)) {
          __compactRuntime.typeError('issuePayslip',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'payroll.compact line 206 char 1',
                                     'Bytes<32>',
                                     employee_0)
        }
        if (!(typeof(period_0) === 'bigint' && period_0 >= 0n && period_0 <= 4294967295n)) {
          __compactRuntime.typeError('issuePayslip',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'payroll.compact line 206 char 1',
                                     'Uint<0..4294967296>',
                                     period_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(employee_0).concat(_descriptor_0.toValue(period_0)),
            alignment: _descriptor_3.alignment().concat(_descriptor_0.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._issuePayslip_0(context,
                                              partialProofData,
                                              employee_0,
                                              period_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      claimPayslip: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`claimPayslip: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const period_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('claimPayslip',
                                     'argument 1 (as invoked from Typescript)',
                                     'payroll.compact line 241 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(period_0) === 'bigint' && period_0 >= 0n && period_0 <= 4294967295n)) {
          __compactRuntime.typeError('claimPayslip',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'payroll.compact line 241 char 1',
                                     'Uint<0..4294967296>',
                                     period_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(period_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._claimPayslip_0(context,
                                              partialProofData,
                                              period_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      closePeriod: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`closePeriod: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const period_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('closePeriod',
                                     'argument 1 (as invoked from Typescript)',
                                     'payroll.compact line 253 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(period_0) === 'bigint' && period_0 >= 0n && period_0 <= 4294967295n)) {
          __compactRuntime.typeError('closePeriod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'payroll.compact line 253 char 1',
                                     'Uint<0..4294967296>',
                                     period_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(period_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._closePeriod_0(context, partialProofData, period_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      attestPeriod: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`attestPeriod: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const period_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('attestPeriod',
                                     'argument 1 (as invoked from Typescript)',
                                     'payroll.compact line 265 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(period_0) === 'bigint' && period_0 >= 0n && period_0 <= 4294967295n)) {
          __compactRuntime.typeError('attestPeriod',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'payroll.compact line 265 char 1',
                                     'Uint<0..4294967296>',
                                     period_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(period_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._attestPeriod_0(context,
                                              partialProofData,
                                              period_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      setSalaryRules: this.circuits.setSalaryRules,
      fundPeriod: this.circuits.fundPeriod,
      issuePayslip: this.circuits.issuePayslip,
      claimPayslip: this.circuits.claimPayslip,
      closePeriod: this.circuits.closePeriod,
      attestPeriod: this.circuits.attestPeriod
    };
    this.provableCircuits = {
      setSalaryRules: this.circuits.setSalaryRules,
      fundPeriod: this.circuits.fundPeriod,
      issuePayslip: this.circuits.issuePayslip,
      claimPayslip: this.circuits.claimPayslip,
      closePeriod: this.circuits.closePeriod,
      attestPeriod: this.circuits.attestPeriod
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const auditorPk_0 = args_0[1];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(auditorPk_0.buffer instanceof ArrayBuffer && auditorPk_0.BYTES_PER_ELEMENT === 1 && auditorPk_0.length === 32)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'payroll.compact line 105 char 1',
                                 'Bytes<32>',
                                 auditorPk_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('setSalaryRules', new __compactRuntime.ContractOperation());
    state_0.setOperation('fundPeriod', new __compactRuntime.ContractOperation());
    state_0.setOperation('issuePayslip', new __compactRuntime.ContractOperation());
    state_0.setOperation('claimPayslip', new __compactRuntime.ContractOperation());
    state_0.setOperation('closePeriod', new __compactRuntime.ContractOperation());
    state_0.setOperation('attestPeriod', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(2n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(3n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(4n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(5n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(6n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(7n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(8n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(9n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(10n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(11n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_0 = this._publicKey_0(this._localSecretKey_0(context,
                                                           partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(0n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(1n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(auditorPk_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _left_0(value_0) {
    return { is_left: true, left: value_0, right: { bytes: new Uint8Array(32) } };
  }
  _tokenType_0(domain_sep_0, contractAddress_0) {
    return this._persistentCommit_3([domain_sep_0, contractAddress_0.bytes],
                                    new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 100, 101, 114, 105, 118, 101, 95, 116, 111, 107, 101, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _mintShieldedToken_0(context,
                       partialProofData,
                       domain_sep_0,
                       value_0,
                       nonce_0,
                       recipient_0)
  {
    const coin_0 = { nonce: nonce_0,
                     color:
                       this._tokenType_0(domain_sep_0,
                                         _descriptor_17.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 2 } },
                                                                                                     { idx: { cached: true,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_8.toValue(0n),
                                                                                                                                alignment: _descriptor_8.alignment() } }] } },
                                                                                                     { popeq: { cached: true,
                                                                                                                result: undefined } }]).value)),
                     value: value_0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(4n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(domain_sep_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { dup: { n: 1 } },
                                       { dup: { n: 1 } },
                                       'member',
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(value_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { swap: { n: 0 } },
                                       'neg',
                                       { branch: { skip: 4 } },
                                       { dup: { n: 2 } },
                                       { dup: { n: 2 } },
                                       { idx: { cached: true,
                                                pushPath: false,
                                                path: [ { tag: 'stack' }] } },
                                       'add',
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    this._createZswapOutput_0(context, partialProofData, coin_0, recipient_0);
    const cm_0 = this._coinCommitment_0(coin_0, recipient_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { swap: { n: 0 } },
                                       { idx: { cached: true,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(2n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(cm_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: true, n: 2 } },
                                       { swap: { n: 0 } }]);
    if (!recipient_0.is_left
        &&
        this._equal_0(recipient_0.right.bytes,
                      _descriptor_17.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                 partialProofData,
                                                                                 [
                                                                                  { dup: { n: 2 } },
                                                                                  { idx: { cached: true,
                                                                                           pushPath: false,
                                                                                           path: [
                                                                                                  { tag: 'value',
                                                                                                    value: { value: _descriptor_8.toValue(0n),
                                                                                                             alignment: _descriptor_8.alignment() } }] } },
                                                                                  { popeq: { cached: true,
                                                                                             result: undefined } }]).value).bytes))
    {
      __compactRuntime.queryLedgerState(context,
                                        partialProofData,
                                        [
                                         { swap: { n: 0 } },
                                         { idx: { cached: true,
                                                  pushPath: true,
                                                  path: [
                                                         { tag: 'value',
                                                           value: { value: _descriptor_8.toValue(1n),
                                                                    alignment: _descriptor_8.alignment() } }] } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(cm_0),
                                                                                                alignment: _descriptor_3.alignment() }).encode() } },
                                         { push: { storage: false,
                                                   value: __compactRuntime.StateValue.newNull().encode() } },
                                         { ins: { cached: true, n: 2 } },
                                         { swap: { n: 0 } }]);
    }
    return coin_0;
  }
  _evolveNonce_0(index_0, nonce_0) {
    return this._upgradeFromTransient_0(this._transientHash_0([__compactRuntime.convertBytesToField(28,
                                                                                                    new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 107, 101, 114, 110, 101, 108, 58, 110, 111, 110, 99, 101, 95, 101, 118, 111, 108, 118, 101]),
                                                                                                    '<standard library>'),
                                                               index_0,
                                                               this._degradeToTransient_0(nonce_0)]));
  }
  _coinCommitment_0(coin_0, recipient_0) {
    return this._persistentHash_1({ domain_sep:
                                      new Uint8Array([109, 105, 100, 110, 105, 103, 104, 116, 58, 122, 115, 119, 97, 112, 45, 99, 99, 91, 118, 49, 93]),
                                    info: coin_0,
                                    dataType: recipient_0.is_left,
                                    data:
                                      recipient_0.is_left ?
                                      recipient_0.left.bytes :
                                      recipient_0.right.bytes });
  }
  _transientHash_0(value_0) {
    const result_0 = __compactRuntime.transientHash(_descriptor_23, value_0);
    return result_0;
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_24, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_22, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_20, value_0);
    return result_0;
  }
  _persistentCommit_0(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_9,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_1(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_12,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_2(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_1,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _persistentCommit_3(value_0, rand_0) {
    const result_0 = __compactRuntime.persistentCommit(_descriptor_20,
                                                       value_0,
                                                       rand_0);
    return result_0;
  }
  _degradeToTransient_0(x_0) {
    const result_0 = __compactRuntime.degradeToTransient(x_0);
    return result_0;
  }
  _upgradeFromTransient_0(x_0) {
    const result_0 = __compactRuntime.upgradeFromTransient(x_0);
    return result_0;
  }
  _ownPublicKey_0(context, partialProofData) {
    const result_0 = __compactRuntime.ownPublicKey(context);
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_14.toValue(result_0),
      alignment: _descriptor_14.alignment()
    });
    return result_0;
  }
  _createZswapOutput_0(context, partialProofData, coin_0, recipient_0) {
    const result_0 = __compactRuntime.createZswapOutput(context,
                                                        coin_0,
                                                        recipient_0);
    partialProofData.privateTranscriptOutputs.push({
      value: [],
      alignment: []
    });
    return result_0;
  }
  _localSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localSecretKey(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localSecretKey',
                                 'return value',
                                 'payroll.compact line 93 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _payslipOpening_0(context, partialProofData, id_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.payslipOpening(witnessContext_0,
                                                                         id_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.details) === 'object' && typeof(result_0.details.level) === 'bigint' && result_0.details.level >= 0n && result_0.details.level <= 255n && typeof(result_0.details.base) === 'bigint' && result_0.details.base >= 0n && result_0.details.base <= 18446744073709551615n && typeof(result_0.details.allowance) === 'bigint' && result_0.details.allowance >= 0n && result_0.details.allowance <= 18446744073709551615n && typeof(result_0.details.bonus) === 'bigint' && result_0.details.bonus >= 0n && result_0.details.bonus <= 18446744073709551615n && typeof(result_0.details.labor) === 'bigint' && result_0.details.labor >= 0n && result_0.details.labor <= 18446744073709551615n && typeof(result_0.details.health) === 'bigint' && result_0.details.health >= 0n && result_0.details.health <= 18446744073709551615n && typeof(result_0.details.tax) === 'bigint' && result_0.details.tax >= 0n && result_0.details.tax <= 18446744073709551615n && typeof(result_0.details.net) === 'bigint' && result_0.details.net >= 0n && result_0.details.net <= 18446744073709551615n && result_0.salt.buffer instanceof ArrayBuffer && result_0.salt.BYTES_PER_ELEMENT === 1 && result_0.salt.length === 32)) {
      __compactRuntime.typeError('payslipOpening',
                                 'return value',
                                 'payroll.compact line 95 char 1',
                                 'struct PayslipOpening<details: struct PayslipDetails<level: Uint<0..256>, base: Uint<0..18446744073709551616>, allowance: Uint<0..18446744073709551616>, bonus: Uint<0..18446744073709551616>, labor: Uint<0..18446744073709551616>, health: Uint<0..18446744073709551616>, tax: Uint<0..18446744073709551616>, net: Uint<0..18446744073709551616>>, salt: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_10.toValue(result_0),
      alignment: _descriptor_10.alignment()
    });
    return result_0;
  }
  _replacedOpening_0(context, partialProofData, id_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.replacedOpening(witnessContext_0,
                                                                          id_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.details) === 'object' && typeof(result_0.details.level) === 'bigint' && result_0.details.level >= 0n && result_0.details.level <= 255n && typeof(result_0.details.base) === 'bigint' && result_0.details.base >= 0n && result_0.details.base <= 18446744073709551615n && typeof(result_0.details.allowance) === 'bigint' && result_0.details.allowance >= 0n && result_0.details.allowance <= 18446744073709551615n && typeof(result_0.details.bonus) === 'bigint' && result_0.details.bonus >= 0n && result_0.details.bonus <= 18446744073709551615n && typeof(result_0.details.labor) === 'bigint' && result_0.details.labor >= 0n && result_0.details.labor <= 18446744073709551615n && typeof(result_0.details.health) === 'bigint' && result_0.details.health >= 0n && result_0.details.health <= 18446744073709551615n && typeof(result_0.details.tax) === 'bigint' && result_0.details.tax >= 0n && result_0.details.tax <= 18446744073709551615n && typeof(result_0.details.net) === 'bigint' && result_0.details.net >= 0n && result_0.details.net <= 18446744073709551615n && result_0.salt.buffer instanceof ArrayBuffer && result_0.salt.BYTES_PER_ELEMENT === 1 && result_0.salt.length === 32)) {
      __compactRuntime.typeError('replacedOpening',
                                 'return value',
                                 'payroll.compact line 97 char 1',
                                 'struct PayslipOpening<details: struct PayslipDetails<level: Uint<0..256>, base: Uint<0..18446744073709551616>, allowance: Uint<0..18446744073709551616>, bonus: Uint<0..18446744073709551616>, labor: Uint<0..18446744073709551616>, health: Uint<0..18446744073709551616>, tax: Uint<0..18446744073709551616>, net: Uint<0..18446744073709551616>>, salt: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_10.toValue(result_0),
      alignment: _descriptor_10.alignment()
    });
    return result_0;
  }
  _salaryRules_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.salaryRules(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && Array.isArray(result_0.bands) && result_0.bands.length === 5 && result_0.bands.every((t) => typeof(t) === 'object' && typeof(t.minBase) === 'bigint' && t.minBase >= 0n && t.minBase <= 18446744073709551615n && typeof(t.maxBase) === 'bigint' && t.maxBase >= 0n && t.maxBase <= 18446744073709551615n && typeof(t.maxAllowance) === 'bigint' && t.maxAllowance >= 0n && t.maxAllowance <= 18446744073709551615n && typeof(t.maxBonus) === 'bigint' && t.maxBonus >= 0n && t.maxBonus <= 18446744073709551615n) && result_0.salt.buffer instanceof ArrayBuffer && result_0.salt.BYTES_PER_ELEMENT === 1 && result_0.salt.length === 32)) {
      __compactRuntime.typeError('salaryRules',
                                 'return value',
                                 'payroll.compact line 99 char 1',
                                 'struct SalaryRules<bands: Vector<5, struct SalaryBand<minBase: Uint<0..18446744073709551616>, maxBase: Uint<0..18446744073709551616>, maxAllowance: Uint<0..18446744073709551616>, maxBonus: Uint<0..18446744073709551616>>>, salt: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_13.toValue(result_0),
      alignment: _descriptor_13.alignment()
    });
    return result_0;
  }
  _periodTotal_0(context, partialProofData, period_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.periodTotal(witnessContext_0,
                                                                      period_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.total) === 'bigint' && result_0.total >= 0n && result_0.total <= 18446744073709551615n && result_0.salt.buffer instanceof ArrayBuffer && result_0.salt.BYTES_PER_ELEMENT === 1 && result_0.salt.length === 32)) {
      __compactRuntime.typeError('periodTotal',
                                 'return value',
                                 'payroll.compact line 101 char 1',
                                 'struct TotalOpening<total: Uint<0..18446744073709551616>, salt: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _nextTotalSalt_0(context, partialProofData, period_0) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.nextTotalSalt(witnessContext_0,
                                                                        period_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('nextTotalSalt',
                                 'return value',
                                 'payroll.compact line 103 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _isFloorPerMille_0(deduction_0, amount_0, rate_0) {
    const scaled_0 = amount_0 * rate_0;
    let t_0;
    return (t_0 = deduction_0 * 1000n, t_0 <= scaled_0)
           &&
           scaled_0 < (deduction_0 + 1n) * 1000n;
  }
  _assertValidCalculation_0(d_0) {
    const gross_0 = d_0.base + d_0.allowance + d_0.bonus;
    __compactRuntime.assert(this._isFloorPerMille_0(d_0.labor, d_0.base, 25n),
                            'Labor insurance does not match 2.5% of base');
    __compactRuntime.assert(this._isFloorPerMille_0(d_0.health, d_0.base, 15n),
                            'Health insurance does not match 1.5% of base');
    __compactRuntime.assert(this._isFloorPerMille_0(d_0.tax,
                                                    ((t1) => {
                                                      if (t1 > 18446744073709551615n) {
                                                        throw new __compactRuntime.CompactError('payroll.compact line 121 char 33: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                                                      }
                                                      return t1;
                                                    })(gross_0),
                                                    50n),
                            'Income tax does not match 5% of gross');
    __compactRuntime.assert(this._equal_1(d_0.net + d_0.labor + d_0.health
                                          +
                                          d_0.tax,
                                          gross_0),
                            'Net pay does not equal gross minus deductions');
    return [];
  }
  _bandFor_0(rules_0, level_0) {
    __compactRuntime.assert(level_0 >= 1n && level_0 <= 5n, 'Unknown level');
    if (this._equal_2(level_0, 1n)) {
      return rules_0.bands[0];
    } else {
      if (this._equal_3(level_0, 2n)) {
        return rules_0.bands[1];
      } else {
        if (this._equal_4(level_0, 3n)) {
          return rules_0.bands[2];
        } else {
          if (this._equal_5(level_0, 4n)) {
            return rules_0.bands[3];
          } else {
            return rules_0.bands[4];
          }
        }
      }
    }
  }
  _assertWithinRules_0(context, partialProofData, d_0) {
    const rules_0 = this._salaryRules_0(context, partialProofData);
    __compactRuntime.assert(!this._equal_6(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_8.toValue(2n),
                                                                                                                                 alignment: _descriptor_8.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value),
                                           new Uint8Array(32)),
                            'Salary rules not published');
    __compactRuntime.assert(this._equal_7(this._salaryRulesCommitment_0(rules_0),
                                          _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_8.toValue(2n),
                                                                                                                                alignment: _descriptor_8.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Salary rules do not match the published commitment');
    const band_0 = this._bandFor_0(rules_0, d_0.level);
    let t_0, t_1;
    __compactRuntime.assert((t_1 = d_0.base, t_1 >= band_0.minBase)
                            &&
                            (t_0 = d_0.base, t_0 <= band_0.maxBase),
                            'Base salary is outside the band for this level');
    let t_2;
    __compactRuntime.assert((t_2 = d_0.allowance, t_2 <= band_0.maxAllowance),
                            'Allowance exceeds the band for this level');
    let t_3;
    __compactRuntime.assert((t_3 = d_0.bonus, t_3 <= band_0.maxBonus),
                            'Bonus exceeds the band for this level');
    return [];
  }
  _currentTotal_0(context, partialProofData, p_0) {
    const opening_0 = this._periodTotal_0(context, partialProofData, p_0);
    if (_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                  partialProofData,
                                                                  [
                                                                   { dup: { n: 0 } },
                                                                   { idx: { cached: false,
                                                                            pushPath: false,
                                                                            path: [
                                                                                   { tag: 'value',
                                                                                     value: { value: _descriptor_8.toValue(7n),
                                                                                              alignment: _descriptor_8.alignment() } }] } },
                                                                   { push: { storage: false,
                                                                             value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                          alignment: _descriptor_0.alignment() }).encode() } },
                                                                   'member',
                                                                   { popeq: { cached: true,
                                                                              result: undefined } }]).value))
    {
      __compactRuntime.assert(this._equal_8(this._totalCommitment_0(opening_0),
                                            _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                      partialProofData,
                                                                                                      [
                                                                                                       { dup: { n: 0 } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_8.toValue(7n),
                                                                                                                                  alignment: _descriptor_8.alignment() } }] } },
                                                                                                       { idx: { cached: false,
                                                                                                                pushPath: false,
                                                                                                                path: [
                                                                                                                       { tag: 'value',
                                                                                                                         value: { value: _descriptor_0.toValue(p_0),
                                                                                                                                  alignment: _descriptor_0.alignment() } }] } },
                                                                                                       { popeq: { cached: false,
                                                                                                                  result: undefined } }]).value)),
                              'Period total opening does not match');
    } else {
      __compactRuntime.assert(this._equal_9(opening_0.total, 0n),
                              'Period has no total yet');
    }
    return opening_0.total;
  }
  _assertEmployer_0(context, partialProofData) {
    __compactRuntime.assert(this._equal_10(this._publicKey_0(this._localSecretKey_0(context,
                                                                                    partialProofData)),
                                           _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_8.toValue(0n),
                                                                                                                                 alignment: _descriptor_8.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'Caller is not the employer');
    return [];
  }
  _publicKey_0(sk_0) {
    return this._persistentHash_2([new Uint8Array([112, 97, 121, 114, 111, 108, 108, 58, 112, 107, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   sk_0]);
  }
  _payslipId_0(employee_0, period_0) {
    return this._persistentHash_0([new Uint8Array([112, 97, 121, 114, 111, 108, 108, 58, 115, 108, 105, 112, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   employee_0,
                                   __compactRuntime.convertFieldToBytes(32,
                                                                        period_0,
                                                                        'payroll.compact line 164 char 84')]);
  }
  _payslipCommitment_0(opening_0) {
    return this._persistentCommit_0(opening_0.details, opening_0.salt);
  }
  _salaryRulesCommitment_0(rules_0) {
    return this._persistentCommit_1(rules_0.bands, rules_0.salt);
  }
  _totalCommitment_0(opening_0) {
    return this._persistentCommit_2(opening_0.total, opening_0.salt);
  }
  _payTokenDomain_0() {
    return new Uint8Array([112, 97, 121, 114, 111, 108, 108, 58, 112, 84, 87, 68, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
  _setSalaryRules_0(context, partialProofData) {
    this._assertEmployer_0(context, partialProofData);
    const tmp_0 = this._salaryRulesCommitment_0(this._salaryRules_0(context,
                                                                    partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(2n),
                                                                                              alignment: _descriptor_8.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(3n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_6.toValue(tmp_1),
                                                                alignment: _descriptor_6.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _fundPeriod_0(context, partialProofData, period_0, budget_0) {
    this._assertEmployer_0(context, partialProofData);
    const p_0 = period_0;
    const amount_0 = budget_0;
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_8.toValue(9n),
                                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Period already funded');
    const nonce_0 = this._evolveNonce_0(_descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                  partialProofData,
                                                                                                  [
                                                                                                   { dup: { n: 0 } },
                                                                                                   { idx: { cached: false,
                                                                                                            pushPath: false,
                                                                                                            path: [
                                                                                                                   { tag: 'value',
                                                                                                                     value: { value: _descriptor_8.toValue(11n),
                                                                                                                              alignment: _descriptor_8.alignment() } }] } },
                                                                                                   { popeq: { cached: true,
                                                                                                              result: undefined } }]).value),
                                        new Uint8Array([112, 97, 121, 114, 111, 108, 108, 58, 109, 105, 110, 116, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
    const tmp_0 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(11n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_6.toValue(tmp_0),
                                                                alignment: _descriptor_6.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    this._mintShieldedToken_0(context,
                              partialProofData,
                              this._payTokenDomain_0(),
                              amount_0,
                              nonce_0,
                              this._left_0(this._ownPublicKey_0(context,
                                                                partialProofData)));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(9n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(amount_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _issuePayslip_0(context, partialProofData, employee_0, period_0) {
    this._assertEmployer_0(context, partialProofData);
    const emp_0 = employee_0;
    const p_0 = period_0;
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_8.toValue(8n),
                                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Period already closed');
    const id_0 = this._payslipId_0(emp_0, p_0);
    const opening_0 = this._payslipOpening_0(context, partialProofData, id_0);
    this._assertValidCalculation_0(opening_0.details);
    this._assertWithinRules_0(context, partialProofData, opening_0.details);
    const replaced_0 = this._replacedOpening_0(context, partialProofData, id_0);
    const exists_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_8.toValue(4n),
                                                                                                           alignment: _descriptor_8.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(id_0),
                                                                                                                                       alignment: _descriptor_3.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value);
    if (exists_0) {
      const previous_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                   partialProofData,
                                                                                   [
                                                                                    { dup: { n: 0 } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_8.toValue(4n),
                                                                                                               alignment: _descriptor_8.alignment() } }] } },
                                                                                    { idx: { cached: false,
                                                                                             pushPath: false,
                                                                                             path: [
                                                                                                    { tag: 'value',
                                                                                                      value: { value: _descriptor_3.toValue(id_0),
                                                                                                               alignment: _descriptor_3.alignment() } }] } },
                                                                                    { popeq: { cached: false,
                                                                                               result: undefined } }]).value);
      __compactRuntime.assert(previous_0.status === 0, 'Payslip already claimed');
      __compactRuntime.assert(this._equal_11(this._payslipCommitment_0(replaced_0),
                                             previous_0.commitment),
                              'Replaced opening does not match');
    } else {
      __compactRuntime.assert(this._equal_12(replaced_0.details.net, 0n),
                              'Nothing to replace');
    }
    let t_0, t_1;
    const total_0 = ((t1) => {
                      if (t1 > 18446744073709551615n) {
                        throw new __compactRuntime.CompactError('payroll.compact line 227 char 17: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 18446744073709551615');
                      }
                      return t1;
                    })((t_0 = this._currentTotal_0(context,
                                                   partialProofData,
                                                   p_0)
                              +
                              opening_0.details.net,
                        (t_1 = replaced_0.details.net,
                         (__compactRuntime.assert(t_0 >= t_1,
                                                  'result of subtraction would be negative'),
                          t_0 - t_1))));
    const tmp_0 = this._totalCommitment_0({ total: total_0,
                                            salt:
                                              this._nextTotalSalt_0(context,
                                                                    partialProofData,
                                                                    p_0) });
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(7n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const commitment_0 = this._payslipCommitment_0(opening_0);
    const tmp_1 = { employee: emp_0,
                    period: p_0,
                    commitment: commitment_0,
                    status: 0 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(4n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(id_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_1),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const prev_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_8.toValue(5n),
                                                                                                         alignment: _descriptor_8.alignment() } }] } },
                                                                              { push: { storage: false,
                                                                                        value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                     alignment: _descriptor_0.alignment() }).encode() } },
                                                                              'member',
                                                                              { popeq: { cached: true,
                                                                                         result: undefined } }]).value)
                   ?
                   _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                             partialProofData,
                                                                             [
                                                                              { dup: { n: 0 } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_8.toValue(5n),
                                                                                                         alignment: _descriptor_8.alignment() } }] } },
                                                                              { idx: { cached: false,
                                                                                       pushPath: false,
                                                                                       path: [
                                                                                              { tag: 'value',
                                                                                                value: { value: _descriptor_0.toValue(p_0),
                                                                                                         alignment: _descriptor_0.alignment() } }] } },
                                                                              { popeq: { cached: false,
                                                                                         result: undefined } }]).value)
                   :
                   new Uint8Array(32);
    const tmp_2 = this._persistentHash_2([prev_0, commitment_0]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(5n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(tmp_2),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const issued_0 = _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_8.toValue(6n),
                                                                                                           alignment: _descriptor_8.alignment() } }] } },
                                                                                { push: { storage: false,
                                                                                          value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                       alignment: _descriptor_0.alignment() }).encode() } },
                                                                                'member',
                                                                                { popeq: { cached: true,
                                                                                           result: undefined } }]).value)
                     ?
                     _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_8.toValue(6n),
                                                                                                           alignment: _descriptor_8.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(p_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value)
                     :
                     0n;
    const tmp_3 = ((t1) => {
                    if (t1 > 4294967295n) {
                      throw new __compactRuntime.CompactError('payroll.compact line 236 char 26: cast from Field or Uint value to smaller Uint value failed: ' + t1 + ' is greater than 4294967295');
                    }
                    return t1;
                  })(issued_0 + 1n);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(6n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_3),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _claimPayslip_0(context, partialProofData, period_0) {
    const p_0 = period_0;
    const id_0 = this._payslipId_0(this._publicKey_0(this._localSecretKey_0(context,
                                                                            partialProofData)),
                                   p_0);
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_8.toValue(4n),
                                                                                                                  alignment: _descriptor_8.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(id_0),
                                                                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'No payslip for this employee and period');
    const record_0 = _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_8.toValue(4n),
                                                                                                           alignment: _descriptor_8.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_3.toValue(id_0),
                                                                                                           alignment: _descriptor_3.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    __compactRuntime.assert(record_0.status === 0, 'Payslip already claimed');
    __compactRuntime.assert(this._equal_13(this._payslipCommitment_0(this._payslipOpening_0(context,
                                                                                            partialProofData,
                                                                                            id_0)),
                                           record_0.commitment),
                            'Opening does not match commitment');
    const tmp_0 = { employee: record_0.employee,
                    period: record_0.period,
                    commitment: record_0.commitment,
                    status: 1 };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(4n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(id_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_5.toValue(tmp_0),
                                                                                              alignment: _descriptor_5.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _closePeriod_0(context, partialProofData, period_0) {
    this._assertEmployer_0(context, partialProofData);
    const p_0 = period_0;
    __compactRuntime.assert(!_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_8.toValue(8n),
                                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Period already closed');
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_8.toValue(7n),
                                                                                                                  alignment: _descriptor_8.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Nothing issued for this period');
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_8.toValue(9n),
                                                                                                                  alignment: _descriptor_8.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Period not funded');
    const total_0 = this._currentTotal_0(context, partialProofData, p_0);
    __compactRuntime.assert(total_0
                            <=
                            _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_8.toValue(9n),
                                                                                                                  alignment: _descriptor_8.alignment() } }] } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_0.toValue(p_0),
                                                                                                                  alignment: _descriptor_0.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Total payroll exceeds the funded budget');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(8n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(total_0),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _attestPeriod_0(context, partialProofData, period_0) {
    __compactRuntime.assert(this._equal_14(this._publicKey_0(this._localSecretKey_0(context,
                                                                                    partialProofData)),
                                           _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                     partialProofData,
                                                                                                     [
                                                                                                      { dup: { n: 0 } },
                                                                                                      { idx: { cached: false,
                                                                                                               pushPath: false,
                                                                                                               path: [
                                                                                                                      { tag: 'value',
                                                                                                                        value: { value: _descriptor_8.toValue(1n),
                                                                                                                                 alignment: _descriptor_8.alignment() } }] } },
                                                                                                      { popeq: { cached: false,
                                                                                                                 result: undefined } }]).value)),
                            'Caller is not the auditor');
    const p_0 = period_0;
    __compactRuntime.assert(_descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_8.toValue(8n),
                                                                                                                  alignment: _descriptor_8.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Period is not closed yet');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_8.toValue(10n),
                                                                  alignment: _descriptor_8.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(p_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_7(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_8(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_9(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_10(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_11(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_12(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_13(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_14(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get employer() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_8.toValue(0n),
                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get auditor() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_8.toValue(1n),
                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get rulesCommitment() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_8.toValue(2n),
                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get rulesVersion() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_8.toValue(3n),
                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    payslips: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(4n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(4n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 77 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(4n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(key_0),
                                                                                                                                 alignment: _descriptor_3.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'payroll.compact line 77 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(4n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_3.toValue(key_0),
                                                                                                     alignment: _descriptor_3.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_3.fromValue(key.value),      _descriptor_5.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    periodRoots: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(5n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(5n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 79 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(5n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'payroll.compact line 79 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(5n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    periodIssued: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(6n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(6n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 81 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(6n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'payroll.compact line 81 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(6n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[6];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_0.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    periodTotals: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(7n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(7n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 83 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(7n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'payroll.compact line 83 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(7n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[7];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    periodClosed: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(8n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(8n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 85 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(8n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'payroll.compact line 85 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(8n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[8];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    periodBudgets: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(9n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(9n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 87 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(9n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(typeof(key_0) === 'bigint' && key_0 >= 0n && key_0 <= 4294967295n)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'payroll.compact line 87 char 1',
                                     'Uint<0..4294967296>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(9n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[9];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_1.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    auditedPeriods: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(10n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                                                                 alignment: _descriptor_1.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(10n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(typeof(elem_0) === 'bigint' && elem_0 >= 0n && elem_0 <= 4294967295n)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'payroll.compact line 89 char 1',
                                     'Uint<0..4294967296>',
                                     elem_0)
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_8.toValue(10n),
                                                                                                     alignment: _descriptor_8.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[10];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    get mintCount() {
      return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_8.toValue(11n),
                                                                                                   alignment: _descriptor_8.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  localSecretKey: (...args) => undefined,
  payslipOpening: (...args) => undefined,
  replacedOpening: (...args) => undefined,
  salaryRules: (...args) => undefined,
  periodTotal: (...args) => undefined,
  nextTotalSalt: (...args) => undefined
});
export const pureCircuits = {
  publicKey: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`publicKey: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('publicKey',
                                 'argument 1',
                                 'payroll.compact line 159 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._publicKey_0(sk_0);
  },
  payslipId: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`payslipId: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const employee_0 = args_0[0];
    const period_0 = args_0[1];
    if (!(employee_0.buffer instanceof ArrayBuffer && employee_0.BYTES_PER_ELEMENT === 1 && employee_0.length === 32)) {
      __compactRuntime.typeError('payslipId',
                                 'argument 1',
                                 'payroll.compact line 163 char 1',
                                 'Bytes<32>',
                                 employee_0)
    }
    if (!(typeof(period_0) === 'bigint' && period_0 >= 0n && period_0 <= 4294967295n)) {
      __compactRuntime.typeError('payslipId',
                                 'argument 2',
                                 'payroll.compact line 163 char 1',
                                 'Uint<0..4294967296>',
                                 period_0)
    }
    return _dummyContract._payslipId_0(employee_0, period_0);
  },
  payslipCommitment: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`payslipCommitment: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const opening_0 = args_0[0];
    if (!(typeof(opening_0) === 'object' && typeof(opening_0.details) === 'object' && typeof(opening_0.details.level) === 'bigint' && opening_0.details.level >= 0n && opening_0.details.level <= 255n && typeof(opening_0.details.base) === 'bigint' && opening_0.details.base >= 0n && opening_0.details.base <= 18446744073709551615n && typeof(opening_0.details.allowance) === 'bigint' && opening_0.details.allowance >= 0n && opening_0.details.allowance <= 18446744073709551615n && typeof(opening_0.details.bonus) === 'bigint' && opening_0.details.bonus >= 0n && opening_0.details.bonus <= 18446744073709551615n && typeof(opening_0.details.labor) === 'bigint' && opening_0.details.labor >= 0n && opening_0.details.labor <= 18446744073709551615n && typeof(opening_0.details.health) === 'bigint' && opening_0.details.health >= 0n && opening_0.details.health <= 18446744073709551615n && typeof(opening_0.details.tax) === 'bigint' && opening_0.details.tax >= 0n && opening_0.details.tax <= 18446744073709551615n && typeof(opening_0.details.net) === 'bigint' && opening_0.details.net >= 0n && opening_0.details.net <= 18446744073709551615n && opening_0.salt.buffer instanceof ArrayBuffer && opening_0.salt.BYTES_PER_ELEMENT === 1 && opening_0.salt.length === 32)) {
      __compactRuntime.typeError('payslipCommitment',
                                 'argument 1',
                                 'payroll.compact line 167 char 1',
                                 'struct PayslipOpening<details: struct PayslipDetails<level: Uint<0..256>, base: Uint<0..18446744073709551616>, allowance: Uint<0..18446744073709551616>, bonus: Uint<0..18446744073709551616>, labor: Uint<0..18446744073709551616>, health: Uint<0..18446744073709551616>, tax: Uint<0..18446744073709551616>, net: Uint<0..18446744073709551616>>, salt: Bytes<32>>',
                                 opening_0)
    }
    return _dummyContract._payslipCommitment_0(opening_0);
  },
  salaryRulesCommitment: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`salaryRulesCommitment: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const rules_0 = args_0[0];
    if (!(typeof(rules_0) === 'object' && Array.isArray(rules_0.bands) && rules_0.bands.length === 5 && rules_0.bands.every((t) => typeof(t) === 'object' && typeof(t.minBase) === 'bigint' && t.minBase >= 0n && t.minBase <= 18446744073709551615n && typeof(t.maxBase) === 'bigint' && t.maxBase >= 0n && t.maxBase <= 18446744073709551615n && typeof(t.maxAllowance) === 'bigint' && t.maxAllowance >= 0n && t.maxAllowance <= 18446744073709551615n && typeof(t.maxBonus) === 'bigint' && t.maxBonus >= 0n && t.maxBonus <= 18446744073709551615n) && rules_0.salt.buffer instanceof ArrayBuffer && rules_0.salt.BYTES_PER_ELEMENT === 1 && rules_0.salt.length === 32)) {
      __compactRuntime.typeError('salaryRulesCommitment',
                                 'argument 1',
                                 'payroll.compact line 171 char 1',
                                 'struct SalaryRules<bands: Vector<5, struct SalaryBand<minBase: Uint<0..18446744073709551616>, maxBase: Uint<0..18446744073709551616>, maxAllowance: Uint<0..18446744073709551616>, maxBonus: Uint<0..18446744073709551616>>>, salt: Bytes<32>>',
                                 rules_0)
    }
    return _dummyContract._salaryRulesCommitment_0(rules_0);
  },
  totalCommitment: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`totalCommitment: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const opening_0 = args_0[0];
    if (!(typeof(opening_0) === 'object' && typeof(opening_0.total) === 'bigint' && opening_0.total >= 0n && opening_0.total <= 18446744073709551615n && opening_0.salt.buffer instanceof ArrayBuffer && opening_0.salt.BYTES_PER_ELEMENT === 1 && opening_0.salt.length === 32)) {
      __compactRuntime.typeError('totalCommitment',
                                 'argument 1',
                                 'payroll.compact line 175 char 1',
                                 'struct TotalOpening<total: Uint<0..18446744073709551616>, salt: Bytes<32>>',
                                 opening_0)
    }
    return _dummyContract._totalCommitment_0(opening_0);
  },
  payTokenDomain: (...args_0) => {
    if (args_0.length !== 0) {
      throw new __compactRuntime.CompactError(`payTokenDomain: expected 0 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    return _dummyContract._payTokenDomain_0();
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
