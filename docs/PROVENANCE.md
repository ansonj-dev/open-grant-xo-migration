# Provenance of the migration

Open Grant's CashScript baseline and XO implementation were authored in this workspace during BLAZE 2026. The baseline is a separate CashScript contract/client, and the XO template migrates its grant behavior. There is no claim that either predates the hackathon or was previously published. The bounty wording asks for an existing project or existing functionality and links to both the original working project and XO implementation; it does not state a pre-event publication cutoff. The baseline and XO version therefore form a plausible migration pair, but they still need separate public working links and the required XO execution evidence. No previous winner's app or contract was copied.

The bounty requests migration of existing functionality and links to both the original working project and XO implementation. The local baseline gives the entry an original implementation to show, but the current workspace has no public URLs or transaction record. Preserve its actual origin and publish the two working presentations separately. If judges interpret “existing project” as requiring pre-event history, ask them to assess this exact baseline/template pair rather than inventing earlier repository history or backdating commits.

## Source mapping

- baseline/OpenGrant.cash: standalone beneficiary signature plus absolute-height release policy.
- baseline/OpenGrant.json: CashScript compiler artifact.
- baseline/client.ts: independent Chipnet instantiation and unsigned release builder.
- xo/template.ts: funding invitation, persisted public parameters, release and follow-up action.
- docs/baseline-manifest.json: file hashes and compiler version, regenerated after compilation.

The two implementations intend to preserve a spending policy, rather than identical redeem bytecode or automatically interchangeable UTXOs. XO cannot take over a baseline contract's funds without an authorized baseline withdrawal. A beneficiary may move matured funds into a newly funded XO grant. Evidence must demonstrate both implementations; planning screenshots are insufficient.

## Publication

The public repository contains the [CashScript baseline](https://github.com/ansonj-dev/open-grant-xo-migration/blob/main/baseline/OpenGrant.cash), [compiled artifact](https://github.com/ansonj-dev/open-grant-xo-migration/blob/main/baseline/OpenGrant.json), and [XO implementation](https://github.com/ansonj-dev/open-grant-xo-migration/blob/main/xo/template.ts). Add transaction IDs after an authorized funded execution and complete personally written XO feedback from hands-on use. The hosted demo, funded execution and end-to-end parity evidence remain outstanding; offline policy checks are not chain execution.

Primary references: https://bchblaze.cash/bounties/ ; https://github.com/CashScript/cashscript ; https://gitlab.com/GeneralProtocols/xo/engine ; https://gitlab.com/GeneralProtocols/xo/templates

## Judging status after critical review

The current entry has a plausible local migration pair but is **not submission-ready**. Six offline baseline/XO policy-parity cases pass; public working links, XO debug-tool execution, the final invitation, and participant-written feedback remain outstanding. Keep the development history accurate. See JUDGING-AUDIT.md.
