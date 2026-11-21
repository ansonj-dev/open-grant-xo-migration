# Open Grant — XO migration

## Bounty readiness

**Status: migration implementation exists; submission evidence is incomplete.** The [Migrate to XO bounty](https://bchblaze.cash/bounties/migrate-to-xo/) asks builders to integrate XO into an existing project or migrate existing functionality. It does not state that the original must have been public or created before BLAZE. This workspace contains a standalone CashScript baseline/client and an XO implementation of its grant behavior, which provides a plausible original-to-migration pair. Both were developed during this BLAZE work; no earlier publication or history is claimed. The original baseline still needs a working public presentation, and the XO version needs its required executed invitation and transaction evidence. If a judge interprets “existing project” more narrowly, that interpretation remains theirs to decide.

The public source includes the [CashScript baseline](https://github.com/ansonj-dev/open-grant-xo-migration/blob/main/baseline/OpenGrant.cash) and [XO template](https://github.com/ansonj-dev/open-grant-xo-migration/blob/main/xo/template.ts). The XO debug-tool transaction, final invitation, follow-up release, and participant-written developer feedback remain outstanding. See the [criterion audit](docs/JUDGING-AUDIT.md), [provenance record](docs/PROVENANCE.md), and [invitation guide](docs/INVITATIONS.md). Local compilation and offline policy comparison do not satisfy those submission requirements.

A small grant that releases to its beneficiary after an agreed BCH block height. Two implementations make the migration inspectable: `baseline/OpenGrant.cash` (CashScript) and `xo/template.ts` (XO). The baseline was authored in this workspace during BLAZE and was not previously published. Public source links now point to both implementations in this repository. A hosted working demo and executed demonstration remain outstanding.

## Run locally

Use Node 24+, then `npm install`, `npm run compile:baseline`, `npm run export`, `npm run dev`. Open http://127.0.0.1:4203. The local UI reviews the lock and downloads the template; it does not sign or broadcast.

> Prerequisite: the XO engine pulls a native dependency (`better-sqlite3`) that compiles during install. On a machine without a C/C++ build toolchain (e.g. Visual Studio "Desktop development with C++" on Windows), `npm install`/`npm ci` will fail at the native build step. The offline checks here (`compile:baseline`, `export`, `check`, `test`, `provenance`, `plan`) do not need that binary — run `npm install --ignore-scripts` to set up. A platform SQLite binary may need `npm rebuild sqlite3` before engine execution.

The baseline compile creates `baseline/OpenGrant.json`. `baseline/client.ts` instantiates it on Chipnet from a compressed beneficiary public key and unlock height. Use a fresh Chipnet key and fund its contract address with test BCH. CashScript 0.13 uses `contract.unlock.release(signatureTemplate)` with a `TransactionBuilder`, an explicit `.setLocktime(unlockHeight)` and a non-final input sequence. Review the fee and full outputs before signing.

## Migration mapping

| Baseline | XO |
|---|---|
| constructor beneficiary public key | persisted beneficiaryPublicKey |
| constructor unlockHeight | persisted unlockHeight |
| tx.time >= unlockHeight | OP_CHECKLOCKTIMEVERIFY |
| beneficiary signature | Schnorr ALL_OUTPUTS signature |
| independent funding transaction | fund invitation |
| release() | follow-up release action |

This is policy equivalence, not byte-for-byte equivalence of compiled scripts. Inputs and output bytecode differ, so a baseline UTXO is not automatically spendable by the XO template. Migrate workflow for newly funded grants; existing grants need an authorized baseline withdrawal and new funding transaction.

XO v0.1.1-next.18029697917 is pinned, the npm `next` tag retrieved on November 19, 2026. The bounty's text references latest 0.1.0-next; current upstream has advanced to 0.1.1-next.

## Reproduce an invitation and show the lifecycle

1. Export `dist/open-grant.xo.json` and import it in https://blaze.xo.cash/. Follow docs/INVITATIONS.md to create a separate local Chipnet wallet and export a public-only coordination invitation; funded execution remains a participant-wallet step. Never share .private.
2. Create a `fund` invitation. The beneficiary generates their release key and shares only its public key. The sponsor verifies that key out of band.
3. Choose 1 <= unlockHeight < 500000000 and a grant amount comfortably above dust plus fees. This is an absolute Chipnet height. The input sequence on release must remain non-final.
4. Complete beneficiary and sponsor roles; inspect outputs, fee and contract parameters. Fund with Chipnet BCH and execute the invitation.
5. Save the exact executed invitation and transaction ID in `evidence/`. Wait until the unlock height; select the follow-up `release`, review payout and fee, sign and execute.
6. Publish links to BOTH baseline and migration repositories/demo plus invitations and transaction IDs. Public URLs do not exist yet.

## Current status

TypeScript compilation, baseline CashScript compilation and XO schema parsing completed. XO JSON exported. No funded chain transaction, full XO-engine lifecycle verification, executed invitation or public deployment exists yet. This entry is not submission-ready. The dependency audit currently reports zero known vulnerabilities with pinned overrides. `npm install --ignore-scripts` was used during initial dependency setup; a platform SQLite binary may need `npm rebuild sqlite3` before engine execution.

## Sources

- Bounty: https://bchblaze.cash/bounties/
- XO upstream engine: https://gitlab.com/GeneralProtocols/xo/engine
- XO template schema/examples: https://gitlab.com/GeneralProtocols/xo/templates
- CashScript compiler/SDK: https://github.com/CashScript/cashscript
- XO debug tool: https://blaze.xo.cash/

The grant logic and workbench were authored for this project. SDKs and their open-source licenses remain their authors'. No winner project was copied.



## Submitter guides

Read [docs/INVITATIONS.md](docs/INVITATIONS.md) for fresh-wallet safety, public-only exports, offline inspection and absolute-lock timing. [docs/PROVENANCE.md](docs/PROVENANCE.md) records the baseline's origin and the public evidence still required. Run the provenance script after compiling to refresh the content manifest.


## Public parameter preflight and checks

`npm run plan -- docs/public-parameters.EXAMPLE.json` demonstrates the input format. The example key's private material was discarded; **never fund its address**. Replace it with your beneficiary's actual public key and set a manually observed live Chipnet height and future unlock height. The command validates curve points, amount encoding and the future-height relationship, then compiles both policy address plans. It does not query the chain.

`npm test` runs 18 offline checks: six comparisons of CashScript/XO script acceptance (height boundary, final sequence, wrong key and height-vs-time mismatch), plus nine public-parameter validation cases and three network/template-identity/public-derivation regressions. These are policy checks on synthetic transactions; they do not replace XO-engine lifecycle or Chipnet evidence. See [docs/JUDGING-AUDIT.md](docs/JUDGING-AUDIT.md) for the criterion matrix and remaining submission evidence.




## Existing development wallets

[docs/EXISTING-WALLET.md](docs/EXISTING-WALLET.md) explains existing local A/B wallets, read-only checks, correct browser Chipnet import, independent Node/browser state and the unsigned conventional-to-XO transfer proposal prepared in 02. The CLI now explicitly pins SDK network=chipnet. Hashing the parsed template fixes the offline inspector's identity comparison. No project transaction was signed or broadcast. The SDK network-monitor shutdown issue remains an explicit limitation; direct offline saved-address verification works.
