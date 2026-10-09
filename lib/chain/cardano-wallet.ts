// Cardano side of the payroll: finds the reserve UTxO for a Midnight payroll
// contract and submits lock / anchor / release / reclaim transactions through a
// CIP-30 browser wallet (Eternl, Lace, ...). In local mode the reserve is
// simulated so the demo works without wallets or test ADA.

import {
  BlockfrostProvider,
  BrowserWallet,
  KoiosProvider,
  MeshTxBuilder,
  deserializeAddress,
  type UTxO,
} from '@meshsdk/core';
import {
  buildAnchorTx,
  buildLockTx,
  buildReclaimTx,
  buildReleaseTx,
  parseReserveDatum,
  reserveScript,
  type CardanoNetwork,
  type ReserveDatum,
} from './cardano-reserve';
import { load, save, type ChainMode } from './core';

export const CARDANO_NETWORK = (process.env.NEXT_PUBLIC_CARDANO_NETWORK ?? 'preprod') as CardanoNetwork;
const BLOCKFROST_KEY = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;

export type ReserveStatus = {
  mode: ChainMode;
  datum: ReserveDatum;
  lovelace: bigint;
  utxo?: UTxO;
  txHash: string;
};

/** Koios needs no API key on Preprod; Blockfrost is used when a project id is configured. */
const provider = () =>
  BLOCKFROST_KEY ? new BlockfrostProvider(BLOCKFROST_KEY) : new KoiosProvider(`https://${CARDANO_NETWORK}.koios.rest/api/v1`);

export const cardanoWallets = () => BrowserWallet.getInstalledWallets();

export class CardanoReserveClient {
  private constructor(
    private readonly wallet: BrowserWallet,
    readonly address: string,
  ) {}

  static async connect(walletName: string) {
    const wallet = await BrowserWallet.enable(walletName);
    if ((await wallet.getNetworkId()) !== (CARDANO_NETWORK === 'mainnet' ? 1 : 0)) {
      throw new Error(`Switch the Cardano wallet to ${CARDANO_NETWORK}`);
    }
    return new CardanoReserveClient(wallet, await wallet.getChangeAddress());
  }

  get paymentKeyHash() {
    return deserializeAddress(this.address).pubKeyHash;
  }

  private async context() {
    const [walletUtxos, collateral] = await Promise.all([this.wallet.getUtxos(), this.wallet.getCollateral()]);
    return { network: CARDANO_NETWORK, walletUtxos, changeAddress: this.address, collateral: collateral[0] };
  }

  private builder() {
    const p = provider();
    return new MeshTxBuilder({ fetcher: p, submitter: p, evaluator: p });
  }

  private async signAndSubmit(unsigned: string, partial = false) {
    const signed = await this.wallet.signTx(unsigned, partial);
    return this.wallet.submitTx(signed);
  }

  async lock(datum: ReserveDatum, lovelace: bigint) {
    return this.signAndSubmit(await buildLockTx(this.builder(), await this.context(), datum, lovelace));
  }

  async anchor(reserve: ReserveStatus, payrollRoot: string, payslipCount: number) {
    if (!reserve.utxo) throw new Error('Reserve UTxO not found on chain');
    const tx = await buildAnchorTx(this.builder(), await this.context(), reserve.utxo, reserve.datum, payrollRoot, payslipCount);
    return this.signAndSubmit(tx);
  }

  /** Needs the auditor's signature as well; with separate wallets, pass the partially signed tx along. */
  async release(reserve: ReserveStatus) {
    if (!reserve.utxo) throw new Error('Reserve UTxO not found on chain');
    const tx = await buildReleaseTx(this.builder(), await this.context(), reserve.utxo, reserve.datum, this.address);
    return this.signAndSubmit(tx, reserve.datum.auditor !== reserve.datum.employer);
  }

  async reclaim(reserve: ReserveStatus) {
    if (!reserve.utxo) throw new Error('Reserve UTxO not found on chain');
    return this.signAndSubmit(await buildReclaimTx(this.builder(), await this.context(), reserve.utxo, reserve.datum));
  }
}

/** Finds the reserve locked for `midnightContract` and `period` at the script address. */
export async function findReserve(midnightContract: string, period: number): Promise<ReserveStatus | null> {
  const utxos = await provider().fetchAddressUTxOs(reserveScript(CARDANO_NETWORK).address);
  for (const utxo of utxos) {
    if (!utxo.output.plutusData) continue;
    try {
      const datum = parseReserveDatum(utxo.output.plutusData);
      if (datum.midnightContract === midnightContract && datum.period === period) {
        const lovelace = BigInt(utxo.output.amount.find(a => a.unit === 'lovelace')?.quantity ?? '0');
        return { mode: 'preprod', datum, lovelace, utxo, txHash: utxo.input.txHash };
      }
    } catch {
      // not one of ours
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Local simulation, keyed the same way as the on-chain reserve.

const LOCAL_KEY = 'payrollLocalReserve.v1';
type LocalReserves = Record<string, ReserveStatus>;
const localKey = (contract: string, period: number) => `${contract}:${period}`;
const fakeTxHash = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');

export const localReserve = {
  find(contract: string, period: number): ReserveStatus | null {
    return load<LocalReserves>(LOCAL_KEY, {})[localKey(contract, period)] ?? null;
  },
  lock(datum: ReserveDatum, lovelace: bigint): ReserveStatus {
    const status: ReserveStatus = { mode: 'local', datum, lovelace, txHash: fakeTxHash() };
    save(LOCAL_KEY, { ...load<LocalReserves>(LOCAL_KEY, {}), [localKey(datum.midnightContract, datum.period)]: status });
    return status;
  },
  /** Applies the same rules as the Aiken validator's Anchor branch. */
  anchor(reserve: ReserveStatus, payrollRoot: string, payslipCount: number): ReserveStatus {
    if (payslipCount <= reserve.datum.payslipCount) throw new Error('Payslip count must increase');
    return localReserve.lock({ ...reserve.datum, payrollRoot, payslipCount }, reserve.lovelace);
  },
};
