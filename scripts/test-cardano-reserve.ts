// Offline integration test for lib/chain/cardano-reserve.ts.
//
// Builds real transactions with Mesh and evaluates the compiled Aiken
// `payroll_reserve` script on them (UPLC, no network), proving that the
// datum/redeemer encoding used by the frontend matches the validator.
//
// Run: npm run cardano:test:offchain

import assert from 'node:assert/strict';
import { MeshTxBuilder, MeshWallet, OfflineFetcher, deserializeAddress, resolveTxHash, type UTxO } from '@meshsdk/core';
import { OfflineEvaluator } from '@meshsdk/core-csl';
import {
  buildAnchorTx,
  buildLockTx,
  buildReclaimTx,
  buildReleaseTx,
  reserveScript,
  datumToData,
  parseReserveDatum,
  releaseRedeemer,
  type ReserveDatum,
} from '../lib/chain/cardano-reserve';

const network = 'preprod' as const;
const fetcher = new OfflineFetcher(network);
const evaluator = new OfflineEvaluator(fetcher, network);
const builder = () => new MeshTxBuilder({ fetcher, evaluator });

const wallet = (words = MeshWallet.brew() as string[]) =>
  new MeshWallet({ networkId: 0, fetcher, key: { type: 'mnemonic', words } });

const utxo = (address: string, txHash: string, index: number, lovelace: bigint, plutusData?: string): UTxO => ({
  input: { txHash, outputIndex: index },
  output: { address, amount: [{ unit: 'lovelace', quantity: lovelace.toString() }], ...(plutusData ? { plutusData } : {}) },
});

const fakeHash = (n: number) => n.toString(16).padStart(64, '0');

let passed = 0;
const check = async (name: string, fn: () => Promise<void>) => {
  await fn();
  passed++;
  console.log(`  ✓ ${name}`);
};
// Negative cases must fail inside the validator, not somewhere else in tx building.
const rejects = async (fn: () => Promise<unknown>, reason = /validator crashed|failed script execution|Spend\[0\]|evaluat/i) => {
  await assert.rejects(fn, (e: unknown) => {
    const msg = typeof e === 'string' ? e : JSON.stringify(e, Object.getOwnPropertyNames(e as object));
    assert.match(msg, reason, `unexpected failure: ${msg.slice(0, 400)}`);
    return true;
  });
};

async function main() {
  // The offline fetcher has no cost models; Mesh falls back to defaults and warns.
  const warn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (String(args[0]).startsWith('Failed to fetch cost models')) return;
    warn(...args);
  };
  const employerWallet = wallet();
  const auditorWallet = wallet();
  await employerWallet.init();
  await auditorWallet.init();
  const employerAddr = await employerWallet.getChangeAddress();
  const auditorAddr = await auditorWallet.getChangeAddress();
  const employerPkh = deserializeAddress(employerAddr).pubKeyHash;
  const auditorPkh = deserializeAddress(auditorAddr).pubKeyHash;

  const funding = [utxo(employerAddr, fakeHash(1), 0, 200_000_000n), utxo(employerAddr, fakeHash(1), 1, 200_000_000n)];
  const collateral = utxo(employerAddr, fakeHash(2), 0, 5_000_000n);
  fetcher.addUTxOs([...funding, collateral]);
  const ctx = { network, walletUtxos: funding, changeAddress: employerAddr, collateral };

  const datum: ReserveDatum = {
    employer: employerPkh,
    auditor: auditorPkh,
    midnightContract: 'ab'.repeat(32),
    period: 202605,
    budget: 250_000n,
    payrollRoot: '',
    payslipCount: 0,
    unlockAfter: Date.now() - 60_000,
  };

  console.log('payroll_reserve off-chain tests');

  // 1. Lock the reserve and register the resulting UTxO with the offline fetcher.
  const lockTx = await buildLockTx(builder(), { ...ctx, collateral: undefined }, datum, 50_000_000n);
  const lockHash = resolveTxHash(lockTx);
  const script = reserveScript(network);
  const reserve: UTxO = {
    input: { txHash: lockHash, outputIndex: 0 },
    output: {
      address: script.address,
      amount: [{ unit: 'lovelace', quantity: '50000000' }],
      plutusData: (await import('@meshsdk/core')).serializeData(datumToData(datum)),
    },
  };
  fetcher.addUTxOs([reserve]);

  await check('round-trips the inline datum', async () => {
    assert.deepEqual(parseReserveDatum(reserve.output.plutusData!), datum);
  });

  const root = 'cd'.repeat(32);

  await check('anchor: employer updates the payroll root', async () => {
    const tx = await buildAnchorTx(builder(), ctx, reserve, datum, root, 2);
    assert.ok(tx.length > 0);
  });

  await check('anchor: rejected when the payslip count does not increase', async () => {
    await rejects(() => buildAnchorTx(builder(), ctx, reserve, datum, root, 0));
  });

  await check('anchor: rejected when other datum fields change', async () => {
    await rejects(() => buildAnchorTx(builder(), ctx, reserve, { ...datum, budget: 1n }, root, 2));
  });

  await check('anchor: rejected without the employer signature', async () => {
    await rejects(() => buildAnchorTx(builder(), ctx, reserve, { ...datum, employer: auditorPkh }, root, 2));
  });

  await check('release: accepted with employer + auditor', async () => {
    const tx = await buildReleaseTx(builder(), ctx, reserve, datum, employerAddr);
    assert.ok(tx.length > 0);
  });

  await check('release: rejected with only the employer', async () => {
    await rejects(() =>
      builder()
        .spendingPlutusScriptV3()
        .txIn(reserve.input.txHash, reserve.input.outputIndex, reserve.output.amount, reserve.output.address)
        .txInInlineDatumPresent()
        .txInRedeemerValue(releaseRedeemer())
        .txInScript(script.code)
        .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
        .txOut(employerAddr, reserve.output.amount)
        .requiredSignerHash(employerPkh)
        .changeAddress(employerAddr)
        .selectUtxosFrom(funding)
        .complete(),
    );
  });

  await check('reclaim: accepted after unlock time', async () => {
    const tx = await buildReclaimTx(builder(), ctx, reserve, datum);
    assert.ok(tx.length > 0);
  });

  await check('reclaim: refused before unlock time', async () => {
    await rejects(() => buildReclaimTx(builder(), ctx, reserve, { ...datum, unlockAfter: Date.now() + 3_600_000 }), /still locked/);
  });

  console.log(`\n${passed} passed`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
