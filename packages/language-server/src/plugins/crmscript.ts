import { createCrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';
import { TextDocument } from 'langium';
import { DocumentSelector, LanguageServicePlugin, LanguageServicePluginInstance, Position } from '@volar/language-server';

const { shared, Crmscript } = createCrmscriptServices({ ...NodeFileSystem });

export function create({
  crmscriptDocumentSelector = ['crmscript'],
}: {
  crmscriptDocumentSelector?: DocumentSelector,
} = {}): LanguageServicePlugin {
  return {
    name: 'crmscript',
    create(): LanguageServicePluginInstance {
      return {
        async provideCompletionItems(document: TextDocument, position: Position) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
            const langiumDocument = shared.workspace.LangiumDocumentFactory.fromTextDocument(document);
            const params = { textDocument: document, position: position };
            const result = await Crmscript.lsp.CompletionProvider?.getCompletion(langiumDocument, params);
            return result;
          }
          return undefined;
        },
      };
    }
  };
}

function matchDocument(selector: DocumentSelector, document: TextDocument) {
  for (const sel of selector) {
    if (sel === document.languageId || (typeof sel === 'object' && sel.language === document.languageId)) {
      return true;
    }
  }
  return false;
}