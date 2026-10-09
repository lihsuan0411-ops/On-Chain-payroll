// Exercises lib/chain/backend-local.ts end to end under Node, including
// persistence of the serialized contract state across "reloads".
//
// Run: npm run chain:test:local

import assert from 'node:assert/strict';

const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
};

const { LocalPayrollBackend } = await import('../lib/chain/backend-local');
const core = await import('../lib/chain/core');
const { loadKeystore } = await import('../lib/privacy');

const PERIOD = 202605n;
const EMPLOYEES = ['Aden', 'Alice', 'Bob'];

let backend = LocalPayrollBackend.open();
const keystore = await loadKeystore([...EMPLOYEES, 'AUDITOR']);

await backend.setSalaryRules();
await backend.fundPeriod(PERIOD, 250_000n);

const alicePk = core.publicKeyFor(core.employeeRole('Alice'));
const opening = core.newOpening(3, 75000, 5000, 6000);
assert.equal(opening.details.net, 78700n);
await backend.issuePayslip(alicePk, PERIOD, opening);

const idHex = core.toHex(core.pureCircuits.payslipId(alicePk, PERIOD));
await core.postOpening(backend.contractAddress, idHex, opening, ['Alice', 'AUDITOR'], keystore);

// Reload from localStorage, as the browser would after a refresh.
backend = LocalPayrollBackend.open();
let ledger = await backend.readLedger();
let [view] = core.payslipViews(ledger, EMPLOYEES);
assert.equal(view.employeeId, 'Alice');
assert.equal(view.period, '2026-05');
assert.equal(view.status, 'Pending');

const forAlice = await core.readOpening(backend.contractAddress, view, 'Alice', keystore);
assert.ok(forAlice?.verified, 'Alice decrypts and verifies her payslip');
assert.equal(forAlice!.opening.details.net, 78700n);
const forAuditor = await core.readOpening(backend.contractAddress, view, 'AUDITOR', keystore);
assert.ok(forAuditor?.verified, 'auditor decrypts and verifies');
assert.equal(await core.readOpening(backend.contractAddress, view, 'Bob', keystore), null, 'Bob cannot read it');

// Bob cannot claim Alice's payslip even with her opening.
await assert.rejects(() => backend.claimPayslip('Bob', PERIOD, forAlice!.opening), /No payslip/);
await backend.claimPayslip('Alice', PERIOD, forAlice!.opening);
await assert.rejects(() => backend.claimPayslip('Alice', PERIOD, forAlice!.opening), /already claimed/);

await assert.rejects(() => backend.attestPeriod(PERIOD), /not closed/);
await backend.closePeriod(PERIOD);
await backend.attestPeriod(PERIOD);
ledger = await LocalPayrollBackend.open().readLedger();
[view] = core.payslipViews(ledger, EMPLOYEES);
assert.equal(view.status, 'Claimed');
const summary = core.periodSummary(ledger, PERIOD);
assert.deepEqual(
  { ...summary, root: !!summary.root },
  { root: true, issued: 1, budget: 250_000n, closedTotal: 78_700n, audited: true, rulesPublished: true },
);

// After closing, nothing more can be issued; and wrong levels are rejected by the circuit itself.
const bobPk = core.publicKeyFor(core.employeeRole('Bob'));
await assert.rejects(() => backend.issuePayslip(bobPk, PERIOD, core.newOpening(4, 90000, 8000, 0)), /already closed/);
await assert.rejects(() => backend.issuePayslip(bobPk, 202606n, core.newOpening(1, 90000, 8000, 0)), /outside the band/);

console.log('local backend: all checks passed');

// ---------------------------------------------------------------------------
// Wallet-derived keys (lib/chain/wallet-keys.ts).
{
  const walletKeys = await import('../lib/chain/wallet-keys');
  const privacy = await import('../lib/privacy');
  const hmacKey = await crypto.subtle.importKey('raw', new Uint8Array(32).fill(9), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  // Stand-in for a CIP-30 wallet: deterministic like Ed25519 (CIP-8).
  const signer = {
    signData: async (m: string) => ({
      signature: core.toHex(new Uint8Array(await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(m)))),
    }),
  };
  const a = await walletKeys.deriveRoleKeys(signer, core.employeeRole('Carol'));
  const b = await walletKeys.deriveRoleKeys(signer, core.employeeRole('Carol'));
  assert.deepEqual(a.secretKey, b.secretKey, 'same signature -> same Midnight key');
  assert.deepEqual(a.identity, b.identity, 'same signature -> same view key');
  const other = await walletKeys.deriveRoleKeys(signer, core.employeeRole('Dave'));
  assert.notDeepEqual(a.secretKey, other.secretKey, 'roles get different keys');

  const randomSigner = { signData: async () => ({ signature: core.toHex(crypto.getRandomValues(new Uint8Array(64))) }) };
  await assert.rejects(() => walletKeys.deriveRoleKeys(randomSigner, 'auditor'), /randomised signatures/);

  // Unlocking registers the employee; the employer pays the registered key and
  // only the wallet-derived view key can open the payslip.
  const pk = await walletKeys.unlockRole(signer, core.employeeRole('Carol'), 'Carol');
  assert.equal(core.toHex(core.employeePublicKey('Carol')), pk);
  const ks = await privacy.loadKeystore(['Carol', 'AUDITOR']);
  const fresh = (await import('../lib/chain/backend-local')).LocalPayrollBackend.deploy();
  await fresh.setSalaryRules();
  const carolOpening = core.newOpening(2, 52000, 3000, 0);
  await fresh.issuePayslip(core.employeePublicKey('Carol'), PERIOD, carolOpening);
  const carolId = core.toHex(core.pureCircuits.payslipId(core.employeePublicKey('Carol'), PERIOD));
  await core.postOpening(fresh.contractAddress, carolId, carolOpening, ['Carol', 'AUDITOR'], ks);
  const [carolView] = core.payslipViews(await fresh.readLedger(), ['Carol']);
  assert.equal(carolView.employeeId, 'Carol');
  assert.ok((await core.readOpening(fresh.contractAddress, carolView, 'Carol', ks))?.verified);
  await fresh.claimPayslip('Carol', PERIOD, carolOpening);
  // Without the in-memory identity (new session, no signature yet) the payslip stays sealed.
  const stored = JSON.parse(localStorage.getItem('payrollKeystore.v1')!);
  assert.equal(stored.Carol.privateKey, undefined, 'derived private keys are never stored');
  console.log('wallet-derived keys: all checks passed');
}
