import { bigIntToVmNumber,binToHex,createCompilerBch,hexToBin,lockingBytecodeToCashAddress,secp256k1 } from '@bitauth/libauth';
import { createGrant } from './baseline/client.js';
import { grantTemplate } from './xo/template.js';
export type GrantParameters={beneficiaryPublicKey:string;unlockHeight:number;observedChipnetHeight:number;grantSatoshis:string};
export function validateGrantParameters(value:unknown):GrantParameters {
  if(!value||typeof value!=='object'||Array.isArray(value)) throw new Error('Expected a public parameter object');
  const p=value as Record<string,unknown>,names=['beneficiaryPublicKey','unlockHeight','observedChipnetHeight','grantSatoshis'];
  if(Object.keys(p).some(k=>!names.includes(k))||names.some(k=>!(k in p))) throw new Error('Expected exactly beneficiaryPublicKey, unlockHeight, observedChipnetHeight, grantSatoshis. Never include private keys.');
  if(typeof p.beneficiaryPublicKey!=='string'||!/^(02|03)[0-9a-f]{64}$/i.test(p.beneficiaryPublicKey)||!secp256k1.validatePublicKey(hexToBin(p.beneficiaryPublicKey))) throw new Error('Invalid compressed beneficiaryPublicKey');
  if(!Number.isInteger(p.unlockHeight)||Number(p.unlockHeight)<1||Number(p.unlockHeight)>=500000000) throw new Error('unlockHeight must be a block height from 1 through 499999999');
  if(!Number.isInteger(p.observedChipnetHeight)||Number(p.observedChipnetHeight)<0||Number(p.observedChipnetHeight)>=500000000) throw new Error('Provide an observed Chipnet block height');
  if(Number(p.unlockHeight)<=Number(p.observedChipnetHeight)) throw new Error('The grant would already be mature at the supplied observed height; choose a future unlockHeight');
  if(typeof p.grantSatoshis!=='string'||!/^[1-9][0-9]{0,15}$/.test(p.grantSatoshis)||BigInt(p.grantSatoshis)<1000n||BigInt(p.grantSatoshis)>2100000000000000n) throw new Error('grantSatoshis must be an integer decimal string from 1000 through 2100000000000000');
  return {...p,beneficiaryPublicKey:p.beneficiaryPublicKey.toLowerCase()} as GrantParameters;
}
export function planGrant(value:unknown) {
  const parameters=validateGrantParameters(value);
  const compiler=createCompilerBch({scripts:grantTemplate.scripts,variables:{beneficiaryPublicKey:{type:'WalletData'},unlockHeight:{type:'WalletData'}},lockingScriptTypes:{grantRedeem:'p2sh32'}});
  const result=compiler.generateBytecode({scriptId:'grantRedeem',data:{bytecode:{beneficiaryPublicKey:hexToBin(parameters.beneficiaryPublicKey),unlockHeight:bigIntToVmNumber(BigInt(parameters.unlockHeight))}}});
  if(!result.success) throw new Error('XO locking script compilation failed');
  const address=lockingBytecodeToCashAddress({bytecode:result.bytecode,prefix:'bchtest'});
  if(typeof address==='string') throw new Error('Address encoding failed');
  return {status:'LOCAL PLAN ONLY — no invitation, chain-height query, funding or execution',parameters,xoLockingBytecode:binToHex(result.bytecode),xoChipnetAddress:address.address,baselineChipnetAddress:createGrant(parameters.beneficiaryPublicKey,parameters.unlockHeight).address,warning:'The observed height is supplied by you, not queried or authenticated. Baseline and XO bytecode/addresses need not match. Compare actual funding bytecode and beneficiary key before funding. Testnet addresses are not specific to Chipnet.'};
}
