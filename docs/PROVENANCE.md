# Provenance of the migration

Open Grant's CashScript baseline and XO implementation were both authored in this workspace on November 19, 2026. The baseline is not an established public application. There is no claim that it predates the hackathon. Open-source SDKs provide compilation, transaction building and XO coordination; no previous winner's app or contract was copied.

The bounty requests migration of existing functionality and links to the original working project and the XO implementation. This folder contains both source paths, but a local newly authored baseline has weaker provenance than a previously deployed product. Confirm sponsor eligibility before submitting it as Migrate to XO. Do not invent earlier repository history or backdate commits.

## Source mapping

- baseline/OpenGrant.cash: standalone beneficiary signature plus absolute-height release policy.
- baseline/OpenGrant.json: CashScript compiler artifact.
- baseline/client.ts: independent Chipnet instantiation and unsigned release builder.
- xo/template.ts: funding invitation, persisted public parameters, release and follow-up action.
- docs/baseline-manifest.json: file hashes and compiler version, regenerated after compilation.

The two implementations intend to preserve a spending policy, rather than identical redeem bytecode or automatically interchangeable UTXOs. XO cannot take over a baseline contract's funds without an authorized baseline withdrawal. A beneficiary may move matured funds into a newly funded XO grant. Evidence must demonstrate both implementations; planning screenshots are insufficient.

## Publication

Publish baseline source and compiler artifact at one persistent URL and the XO implementation at another identifiable path/tag. Include actual repository dates, package locks, the content manifest and authorized transaction IDs. Complete personally written XO feedback from your own experience. Eligibility, public links, funded execution and semantic parity validation remain outstanding.

Primary references: https://bchblaze.cash/bounties/ ; https://github.com/CashScript/cashscript ; https://gitlab.com/GeneralProtocols/xo/engine ; https://gitlab.com/GeneralProtocols/xo/templates

## Judging status after critical review

The current entry is an **unqualified migration candidate**. Six offline baseline/XO policy-parity cases now pass, but those checks do not resolve the requirement to migrate an existing working project or provide public links. Retain the accurate contemporaneous origin and seek sponsor acceptance before treating this paired baseline as eligible. No old history or sponsor approval is implied. See JUDGING-AUDIT.md.
