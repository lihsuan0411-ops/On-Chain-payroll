// Sealed boxes for distributing payslip openings off-chain.
//
// The opening of every payslip (figures + salt) is sealed separately for each
// authorised reader, the employee and the auditor, using ECDH P-256 +
// AES-GCM. The on-chain commitment lives in the Midnight contract
// (contracts/midnight/src/payroll.compact); readers decrypt their copy and
// check it against that commitment with the contract's payslipCommitment
// circuit (lib/chain/core.ts).
//
// Identities come from one of two places:
//   - derived from a wallet signature (identityFromSeed, lib/chain/wallet-keys.ts):
//     the private key lives only in memory and only the public key is stored,
//     so the holder can recover it on any device by signing again;
//   - otherwise a random demo identity kept in localStorage (Local mode).

import { p256 } from '@noble/curves/nist.js';

export type SealedBox = { epk: JsonWebKey; iv: string; ct: string };

/** privateKey is absent for holders whose key is derived from someone else's wallet. */
export type Identity = { publicKey: JsonWebKey; privateKey?: JsonWebKey };
export type Keystore = Record<string, Identity>;

const ECDH = { name: 'ECDH', namedCurve: 'P-256' } as const;
const KEYSTORE_KEY = 'payrollKeystore.v1';

const toB64 = (buf: ArrayBuffer | Uint8Array) => {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  bytes.forEach(b => { s += String.fromCharCode(b); });
  return btoa(s);
};

const fromB64 = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const toB64Url = (bytes: Uint8Array) => toB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** Deterministic P-256 identity from a 32-byte seed (e.g. a hashed wallet signature). */
export async function identityFromSeed(seed: Uint8Array): Promise<Identity> {
  let sk = new Uint8Array(await crypto.subtle.digest('SHA-256', seed as BufferSource));
  while (!p256.utils.isValidSecretKey(sk)) sk = new Uint8Array(await crypto.subtle.digest('SHA-256', sk as BufferSource));
  const point = p256.getPublicKey(sk, false); // 0x04 || X || Y
  const publicKey: JsonWebKey = { kty: 'EC', crv: 'P-256', x: toB64Url(point.slice(1, 33)), y: toB64Url(point.slice(33)), ext: true };
  return { publicKey, privateKey: { ...publicKey, d: toB64Url(sk) } };
}

// Wallet-derived identities for this session; never persisted.
const derived = new Map<string, Identity>();

/** Uses a wallet-derived identity for `holder` and publishes only its public key. */
export function setDerivedIdentity(holder: string, identity: Identity) {
  derived.set(holder, identity);
  const store = readStore();
  store[holder] = { publicKey: identity.publicKey };
  localStorage.setItem(KEYSTORE_KEY, JSON.stringify(store));
}

function readStore(): Keystore {
  try {
    return JSON.parse(localStorage.getItem(KEYSTORE_KEY) || '{}');
  } catch {
    return {};
  }
}

export async function generateIdentity(): Promise<Identity> {
  const pair = await crypto.subtle.generateKey(ECDH, true, ['deriveKey']);
  return {
    publicKey: await crypto.subtle.exportKey('jwk', pair.publicKey),
    privateKey: await crypto.subtle.exportKey('jwk', pair.privateKey),
  };
}

/**
 * Loads the keystore, creating demo identities for holders that have none yet.
 * Wallet-derived identities from this session take precedence.
 */
export async function loadKeystore(holderIds: string[]): Promise<Keystore> {
  const store = readStore();
  let changed = false;
  for (const id of holderIds) {
    if (!store[id]) {
      store[id] = await generateIdentity();
      changed = true;
    }
  }
  if (changed) localStorage.setItem(KEYSTORE_KEY, JSON.stringify(store));
  for (const [holder, identity] of derived) store[holder] = identity;
  return store;
}

async function deriveAesKey(privateJwk: JsonWebKey, publicJwk: JsonWebKey, usage: KeyUsage) {
  const priv = await crypto.subtle.importKey('jwk', privateJwk, ECDH, false, ['deriveKey']);
  const pub = await crypto.subtle.importKey('jwk', publicJwk, ECDH, false, []);
  return crypto.subtle.deriveKey({ name: 'ECDH', public: pub }, priv, { name: 'AES-GCM', length: 256 }, false, [usage]);
}

/** Encrypts `payload` so that only the holder of `recipientPublicKey` can read it. */
export async function seal(recipientPublicKey: JsonWebKey, payload: unknown): Promise<SealedBox> {
  const ephemeral = await generateIdentity();
  const key = await deriveAesKey(ephemeral.privateKey!, recipientPublicKey, 'encrypt');
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(payload)));
  return { epk: ephemeral.publicKey, iv: toB64(iv), ct: toB64(ct) };
}

/** Decrypts a sealed box with the recipient's private key. Throws if the key or ciphertext is wrong. */
export async function open<T = unknown>(recipientPrivateKey: JsonWebKey, box: SealedBox): Promise<T> {
  const key = await deriveAesKey(recipientPrivateKey, box.epk, 'decrypt');
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(box.iv) }, key, fromB64(box.ct));
  return JSON.parse(new TextDecoder().decode(pt));
}
