import { grantTemplate } from './xo/template.js';
import { parseTemplate,serializeTemplate } from '@xo-cash/utils';
import { mkdir,writeFile } from 'node:fs/promises';
const template=parseTemplate(grantTemplate);
await mkdir('dist',{recursive:true});
await writeFile('dist/open-grant.xo.json',serializeTemplate(template));
console.log('Schema-validated XO template exported. No transaction executed.');
