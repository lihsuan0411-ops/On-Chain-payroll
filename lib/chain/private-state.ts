// localStorage-backed PrivateStateProvider for Midnight.js, scoped by contract
// address like the official providers. Values are stored with Uint8Array/bigint
// support. Suitable for this demo; production should use the encrypted
// level-private-state-provider or wallet-held private state.

import type {
  ExportPrivateStatesOptions,
  ExportSigningKeysOptions,
  ImportPrivateStatesOptions,
  ImportPrivateStatesResult,
  ImportSigningKeysOptions,
  ImportSigningKeysResult,
  PrivateStateExport,
  PrivateStateId,
  PrivateStateProvider,
  SigningKeyExport,
} from '@midnight-ntwrk/midnight-js-types';
import type { ContractAddress, SigningKey } from '@midnight-ntwrk/midnight-js-protocol/compact-runtime';
import { load, save, stringify, parse } from './core';

const STATES_KEY = 'payrollPrivateStates.v1';
const SIGNING_KEYS_KEY = 'payrollSigningKeys.v1';

type Conflict = 'error' | 'skip' | 'overwrite';

export function localPrivateStateProvider<PSI extends PrivateStateId, PS>(): PrivateStateProvider<PSI, PS> {
  let contractAddress: ContractAddress | null = null;

  const scope = () => {
    if (!contractAddress) throw new Error('Contract address not set. Call setContractAddress() first.');
    return contractAddress;
  };
  const allStates = () => load<Record<string, Record<string, PS>>>(STATES_KEY, {});
  const scoped = () => allStates()[scope()] ?? {};
  const writeScoped = (states: Record<string, PS>) => save(STATES_KEY, { ...allStates(), [scope()]: states });
  const signingKeys = () => load<Record<string, SigningKey>>(SIGNING_KEYS_KEY, {});

  function merge<T>(target: Record<string, T>, incoming: Record<string, T>, strategy: Conflict) {
    let imported = 0;
    let skipped = 0;
    let overwritten = 0;
    for (const [id, value] of Object.entries(incoming)) {
      if (id in target) {
        if (strategy === 'skip') {
          skipped++;
          continue;
        }
        if (strategy === 'error') throw new Error(`Conflict for '${id}'`);
        overwritten++;
      } else {
        imported++;
      }
      target[id] = value;
    }
    return { imported, skipped, overwritten };
  }

  return {
    setContractAddress(address: ContractAddress) {
      contractAddress = address;
    },
    async set(id: PSI, state: PS) {
      writeScoped({ ...scoped(), [id]: state });
    },
    async get(id: PSI) {
      return scoped()[id] ?? null;
    },
    async remove(id: PSI) {
      const states = scoped();
      delete states[id];
      writeScoped(states);
    },
    async clear() {
      const states = allStates();
      delete states[scope()];
      save(STATES_KEY, states);
    },
    async setSigningKey(address: ContractAddress, key: SigningKey) {
      save(SIGNING_KEYS_KEY, { ...signingKeys(), [address]: key });
    },
    async getSigningKey(address: ContractAddress) {
      return signingKeys()[address] ?? null;
    },
    async removeSigningKey(address: ContractAddress) {
      const keys = signingKeys();
      delete keys[address];
      save(SIGNING_KEYS_KEY, keys);
    },
    async clearSigningKeys() {
      save(SIGNING_KEYS_KEY, {});
    },
    async exportPrivateStates(_options?: ExportPrivateStatesOptions): Promise<PrivateStateExport> {
      return {
        format: 'midnight-private-state-export',
        encryptedPayload: stringify({ contractAddress: scope(), states: scoped() }),
        salt: 'local-private-state-provider',
      } as PrivateStateExport;
    },
    async importPrivateStates(data: PrivateStateExport, options?: ImportPrivateStatesOptions): Promise<ImportPrivateStatesResult> {
      const { states = {} } = parse<{ states?: Record<string, PS> }>(data.encryptedPayload);
      const target = scoped();
      const result = merge(target, states, options?.conflictStrategy ?? 'error');
      writeScoped(target);
      return result;
    },
    async exportSigningKeys(_options?: ExportSigningKeysOptions): Promise<SigningKeyExport> {
      return {
        format: 'midnight-signing-key-export',
        encryptedPayload: stringify({ keys: signingKeys() }),
        salt: 'local-private-state-provider',
      } as SigningKeyExport;
    },
    async importSigningKeys(data: SigningKeyExport, options?: ImportSigningKeysOptions): Promise<ImportSigningKeysResult> {
      const { keys = {} } = parse<{ keys?: Record<string, SigningKey> }>(data.encryptedPayload);
      const target = signingKeys();
      const result = merge(target, keys, options?.conflictStrategy ?? 'error');
      save(SIGNING_KEYS_KEY, target);
      return result;
    },
  };
}
