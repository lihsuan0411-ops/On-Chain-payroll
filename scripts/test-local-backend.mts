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

await backend.fundPeriod(PERIOD, 250_000n);

const alicePk = core.publicKeyFor(core.employeeRole('Alice'));
const opening = core.newOpening(75000, 5000, 6000);
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

await backend.attestPeriod(PERIOD);
ledger = await LocalPayrollBackend.open().readLedger();
[view] = core.payslipViews(ledger, EMPLOYEES);
assert.equal(view.status, 'Claimed');
const summary = core.periodSummary(ledger, PERIOD);
assert.deepEqual({ ...summary, root: !!summary.root }, { root: true, issued: 1, budget: 250_000n, audited: true });

// Bad figures are rejected by the circuit itself.
const bobPk = core.publicKeyFor(core.employeeRole('Bob'));
const bad = core.newOpening(90000, 8000, 0);
await assert.rejects(
  () => backend.issuePayslip(bobPk, PERIOD, { ...bad, details: { ...bad.details, tax: 0n } }),
  /Income tax/,
);

console.log('local backend: all checks passed');
