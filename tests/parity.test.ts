import assert from 'node:assert/strict';
import test from 'node:test';
import { bigIntToVmNumber, createCompilerBch, createVirtualMachineBCH, disassembleBytecodeBCH, generateTransaction, hexToBin, secp256k1 } from '@bitauth/libauth';
import { createGrant } from '../baseline/client.js';
import { grantTemplate } from '../xo/template.js';
const key = (last: number) => Uint8Array.from([...new Uint8Array(31),last]);
function publicKeyFor(n: number): Uint8Array { const p=secp256k1.derivePublicKeyCompressed(key(n)); if(typeof p==='string') throw new Error(p); return p; }
const publicKey: Uint8Array = publicKeyFor(1);
assert.ok(publicKey instanceof Uint8Array);
const baseline = createGrant(Buffer.from(publicKey).toString('hex'),250000);
const vm = createVirtualMachineBCH(false);
function spend(implementation: 'baseline'|'xo', {height = 250000,sequence = 0xfffffffe,signingKey = key(1)} = {}) {
  const scripts = implementation === 'xo' ? grantTemplate.scripts : {grantRedeem:disassembleBytecodeBCH(hexToBin(baseline.bytecode)),releaseUnlock:grantTemplate.scripts.releaseUnlock};
  const compiler = createCompilerBch({scripts,variables:{beneficiaryPublicKey:{type:'WalletData'},unlockHeight:{type:'WalletData'},beneficiaryKey:{type:'Key'}},lockingScriptTypes:{grantRedeem:'p2sh32'},unlockingScripts:{releaseUnlock:'grantRedeem'}});
  const data = {bytecode:{beneficiaryPublicKey:publicKey,unlockHeight:bigIntToVmNumber(250000n)},keys:{privateKeys:{beneficiaryKey:signingKey}}};
  const locking = compiler.generateBytecode({scriptId:'grantRedeem',data});
  assert.equal(locking.success,true);
  if(!locking.success) throw new Error('Lock compile failed');
  const attempt=generateTransaction({version:2,locktime:height,inputs:[{outpointIndex:0,outpointTransactionHash:new Uint8Array(32).fill(3),sequenceNumber:sequence,unlockingBytecode:{compiler,script:'releaseUnlock',data,valueSatoshis:10000n}}],outputs:[{lockingBytecode:Uint8Array.of(0x51),valueSatoshis:9000n}]});
  assert.equal(attempt.success,true,JSON.stringify(attempt,(_k,v)=>typeof v==='bigint'?v.toString():v));
  if(!attempt.success) throw new Error('Transaction compile failed');
  return vm.verify({transaction:attempt.transaction,sourceOutputs:[{lockingBytecode:locking.bytecode,valueSatoshis:10000n}]})===true;
}
for(const [name,params,accepted] of [
  ['at unlock height',{height:250000},true],
  ['after unlock height',{height:250001},true],
  ['before unlock height',{height:249999},false],
  ['final input sequence',{sequence:0xffffffff},false],
  ['wrong beneficiary key',{signingKey:key(9)},false],
  ['timestamp instead of block-height locktime',{height:500000001},false],
] as const) {
  test(`CashScript and XO agree: ${name}`,()=>{
    const a=spend('baseline',params),b=spend('xo',params);
    assert.equal(a,accepted,'baseline result');assert.equal(b,accepted,'XO result');
  });
}

