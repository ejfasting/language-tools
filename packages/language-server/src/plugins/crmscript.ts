import { CrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { TextDocument, ValidationOptions } from 'langium';
import { CancellationToken, CompletionContext, DocumentSelector, LanguageServicePlugin, LanguageServicePluginInstance, Position } from '@volar/language-server';
import { LangiumSharedServices } from 'langium/lsp';

export function create({
  crmscriptDocumentSelector = ['crmscript'],
  sharedService,
  crmscriptService
}: {
  crmscriptDocumentSelector?: DocumentSelector,
  sharedService: LangiumSharedServices,
  crmscriptService: CrmscriptServices
}): LanguageServicePlugin {
  return {
    name: 'crmscript',
    create(): LanguageServicePluginInstance {
      return {
        async provideCompletionItems(document: TextDocument, position: Position, _: CompletionContext, token: CancellationToken) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
            const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);
            const params = { textDocument: document, position: position };
            const result = await crmscriptService.lsp.CompletionProvider?.getCompletion(langiumDocument, params, token);

            return result;
          }
          return undefined;
        },
        async provideHover(document: TextDocument, position: Position, token: CancellationToken) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
            const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);
            const params = { textDocument: document, position: position };
            const result = await crmscriptService.lsp.HoverProvider?.getHoverContent(langiumDocument, params, token);
            return result;
          }
          return undefined;
        },
        async provideDiagnostics(document, token) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
            const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);
            const options: ValidationOptions = {};
            return await crmscriptService.validation.DocumentValidator.validateDocument(langiumDocument, options, token);
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