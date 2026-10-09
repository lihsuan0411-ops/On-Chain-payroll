# Catalyst Fund 15 proposal: delivery status

Proposal: [On-chain Payroll: A ZK Privacy System for Cardano & Midnight](https://projectcatalyst.io/funds/15/midnight-compact-dapps/on-chain-payroll-a-zk-privacy-system-for-cardano-and-midnight)

This maps the proposal's promised features and acceptance criteria to what this repository implements, and lists the deliberate design changes.

## Acceptance criteria

| Proposal criterion | Status | Where |
| --- | --- | --- |
| ZK logic: valid proofs for compliant inputs (e.g. a Level 3 employee), failure for non-compliant ones | Done | `issuePayslip` checks the private level's salary band against committed rules: [`payroll.compact`](../contracts/midnight/src/payroll.compact). 15 band-edge acceptance and 20 violation tests in [`payroll.test.ts`](../contracts/midnight/src/test/payroll.test.ts) |
| Normal payroll, wrong-level claims rejected, duplicate claims prevented | Done | Simulator tests, devnet e2e ([`scripts/devnet/e2e.mts`](../scripts/devnet/e2e.mts)), UI level selector |
| Privacy: unauthorized queries rejected or indecipherable; view-key holders can decrypt | Done | Ledger stores only commitments; sealed openings per holder; tests assert other employees cannot decrypt or claim |
| Auditors verify totals without seeing individual records | Done | Hidden running total per period, `closePeriod` proves total ≤ budget and discloses only the aggregate |
| Cross-chain: validator accepts and executes | Done (changed design, see below) | Aiken `payroll_reserve` with Anchor / Release / Reclaim, 12 unit tests + 9 off-chain checks evaluating the compiled script |
| ≥ 50 proof-verification tests | Partly | 57 circuit tests in the simulator; real proofs verified by a Midnight node on a local devnet (`npm run devnet:e2e`, scales with `EMPLOYEES=n`). Not yet on Preprod |
| View keys derived deterministically from a wallet signature | Done | [`wallet-keys.ts`](../lib/chain/wallet-keys.ts), refuses randomised signers |

## Deliverables

| Deliverable | Status |
| --- | --- |
| `/contracts/midnight` (Compact) | Done: Compact 0.31.1, 6 circuits |
| `/contracts/cardano` (Aiken) | Done: Aiken 1.1.23, Plutus V3 |
| Demo UI with wallet integration | Done: Local mode, Preprod via Lace (Midnight) + CIP-30 (Cardano) |
| Globally accessible demo | Done: Vercel (Local mode works without a wallet) |
| `/sdk` published on npm (`create_salary_proof`, `verify_proof`, `generate_audit_report`, …) | Not yet: the logic lives in `lib/chain` and `contracts/midnight/src`, not yet packaged |
| `/docs` tutorials (Compact rules, proofs, Cardano validator) | Started: this file and the README |
| 100+ proofs on a Midnight network, 10+ mainnet settlements | Not yet: needs Preprod/Mainnet runs with funded wallets |
| Pilot (company/DAO), 10+ min video, final report | Not yet |
| Dispute resolution (multi-party view-key disclosure), batched settlement | Not yet |

## Design changes from the proposal

1. **Salaries are paid on Midnight, not settled per payslip on Cardano.** Cardano transfers are public, so per-payslip settlement there would reveal every salary. Payouts are shielded pTWD transfers on Midnight; Cardano holds the period's reserve and anchors the Midnight payroll root, which banks and tax offices can verify on Cardano.
2. **No Relay Oracle.** The proposal's oracle was a trusted party deciding whether settlement happens. Here the employer anchors the root under the validator's rules (count must increase, funds and other fields locked), and anyone can recompute the root from Midnight's public ledger. Native verification of Midnight proofs on Cardano remains future work.
3. **Midnight network.** The proposal targeted Midnight DevNet; Midnight now runs Preview, Preprod and Mainnet (Ledger 8). This repo targets Preprod and uses a local devnet for automated tests.
