import { createCrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';
import { TextDocument } from 'langium';
import { LanguageServicePlugin, LanguageServicePluginInstance } from '@volar/language-server';

const { shared, Crmscript } = createCrmscriptServices({ ...NodeFileSystem });



export const service = {
    name: 'crmscript-service', // The name of the service, this is used to identify the service in the logs and in Volar Labs
    create(context): LanguageServicePluginInstance {
      return {
        async provideCompletionItems(document: TextDocument, position: any, token: any) {
            if (isCrmScriptDocument(document.languageId)) {
                const langiumDocument = shared.workspace.LangiumDocumentFactory.fromTextDocument(document);
                const params = { textDocument: document, position: position };
                const result = await Crmscript.lsp.CompletionProvider?.getCompletion(langiumDocument, params);
                return result;
            }
            return undefined;
        },
      };
    },
  } satisfies LanguageServicePlugin;

  function isCrmScriptDocument(languageId: string) {
    return languageId === 'crmscript';
}