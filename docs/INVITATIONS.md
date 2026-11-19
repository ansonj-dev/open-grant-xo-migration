# Working with invitations

The CLI creates a signed coordination invitation. It does not take the sponsor or beneficiary role, generate a beneficiary signing key, select coins, sign a transaction, or broadcast. Assign participant roles in the XO debug tool using accounts that retain their own secrets. Importing a public invitation does not import private keys or transfer wallet ownership.

## First local setup for a new coordinator only

Existing A/B wallet files in 02 can be read using --wallet-file: skip wallet:init and follow EXISTING-WALLET.md. The commands below are only for a separate new coordinator wallet, never for replacing existing files. From this project folder, with Node 24 or later:

```powershell
npm install
npm run check
npm run export
npm run wallet:init -- --chipnet-only
npm run invitation -- --chipnet-only
```

The wallet initializer uses 256 bits from Node's cryptographic RNG and BIP39, writes a disposable Chipnet seed to `.private/chipnet-wallet.json`, and refuses to replace an existing file. It never prints the recovery phrase. File mode 0600 is requested; on Windows, also rely on your user-profile ACLs and keep `.private` out of sync/shared folders. The CLI rejects `XO_MNEMONIC` so an existing mainnet mnemonic cannot be accidentally selected from an environment variable. A mnemonic itself has no network: the Chipnet restriction comes from this tool's server configuration and workflow. Do not reuse this seed with mainnet funds.

Keep the complete `.private` folder private. The engine database can contain participant/account secrets as well as the seed file. Deleting or replacing this folder may lose access to test funds or keys introduced later through the same account. Use a separate project copy to start another coordinator wallet.

`dist/fund-<invitation-id>.invitation.json` contains ONLY the upstream shared `invitation` object, serialized with XO Extended JSON. It deliberately excludes the `StoredInvitation` wrapper and private account fields. Exclusive writes avoid silently overwriting an export. The output message says UNEXECUTED; a signed invitation is not a transaction receipt.

## Offline inspection and import

```powershell
npm run inspect -- dist/fund-REPLACE_WITH_ID.invitation.json
```

Inspection parses the upstream schema, checks the template identifier against this project and displays only IDs, action and commit count. It does not open a wallet or contact the network. Schema success does not verify signatures, chain/network, balances, or output safety. An invitation can disclose participant metadata, public keys, transaction inputs and output amounts even without private keys. Share deliberately.

1. Open https://blaze.xo.cash/ and import `dist/open-grant.xo.json` using the tool's template-import interface. Labels may change with upstream releases.
2. Import the matching invitation. Select Chipnet and confirm the identifier reported by the inspector. If the tool rejects the schema, keep both files and record the exact version/error before changing encodings.
3. Participants join `sponsor` and `beneficiary` in separate accounts and complete the missing requirements shown by XO. The beneficiary generates their release key and supplies the matching compressed public key; the sponsor verifies it. Confirm that public key and the unlock height out of band before funding.
4. Review the actual transaction, including every output, fee, unlock height and script. Fund only with disposable Chipnet BCH. Execute through the participant wallet/tool when ready.
5. Keep the exact executed invitation returned by XO. An earlier exported invitation may not contain the final commits. Record the Chipnet transaction ID separately and independently look it up. Then inspect the role-specific follow-up action on the resulting output.

The CLI does not presently complete role requirements, import/accept updated commits into the local coordinator account, or execute actions. Its `inspect` command is a read-only schema inspection, not a wallet import command. Use the debug tool's coordination flow for those steps. Do not edit commit JSON manually: commitments and signatures cover that data.

## Absolute-height timing

The grant uses OP_CHECKLOCKTIMEVERIFY with an absolute block height below 500000000. Its release transaction sets locktime to unlockHeight and sequence to 0xfffffffe. Funding does not begin a new delay: if the chosen height has already been reached, the grant is already mature. Read the live Chipnet height and choose a future height; the local UI's sample is only a placeholder. The beneficiary signature is still required after maturity. Near the boundary, use the actual transaction validity reported by the chain, accounting for height conventions and reorgs. Calendar dates are estimates.

The beneficiary joins and generates their own signing key; the sponsor only verifies the matching public key and funds the grant. No sponsor signing key is part of this contract. Public invitation import does not transfer the beneficiary's key. Keep the beneficiary's original wallet state to authorize the release.

## Evidence still needed

Existing disposable A/B wallets and SDK address state are available in 02. A qualifying Open Grant invitation/funding/release lifecycle remains unexecuted. Eighteen focused offline tests, TypeScript/CashScript compilation and template schema parsing now pass, with the limits stated in JUDGING-AUDIT.md. Capture a funded and executed Chipnet lifecycle, current debug-tool import behavior, follow-up invitation and personal XO feedback before submission.



## Preflight and offline checks

The optional plan command reads exactly the public fields in public-parameters.EXAMPLE.json. The sample public key has no retained private key and its address must never be funded. Replace it, and update the observed/future Chipnet heights. The observed height is supplied by you rather than authenticated by the planner. The output compiles both addresses; they can differ because policy equivalence does not imply identical scripts. A focused offline suite now confirms the same acceptance/rejection outcome for six script-policy cases, but full chain execution and XO coordination remain unverified.



## Existing wallet path

See EXISTING-WALLET.md before initializing anything. Existing 02 wallet files can be selected with --wallet-file; no seed copy is necessary. 03 has its own open-grant-chipnet database, so it does not automatically inherit 02's stored SDK key references or the browser account state. The helper commands never broadcast.

