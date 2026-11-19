import { generateTemplateIdentifier,parseTemplate } from '@xo-cash/utils';
import { grantTemplate } from './xo/template.js';
export const normalizedTemplate=parseTemplate(grantTemplate);
export const expectedTemplateIdentifier=generateTemplateIdentifier(normalizedTemplate);
