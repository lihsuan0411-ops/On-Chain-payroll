// Lace (Midnight) wallet glue for the browser: DApp Connector API v4 →
// Midnight.js providers for NetworkPayrollBackend, plus shielded payouts.

import { Buffer } from 'buffer';
import semver from 'semver';
import type { ConnectedAPI, InitialAPI } from '@midnight-ntwrk/dapp-connector-api';
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { createProofProvider, type UnboundTransaction } from '@midnight-ntwrk/midnight-js-types';
import { fromHex, toHex, rawTokenType } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import {
  Transaction,
  type Binding,
  type FinalizedTransaction,
  type Proof,
  type SignatureEnabled,
} from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { pureCircuits, type PayrollPrivateState } from '@payroll/midnight-contract';
import { localPrivateStateProvider } from './private-state';
import type { CircuitId, PayrollProviders, Payout } from './backend-network';
import type { RoleId } from './core';

if (typeof globalThis.Buffer === 'undefined') globalThis.Buffer = Buffer as unknown as typeof globalThis.Buffer;

export const MIDNIGHT_NETWORK_ID = process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK_ID ?? 'preprod';
const FALLBACK_PROOF_SERVER = process.env.NEXT_PUBLIC_PROOF_SERVER_URL ?? 'http://localhost:6300';
const COMPATIBLE_CONNECTOR_API = '4.x';

/** Finds a Midnight wallet (Lace) implementing DApp Connector API 4.x. */
export function findMidnightWallet(): InitialAPI | undefined {
  const injected = (globalThis as { midnight?: Record<string, unknown> }).midnight;
  if (!injected) return undefined;
  return Object.values(injected).find(
    (w): w is InitialAPI =>
      !!w && typeof w === 'object' && 'apiVersion' in w && semver.satisfies(String((w as InitialAPI).apiVersion), COMPATIBLE_CONNECTOR_API),
  );
}

export async function connectMidnightWallet(): Promise<ConnectedAPI> {
  // Extensions inject window.midnight shortly after load.
  for (let i = 0; i < 20 && !findMidnightWallet(); i++) await new Promise(r => setTimeout(r, 100));
  const wallet = findMidnightWallet();
  if (!wallet) throw new Error('Lace (Midnight) wallet not found. Install Lace and enable Midnight Preprod.');
  setNetworkId(MIDNIGHT_NETWORK_ID);
  return wallet.connect(MIDNIGHT_NETWORK_ID);
}

export const NO_DUST_MESSAGE =
  'Your Lace wallet has no DUST, which pays Midnight transaction fees. In Lace, open Midnight and designate your tNIGHT for DUST generation, then wait until DUST appears.';

/** Fails fast, before any proving, when the wallet cannot pay fees. */
export async function assertCanPayFees(api: ConnectedAPI) {
  const { balance } = await api.getDustBalance();
  if (balance <= 0n) throw new Error(NO_DUST_MESSAGE);
}

export async function walletStatus(api: ConnectedAPI) {
  const [dust, config] = await Promise.all([api.getDustBalance(), api.getConfiguration()]);
  return { dust: dust.balance, dustCap: dust.cap, networkId: config.networkId, proverServerUri: config.proverServerUri };
}

export async function laceProviders(api: ConnectedAPI): Promise<PayrollProviders> {
  const config = await api.getConfiguration();
  const zkConfigProvider = new FetchZkConfigProvider<CircuitId>(`${window.location.origin}/midnight/payroll`, fetch.bind(window));
  const shielded = await api.getShieldedAddresses();

  let proofProvider;
  try {
    proofProvider = createProofProvider(await api.getProvingProvider(zkConfigProvider));
  } catch {
    proofProvider = httpClientProofProvider(config.proverServerUri ?? FALLBACK_PROOF_SERVER, zkConfigProvider);
  }

  return {
    privateStateProvider: localPrivateStateProvider<RoleId, PayrollPrivateState>(),
    zkConfigProvider,
    proofProvider,
    publicDataProvider: indexerPublicDataProvider(config.indexerUri, config.indexerWsUri),
    walletProvider: {
      getCoinPublicKey: () => shielded.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => shielded.shieldedEncryptionPublicKey,
      balanceTx: async (tx: UnboundTransaction): Promise<FinalizedTransaction> => {
        await assertCanPayFees(api);
        const { tx: balanced } = await api.balanceUnsealedTransaction(toHex(tx.serialize()));
        return Transaction.deserialize<SignatureEnabled, Proof, Binding>('signature', 'proof', 'binding', fromHex(balanced));
      },
    },
    midnightProvider: {
      submitTx: async (tx: FinalizedTransaction) => {
        await api.submitTransaction(toHex(tx.serialize()));
        return tx.identifiers()[0];
      },
    },
  } as PayrollProviders;
}

/** Pays net salary as shielded pTWD from the employer's Lace wallet; amounts stay private. */
export const lacePayout =
  (api: ConnectedAPI): Payout =>
  async (shieldedAddress, amount, contractAddress) => {
    const tokenType = rawTokenType(pureCircuits.payTokenDomain(), contractAddress);
    const { tx } = await api.makeTransfer([{ kind: 'shielded', type: tokenType, value: amount, recipient: shieldedAddress }]);
    await api.submitTransaction(tx);
    const finalized = Transaction.deserialize<SignatureEnabled, Proof, Binding>('signature', 'proof', 'binding', fromHex(tx));
    return { txId: String(finalized.identifiers()[0]), mode: 'preprod' };
  };
