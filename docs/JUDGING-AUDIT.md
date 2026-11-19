# Judging audit — Migrate to XO

Reviewed November 19, 2026 against https://bchblaze.cash/bounties/migrate-to-xo/ and the current pinned engine package. Verdict: **not a qualified migration submission at present**. The baseline and port were created together during this build. A working pre-existing project with public provenance is absent, and sponsor acceptance of this interpretation has not been obtained. Do not present compilation or a newly assigned folder name as proof that the migration criterion has been met.

| Official criterion | Actual evidence | Status / remaining gate |
|---|---|---|
| Migrate existing functionality to a novel, well-designed, functional XO template implementing the intended contract | baseline/OpenGrant.cash, baseline/client.ts and xo/template.ts implement beneficiary-authorized absolute-height release. Six offline script acceptance cases agree between actual baseline bytecode and XO bytecode. | Technical progress; eligibility blocker. Both implementations were newly authored together. No existing public working project is identified. Functional XO engine round trip remains unverified. |
| Execute a Chipnet or Mainnet transaction with an invitation inspectable in the debug tool, and submit it | Only unexecuted coordination-invitation creation code, no funded chain outputs/transaction ID | Missing, mandatory. |
| Showcase follow-up actions where relevant | grantLock persists beneficiary public key/height and defines the beneficiary release follow-up | Partial. Source only; actual engine output discovery, retained signing secret and follow-up execution need demonstration. |
| Provide template, exact invitation used and reproduction instructions | Upstream schema-validated template export, public-only invitation serializer, fresh-wallet CLI, offline inspector, public-parameter plan, docs/INVITATIONS.md | Partial. No exact executed invitation exists, and debug-tool import has not been validated. |
| Links to both original working project and XO implementation | Local source paths and docs/PROVENANCE.md plus hash manifest | Missing. Local paths and a new content hash are not public working-project links or proof of earlier provenance. |
| Detailed personal development feedback, about 500 words, with issues/improvements | Only docs/feedback-notes.md worksheet | Missing, human-only. The participant must write it from their own experience. No AI-written feedback draft has been produced. |

The official guidance permits a different UX for the migrated functionality. That permission does not waive the existing-project requirement, executed transaction requirement, public links or personal feedback.

## Defensible eligibility position

Keep Open Grant as an original paired implementation and reference candidate. It demonstrates a concrete policy migration, but the word “existing” cannot be resolved in our favor by assertion. Before entering this bounty, either obtain a sponsor decision accepting the contemporaneously authored baseline, or identify a genuinely pre-existing project the participant has permission to migrate and implement a real port of that project's functionality with accurate attribution/provenance. Neither path has been completed here. Do not copy a public project's source and rename it to fabricate migration history.

No external messages were sent. We have not manufactured older commits, deployed addresses, prior users, public project links or sponsor approval. A content manifest records the current local files only; it is not evidence of an earlier public publication.

## Current versions and documentation

`npm view @xo-cash/engine dist-tags --json` returned next=0.1.1-next.18029697917 and latest=0.0.1 on November 19. The current next version is pinned. The official bounty still names latest 0.1.0-next.xxx; preserve the exact package lock/version and recheck before capturing final evidence. The installed package declarations/implementation were used for StoredInvitation and serialization behavior. The official stack homepage works; its getting-started path was unavailable to the fetcher and its api.html link returned 404 during review. No claim is made that all upstream documentation is unavailable.

The sponsor recommends Chipnet; all provider/server code here uses Chipnet. Offline tests do not satisfy an actual Chipnet execution. No mainnet qualification is claimed. Sponsor collaboration is encouraged by the event, but has not occurred.

## Critical implementation findings and changes

The CLI now excludes StoredInvitation's private account wrapper and serializes only its public `.invitation` through the upstream serializer. It is a coordinator only, taking no beneficiary role. Participants must generate and retain signing keys in their actual debug-tool accounts; importing public JSON does not import the local coordinator's seed or contract secrets.

Strict preflight validates the beneficiary's actual compressed curve point, integer satoshi string, an absolute-height value below 500000000 and a future relationship to the manually supplied observed height. It compiles both policy address plans without querying a provider. The sample public key's private material was discarded; the sample address must never be funded. The real participant's public key must match their actual role key, which the planner cannot prove.

CashScript's baseline and XO may produce different redeem bytes and addresses while enforcing the tested policy. Existing baseline UTXOs cannot simply be treated as XO UTXOs. Migration of already funded assets requires an authorized baseline withdrawal and new XO funding, after maturity.

## Validation and limits

- 18 tests passed: six offline baseline/XO comparisons at/before/after height, wrong key, final sequence and height/timestamp mismatch; nine strict-plan cases and three network/template-identity/public-derivation regressions.
- Tests generate valid Schnorr signatures over synthetic transactions and evaluate actual instantiated baseline/XO scripts using libauth. They do not establish chain finality, current height, actual funding, fee selection, debug-tool compatibility or full engine coordination.
- TypeScript compilation includes tests and all local CLI/planning modules.
- CashScript baseline compilation passed; XO export parses its upstream schema; the content manifest was refreshed.
- The pinned dependency audit reported zero known advisories in this pass.

No funded transaction, external message, deployment or submission occurred.

## Evidence required before qualification

Resolve eligibility/provenance honestly; publish both real working-project links; complete actual debug-tool import and multi-party funding; demonstrate release with the retained beneficiary key on Chipnet; preserve exact executed/follow-up invitations and independently checked transaction IDs; and have the human participant write the required personal feedback. Until then, label this an unqualified migration candidate.


## Later wallet-readiness check

SDK network is now explicitly chipnet, independently of the server list. Inspector IDs now hash the schema-parsed template rather than a raw object with undefined fields. Regression checks were added; total offline tests are 18. Existing 02 wallets and local addresses were verified separately and documented in EXISTING-WALLET.md. That ordinary faucet/wallet setup does not resolve migration eligibility or provide a qualifying grant transaction. The SDK's address-generation shutdown race is documented honestly; no template funding, broadcast, browser role round trip or personal feedback was fabricated.

