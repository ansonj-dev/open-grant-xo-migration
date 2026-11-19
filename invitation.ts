import { Engine } from '@xo-cash/engine';
import { chipnetEngineOptions } from './engine-options.js';
import { mkdir, writeFile } from 'node:fs/promises';
import { serializeInvitation } from '@xo-cash/utils';
import { grantTemplate } from './xo/template.js';
import { readChipnetMnemonic } from './wallet.js';
const mnemonic = await readChipnetMnemonic();
const engine = await Engine.create(mnemonic, chipnetEngineOptions('open-grant'));
try {
  const { templateIdentifier } = await engine.importTemplate(grantTemplate);
  const { invitation } = await engine.createInvitation({ templateIdentifier, actionIdentifier: 'fund' });
  await mkdir('dist', { recursive: true });
  const path = `dist/fund-${invitation.invitationIdentifier}.invitation.json`;
  // Export the public invitation only. StoredInvitation also holds private account/secret data.
  await writeFile(path, serializeInvitation(invitation), { flag: 'wx' });
  console.log(`Created signed, UNEXECUTED invitation: ${path}`);
  console.log('Import alongside the exported template in https://blaze.xo.cash/. No funds moved. Never share the .private folder.');
} finally { await engine.stop(); }


