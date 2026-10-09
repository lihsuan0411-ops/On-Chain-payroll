// Copies the compiled Midnight prover/verifier keys and ZKIR into public/ so the
// browser's FetchZkConfigProvider can load them from /midnight/payroll/.
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const src = 'contracts/midnight/src/managed/payroll';
const dest = 'public/midnight/payroll';

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const dir of ['keys', 'zkir']) cpSync(join(src, dir), join(dest, dir), { recursive: true });
console.log(`Synced ZK assets to ${dest}`);
