import { ServicePlugin, ServicePluginInstance } from '@volar/language-server';

import { createCrmscriptServices } from './langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';

const { shared, Crmscript } = createCrmscriptServices({ ...NodeFileSystem });

export const create = {
  name: 'suo-service',
  create(context): ServicePluginInstance {
    return {
      async provideCompletionItems(document, position, token) {
        const langiumDocument = shared.workspace.LangiumDocumentFactory.fromTextDocument(document);
        const params = { textDocument: document, position: position };
        const result = await Crmscript.lsp.CompletionProvider?.getCompletion(langiumDocument, params);
        return result;
      },
    };
  },
} satisfies ServicePlugin;