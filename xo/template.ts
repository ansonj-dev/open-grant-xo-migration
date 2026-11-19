import type { XOTemplate } from '@xo-cash/types';
export const grantTemplate: XOTemplate = {
  $schema: 'https://libauth.org/schemas/wallet-template-v0.schema.json', name: 'Open Grant — XO migration', version: '1',
  description: 'Migration of the standalone OpenGrant CashScript contract into XO funding and release invitations.', supported: ['BCH_2025_05','BCH_2026_05'],
  roles: { sponsor: { name: 'Sponsor', description: 'Funds the grant after reviewing its beneficiary and unlock height.' }, beneficiary: { name: 'Beneficiary', description: 'Holds the release key.' } },
  start: [{ action: 'fund', role: 'beneficiary', generate: ['beneficiaryKey'] }],
  actions: {
    fund: { name: 'Fund grant', description: 'Create an absolute block-height grant.', roles: { beneficiary: { generate: ['beneficiaryKey'], requirements: { variables: ['beneficiaryPublicKey','unlockHeight','grantSatoshis'] } }, sponsor: {} }, requirements: { participants: [{role:'beneficiary',slots:{min:1,max:1}},{role:'sponsor',slots:{min:1,max:1}}] }, transaction: 'fundTransaction' },
    release: { name: 'Release grant', description: 'Beneficiary authorizes the payout once the public height has been reached.', roles: { beneficiary: { requirements: { secrets: ['beneficiaryKey'] } } }, requirements: { variables: ['payoutScript','payoutSatoshis'], participants: [{role:'beneficiary',slots:{min:1,max:1}}] }, transaction: 'releaseTransaction' },
  },
  transactions: {
    fundTransaction: { name:'Grant funded',description:'A sponsor funded the grant.',version:2,locktime:0,inputs:[],outputs:[{output:'grant',outputIndex:undefined}],composable:true },
    releaseTransaction: { name:'Grant released',description:'Beneficiary withdrew vested grant funds.',version:2,locktime:'$(<unlockHeight>)',inputs:[{input:'grantInput',inputIndex:undefined}],outputs:[{output:'payout',outputIndex:undefined}] },
  },
  inputs: { grantInput: { name:'Grant input',description:'Spend the matured grant.',sequenceNumber:0xfffffffe,unlockingScript:'releaseUnlock',token:null } },
  outputs: {
    grant: { name:'Grant',description:'Funds locked until the agreed block height.',valueSatoshis:'$(<grantSatoshis>)',lockingScript:'grantLock',token:null,selectable:false },
    payout: { name:'Beneficiary payout',description:'Authorized grant payout.',valueSatoshis:'$(<payoutSatoshis>)',lockingScript:'$(<payoutScript>)',token:null },
  },
  lockingScripts: {
    grantLock: { name:'Grant covenant',description:'Absolute timelock and beneficiary signature.',lockingType:'p2sh',lockingBytecode:'grantRedeem',selectable:false,state:{variables:['beneficiaryPublicKey','unlockHeight']},roles:{ beneficiary:{state:{secrets:['beneficiaryKey']},actions:[{action:'release',role:'beneficiary',secrets:[{beneficiaryKey:null}]}]} } },
  },
  scripts: { grantRedeem:'<unlockHeight> OP_CHECKLOCKTIMEVERIFY OP_DROP <beneficiaryPublicKey> OP_CHECKSIG',releaseUnlock:'<beneficiaryKey.schnorr_signature.all_outputs>' },
  variables: {
    beneficiaryKey:{name:'Beneficiary key',description:'Private key retained by the beneficiary.',type:'private_key'},
    beneficiaryPublicKey:{name:'Beneficiary public key',description:'Must match the release private key.',type:'public_key'},
    unlockHeight:{name:'Unlock height',description:'Absolute BCH block height from 1 to 499999999.',type:'integer'},
    grantSatoshis:{name:'Grant amount',description:'Satoshis locked.',type:'satoshis'},
    payoutScript:{name:'Destination',description:'Beneficiary chosen locking script.',type:'locking_script'},
    payoutSatoshis:{name:'Payout amount',description:'Grant less reviewed miner fee.',type:'satoshis'},
  },
};
