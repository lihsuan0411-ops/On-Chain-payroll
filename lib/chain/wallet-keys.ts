// Derives a role's payroll keys from a CIP-30 wallet signature, so nobody has
// to store an extra secret: signing the same message again on any device
// recovers the same keys.
//
// From one signature over a fixed, role-specific message:
//   - the Midnight secret key that identifies the role in payroll.compact
//   - the P-256 view key that opens sealed payslips (lib/privacy.ts)
//
// Ed25519 (CIP-8) signatures are deterministic, but we sign twice and compare
// before trusting that, since keys from a randomised signer would be lost.

import { identityFromSeed, setDerivedIdentity } from '../privacy';
import { pureCircuits, registerAuditor, registerEmployee, setDerivedSecretKey, toHex, type RoleId } from './core';

export type DataSigner = { signData(payload: string): Promise<{ signature: string }> };

const sha256 = async (...parts: (Uint8Array | string)[]) => {
  const bytes = parts.map(p => (typeof p === 'string' ? new TextEncoder().encode(p) : p));
  const joined = new Uint8Array(bytes.reduce((n, b) => n + b.length, 0));
  let offset = 0;
  for (const b of bytes) {
    joined.set(b, offset);
    offset += b.length;
  }
  return new Uint8Array(await crypto.subtle.digest('SHA-256', joined));
};

export const derivationMessage = (role: RoleId) =>
  `On-Chain Payroll key derivation v1\nRole: ${role}\n\nSigning this message unlocks your payroll keys on this device. It is not a transaction and costs nothing.`;

export async function deriveRoleKeys(signer: DataSigner, role: RoleId) {
  const message = derivationMessage(role);
  const first = await signer.signData(message);
  const second = await signer.signData(message);
  if (first.signature !== second.signature) {
    throw new Error('This wallet produces randomised signatures, so keys cannot be derived from it. Use another CIP-30 wallet.');
  }
  const seed = await sha256(first.signature);
  return {
    secretKey: await sha256('payroll:midnight-sk:', seed),
    identity: await identityFromSeed(await sha256('payroll:view-key:', seed)),
  };
}

/**
 * Derives and activates the keys of `role` for this session. `holder` is the
 * sealed-box holder id (employee id or 'AUDITOR'; the employer has none).
 * Employees are added to the directory so the employer can pay them.
 */
export async function unlockRole(signer: DataSigner, role: RoleId, holder?: string) {
  const { secretKey, identity } = await deriveRoleKeys(signer, role);
  setDerivedSecretKey(role, secretKey);
  if (holder) setDerivedIdentity(holder, identity);
  const publicKey = toHex(pureCircuits.publicKey(secretKey));
  if (role.startsWith('employee:')) registerEmployee(role.slice('employee:'.length), { midnightPk: publicKey });
  if (role === 'auditor') registerAuditor(publicKey);
  return publicKey;
}
