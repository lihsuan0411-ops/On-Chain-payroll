// Transaction builders for the Aiken `payroll_reserve` validator on Cardano.
//
// The datum layout and redeemer constructors mirror
// contracts/cardano/validators/payroll_reserve.ak; scripts/test-cardano-reserve.ts
// runs these builders against the compiled script to keep them in sync.

import {
  applyCborEncoding,
  deserializeDatum,
  mConStr0,
  mConStr1,
  mConStr2,
  serializePlutusScript,
  SLOT_CONFIG_NETWORK,
  unixTimeToEnclosingSlot,
  type Data,
  type MeshTxBuilder,
  type UTxO,
} from '@meshsdk/core';
import blueprint from '../../contracts/cardano/plutus.json';

export type CardanoNetwork = 'preprod' | 'preview' | 'mainnet';

export type ReserveDatum = {
  employer: string; // payment key hash, hex
  auditor: string; // payment key hash, hex
  midnightContract: string; // Midnight contract address, hex
  period: number; // YYYYMM
  budget: bigint;
  payrollRoot: string; // hex, '' before the first anchor
  payslipCount: number;
  unlockAfter: number; // POSIX ms
};

const validator = blueprint.validators.find(v => v.title === 'payroll_reserve.payroll_reserve.spend');
if (!validator) throw new Error('payroll_reserve validator missing from plutus.json; run `npm run cardano:build`');

export const RESERVE_SCRIPT_HASH = validator.hash;
const scriptCbor = applyCborEncoding(validator.compiledCode);

export const reserveScript = (network: CardanoNetwork) => ({
  code: scriptCbor,
  address: serializePlutusScript({ code: scriptCbor, version: 'V3' }, undefined, network === 'mainnet' ? 1 : 0).address,
});

export const datumToData = (d: ReserveDatum) =>
  mConStr0([d.employer, d.auditor, d.midnightContract, d.period, d.budget, d.payrollRoot, d.payslipCount, d.unlockAfter]);

export const anchorRedeemer = (payrollRoot: string, payslipCount: number) => mConStr0([payrollRoot, payslipCount]);
export const releaseRedeemer = () => mConStr1([]);
export const reclaimRedeemer = () => mConStr2([]);

/** Parses the inline datum of a reserve UTxO. */
export function parseReserveDatum(plutusData: string): ReserveDatum {
  const { fields } = deserializeDatum<{ fields: Array<{ bytes?: string; int?: number | bigint }> }>(plutusData);
  const bytes = (i: number) => fields[i].bytes ?? '';
  const int = (i: number) => BigInt(fields[i].int ?? 0);
  return {
    employer: bytes(0),
    auditor: bytes(1),
    midnightContract: bytes(2),
    period: Number(int(3)),
    budget: int(4),
    payrollRoot: bytes(5),
    payslipCount: Number(int(6)),
    unlockAfter: Number(int(7)),
  };
}

type WalletContext = {
  network: CardanoNetwork;
  walletUtxos: UTxO[];
  changeAddress: string;
  collateral?: UTxO;
};

/** Locks `lovelace` at the reserve script with the initial datum. */
export async function buildLockTx(tx: MeshTxBuilder, ctx: WalletContext, datum: ReserveDatum, lovelace: bigint) {
  return tx
    .txOut(reserveScript(ctx.network).address, [{ unit: 'lovelace', quantity: lovelace.toString() }])
    .txOutInlineDatumValue(datumToData(datum))
    .changeAddress(ctx.changeAddress)
    .selectUtxosFrom(ctx.walletUtxos)
    .complete();
}

function spendReserve(tx: MeshTxBuilder, ctx: WalletContext, reserve: UTxO, redeemer: Data) {
  if (!ctx.collateral) throw new Error('A collateral UTxO is required to spend the reserve script');
  const script = reserveScript(ctx.network);
  return tx
    .spendingPlutusScriptV3()
    .txIn(reserve.input.txHash, reserve.input.outputIndex, reserve.output.amount, reserve.output.address)
    .txInInlineDatumPresent()
    .txInRedeemerValue(redeemer)
    .txInScript(script.code)
    .txInCollateral(
      ctx.collateral.input.txHash,
      ctx.collateral.input.outputIndex,
      ctx.collateral.output.amount,
      ctx.collateral.output.address,
    );
}

/** Employer re-anchors the latest Midnight payroll root; funds stay locked. */
export async function buildAnchorTx(
  tx: MeshTxBuilder,
  ctx: WalletContext,
  reserve: UTxO,
  current: ReserveDatum,
  payrollRoot: string,
  payslipCount: number,
) {
  const next: ReserveDatum = { ...current, payrollRoot, payslipCount };
  return spendReserve(tx, ctx, reserve, anchorRedeemer(payrollRoot, payslipCount))
    .txOut(reserve.output.address, reserve.output.amount)
    .txOutInlineDatumValue(datumToData(next))
    .requiredSignerHash(current.employer)
    .changeAddress(ctx.changeAddress)
    .selectUtxosFrom(ctx.walletUtxos)
    .complete();
}

/** Employer + auditor release the reserve to `payTo` after the audit. */
export async function buildReleaseTx(tx: MeshTxBuilder, ctx: WalletContext, reserve: UTxO, current: ReserveDatum, payTo: string) {
  return spendReserve(tx, ctx, reserve, releaseRedeemer())
    .txOut(payTo, reserve.output.amount)
    .requiredSignerHash(current.employer)
    .requiredSignerHash(current.auditor)
    .changeAddress(ctx.changeAddress)
    .selectUtxosFrom(ctx.walletUtxos)
    .complete();
}

/** Employer reclaims the reserve alone once `unlockAfter` has passed. */
export async function buildReclaimTx(tx: MeshTxBuilder, ctx: WalletContext, reserve: UTxO, current: ReserveDatum, now = Date.now()) {
  if (now <= current.unlockAfter) throw new Error('Reserve is still locked');
  const slot = unixTimeToEnclosingSlot(now, SLOT_CONFIG_NETWORK[ctx.network]);
  return spendReserve(tx, ctx, reserve, reclaimRedeemer())
    .txOut(ctx.changeAddress, reserve.output.amount)
    .invalidBefore(slot)
    .requiredSignerHash(current.employer)
    .changeAddress(ctx.changeAddress)
    .selectUtxosFrom(ctx.walletUtxos)
    .complete();
}
