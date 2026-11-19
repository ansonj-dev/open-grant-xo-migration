import { Contract, ElectrumNetworkProvider, SignatureTemplate, TransactionBuilder, type Utxo } from 'cashscript';
import artifact from './OpenGrant.json' with { type: 'json' };
export function createGrant(beneficiaryPublicKey: string, unlockHeight: number) {
  if (!/^(02|03)[0-9a-f]{64}$/i.test(beneficiaryPublicKey)) throw new Error('Expected compressed beneficiary public key');
  if (!Number.isInteger(unlockHeight) || unlockHeight < 1 || unlockHeight >= 500_000_000) throw new Error('Expected a block height below 500,000,000');
  return new Contract(artifact, [beneficiaryPublicKey, BigInt(unlockHeight)], { provider: new ElectrumNetworkProvider('chipnet') });
}
/** Build locally; caller reviews and chooses whether to broadcast. Only BCH inputs are accepted. */
export function prepareRelease(contract: ReturnType<typeof createGrant>, utxo: Utxo, signer: SignatureTemplate, unlockHeight: number, destination: string, feeSatoshis = 800n) {
  if (utxo.token) throw new Error('This reference flow handles BCH only');
  if (!Number.isInteger(unlockHeight) || unlockHeight < 1 || unlockHeight >= 500_000_000) throw new Error('Invalid release height');
  if (feeSatoshis < 1n || feeSatoshis > 2000n || utxo.satoshis - feeSatoshis < 1000n) throw new Error('Review fee and dust amount');
  return new TransactionBuilder({ provider: contract.provider, maximumFeeSatoshis: 2000n })
    .addInput(utxo, contract.unlock.release(signer), { sequence: 0xfffffffe })
    .addOutput({ to: destination, amount: utxo.satoshis - feeSatoshis })
    .setLocktime(unlockHeight);
}
