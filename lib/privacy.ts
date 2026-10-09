// Sealed boxes for distributing payslip openings off-chain.
//
// The opening of every payslip (figures + salt) is sealed separately for each
// authorised reader, the employee and the auditor, using ECDH P-256 +
// AES-GCM. The on-chain commitment lives in the Midnight contract
// (contracts/midnight/src/payroll.compact); readers decrypt their copy and
// check it against that commitment with the contract's payslipCommitment
// circuit (lib/chain/core.ts).
//
// In this MVP the keystore lives in localStorage to stand in for each party's
// wallet. In production every private key stays in its owner's wallet and only
// the public keys are published.

export type SealedBox = { epk: JsonWebKey; iv: string; ct: string };

export type Identity = { publicKey: JsonWebKey; privateKey: JsonWebKey };
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

export async function generateIdentity(): Promise<Identity> {
  const pair = await crypto.subtle.generateKey(ECDH, true, ['deriveKey']);
  return {
    publicKey: await crypto.subtle.exportKey('jwk', pair.publicKey),
    privateKey: await crypto.subtle.exportKey('jwk', pair.privateKey),
  };
}

/** Loads the demo keystore, creating identities for any holder that has none yet. */
export async function loadKeystore(holderIds: string[]): Promise<Keystore> {
  let store: Keystore = {};
  try {
    store = JSON.parse(localStorage.getItem(KEYSTORE_KEY) || '{}');
  } catch {
    store = {};
  }
  let changed = false;
  for (const id of holderIds) {
    if (!store[id]) {
      store[id] = await generateIdentity();
      changed = true;
    }
  }
  if (changed) localStorage.setItem(KEYSTORE_KEY, JSON.stringify(store));
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
  const key = await deriveAesKey(ephemeral.privateKey, recipientPublicKey, 'encrypt');
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
