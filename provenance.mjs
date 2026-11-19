import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
const files = ['baseline/OpenGrant.cash','baseline/OpenGrant.json','baseline/client.ts','xo/template.ts'];
const contents = await Promise.all(files.map(async path => [path,createHash('sha256').update(await readFile(new URL(path,import.meta.url))).digest('hex')]));
const artifact = JSON.parse(await readFile(new URL('baseline/OpenGrant.json',import.meta.url),'utf8'));
await writeFile(new URL('docs/baseline-manifest.json',import.meta.url), JSON.stringify({format:'open-grant-content-manifest-v1',generatedAt:new Date().toISOString(),provenance:'Both implementations newly authored during BLAZE 2026; no earlier public history claimed.',compiler:artifact.compiler,files:Object.fromEntries(contents),validation:'Content hashes only: does not establish semantic parity, funded execution, sponsor eligibility or a prior publication.'},null,2));
console.log('Wrote docs/baseline-manifest.json');
