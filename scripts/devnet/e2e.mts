// End-to-end test on a local Midnight devnet (node + indexer + proof server in
// Docker, started by @midnight-ntwrk/testkit-js).
//
// Uses the same NetworkPayrollBackend as the browser's Preprod mode, but with a
// genesis-funded Node wallet instead of Lace. Every circuit call below produces
// a real zero-knowledge proof on the proof server, and the node verifies it
// against the verifier keys stored at deployment before applying the tx.
//
// Run: npm run devnet:e2e            (EMPLOYEES=n for more payslips, default 5)

import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The chain layer persists to localStorage in the browser; give it one in Node.
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
};

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
process.env.INDEXER_TAG ??= process.arch === 'arm64' ? '4.3.5-arm64' : '4.3.5';

const testkit = await import('@midnight-ntwrk/testkit-js');
const { setNetworkId } = await import('@midnight-ntwrk/midnight-js-network-id');
const { NodeZkConfigProvider } = await import('@midnight-ntwrk/midnight-js-node-zk-config-provider');
const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider');
const { NetworkPayrollBackend, compiledPayroll } = await import('../../lib/chain/backend-network');
const { localPrivateStateProvider } = await import('../../lib/chain/private-state');
const core = await import('../../lib/chain/core');

const zkPath = path.resolve(root, 'contracts/midnight/src/managed/payroll');
const logDir = path.resolve(root, 'logs', 'devnet');
testkit.setContainersConfiguration({
  ...testkit.defaultContainersConfiguration,
  standalone: { ...testkit.defaultContainersConfiguration.standalone, path: here, fileName: 'compose.yml' },
  log: { ...testkit.defaultContainersConfiguration.log, path: logDir },
});

const logger = testkit.createLogger(path.join(logDir, `e2e_${new Date().toISOString().replace(/:/g, '_')}.log`));
const PERIOD = 202605n;
const EMPLOYEE_COUNT = Number(process.env.EMPLOYEES ?? 5);

let proofs = 0;
const timed = async <T,>(label: string, fn: () => Promise<T>, proves = true): Promise<T> => {
  const t0 = Date.now();
  const result = await fn();
  if (proves) proofs++;
  console.log(`  ✓ ${label} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  return result;
};
const rejected = async (label: string, fn: () => Promise<unknown>, reason: RegExp) => {
  await assert.rejects(fn, reason);
  console.log(`  ✓ rejected: ${label}`);
};

const env = testkit.getTestEnvironment(logger);
try {
  console.log('Starting local Midnight devnet (node, indexer, proof server)...');
  const config = await env.start();
  setNetworkId(config.networkId);
  const wallet = await env.getMidnightWalletProvider();
  console.log(`Devnet up. Indexer ${config.indexer}, proof server ${config.proofServer}`);

  const zkConfigProvider = new NodeZkConfigProvider(zkPath);
  const providers = {
    privateStateProvider: localPrivateStateProvider(),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(config.proofServer, zkConfigProvider),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    walletProvider: wallet,
    midnightProvider: wallet,
  } as any;
  const noPayout = async () => null;

  const backend = await timed('deploy payroll contract', () =>
    NetworkPayrollBackend.deploy(providers, noPayout, compiledPayroll(zkPath)),
  );
  console.log(`    contract ${backend.contractAddress}`);

  await timed('setSalaryRules (commit 5 salary bands)', () => backend.setSalaryRules());
  await timed('fundPeriod (mint 1,000,000 shielded pTWD)', () => backend.fundPeriod(PERIOD, 1_000_000n));

  // A demo org chart: one employee per level, cycling.
  const bands = core.employerBook(backend.contractAddress).rules.bands;
  const employees = Array.from({ length: EMPLOYEE_COUNT }, (_, i) => {
    const level = (i % 5) + 1;
    const band = bands[level - 1];
    return {
      id: `E${i + 1}`,
      opening: core.newOpening(level, Number((band.minBase + band.maxBase) / 2n), Number(band.maxAllowance / 2n), 0),
    };
  });

  for (const e of employees) {
    const pk = core.publicKeyFor(core.employeeRole(e.id));
    await timed(`issuePayslip ${e.id} (level ${e.opening.details.level}, net hidden)`, () =>
      backend.issuePayslip(pk, PERIOD, e.opening),
    );
  }

  // Wrong level: Senior pay filed as Intern. Fails while building the proof, never reaches the chain.
  await rejected(
    'wrong-level payslip',
    () => backend.issuePayslip(core.publicKeyFor(core.employeeRole('X')), PERIOD, core.newOpening(1, 75000, 5000, 0)),
    /outside the band/,
  );

  for (const e of employees) {
    await timed(`claimPayslip ${e.id}`, () => backend.claimPayslip(e.id, PERIOD, e.opening));
  }
  await rejected('duplicate claim', () => backend.claimPayslip(employees[0].id, PERIOD, employees[0].opening), /already claimed/);

  await timed('closePeriod (prove total <= budget, disclose aggregate)', () => backend.closePeriod(PERIOD));
  await timed('attestPeriod (auditor sign-off)', () => backend.attestPeriod(PERIOD));

  const ledger = await backend.readLedger();
  const expectedTotal = employees.reduce((sum, e) => sum + e.opening.details.net, 0n);
  const summary = core.periodSummary(ledger, PERIOD);
  assert.equal(summary.issued, EMPLOYEE_COUNT);
  assert.equal(summary.closedTotal, expectedTotal);
  assert.equal(summary.audited, true);
  for (const view of core.payslipViews(ledger, employees.map(e => e.id))) assert.equal(view.status, 'Claimed');

  console.log(`\nAll checks passed on devnet: ${proofs} transactions proven and verified on chain.`);
  console.log(`Closed total ${expectedTotal} pTWD for ${EMPLOYEE_COUNT} payslips; individual amounts never left the private state.`);
} finally {
  await env.shutdown();
}
