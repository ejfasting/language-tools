import { CrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { AstNode, LangiumDocument, TextDocument, URI, ValidationOptions } from 'langium';
import { CancellationToken, CompletionContext, DocumentSelector, LanguageServicePlugin, LanguageServicePluginInstance, Position } from '@volar/language-server';
import { LangiumSharedServices } from 'langium/lsp';

export function create({
  crmscriptDocumentSelector = ['crmscript-definition'],
  sharedService,
  definitionService
}: {
  crmscriptDocumentSelector?: DocumentSelector,
  sharedService: LangiumSharedServices,
  definitionService: CrmscriptServices
}): LanguageServicePlugin {
  return {
    name: 'crmscript',
    capabilities: {
      completionProvider: {},
      hoverProvider: true,
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false,
      },
    },
    create(): LanguageServicePluginInstance {
      return {
        async provideCompletionItems(document: TextDocument, position: Position, _: CompletionContext, token: CancellationToken) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
            //const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);

            const langiumDocument = createOrUpdateLangiumDocument(sharedService, document, token);
            
            const params = { textDocument: document, position: position };
            return await definitionService.lsp.CompletionProvider?.getCompletion(langiumDocument, params, token);
          }
          return undefined;
        },
        async provideHover(document: TextDocument, position: Position, token: CancellationToken) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
             const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);

             //const langiumDocument = createOrUpdateLangiumDocument(sharedService, document, token);

             const params = { textDocument: document, position: position };
             return await definitionService.lsp.HoverProvider?.getHoverContent(langiumDocument, params, token);
          }
          return undefined;
        },
        async provideDiagnostics(document, token) {
          if (matchDocument(crmscriptDocumentSelector, document)) {
            const langiumDocument = createOrUpdateLangiumDocument(sharedService, document, token);

            const options: ValidationOptions = {};
            return await definitionService.validation.DocumentValidator.validateDocument(langiumDocument, options, token);
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

//TODO: Make it use DocumentBuilder#update instead
export function createOrUpdateLangiumDocument(sharedService: LangiumSharedServices, document: TextDocument, token?: CancellationToken): LangiumDocument<AstNode>{
  const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);
  // console.log("langiumDocument uri: " + langiumDocument.uri);
  console.log("document uri: " + document.uri);
  console.log("document exists: " + sharedService.workspace.LangiumDocuments.hasDocument(langiumDocument.uri));

   //TODO: Figure out the correct approach to checking if the document already is built/registered or not
  if(!sharedService.workspace.LangiumDocuments.hasDocument(langiumDocument.uri)){
    return buildLangiumDocument(sharedService, document, token);
  }
  else{
    return updateLangiumDocument(sharedService, document, token);
  }
}

function buildLangiumDocument(sharedService: LangiumSharedServices, document: TextDocument, token?: CancellationToken): LangiumDocument<AstNode>{
    console.log("Building document: " + document.uri);
    const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);
    const langiumDocuments: LangiumDocument<AstNode>[] = [];
    langiumDocuments.push(langiumDocument);
    sharedService.workspace.DocumentBuilder.build(langiumDocuments, {}, token);
    sharedService.workspace.LangiumDocuments.addDocument(langiumDocument);
    return langiumDocument;
}

function updateLangiumDocument(sharedService: LangiumSharedServices, document: TextDocument, token?: CancellationToken): LangiumDocument<AstNode>{
  console.log("Updating document: " + document.uri);
  const langiumDocument = sharedService.workspace.LangiumDocumentFactory.fromTextDocument(document);
  const changedDocuments: URI[] = [];
  const deletedDocuments: URI[] = [];
  changedDocuments.push(langiumDocument.uri);
  sharedService.workspace.DocumentBuilder.update(changedDocuments, deletedDocuments, token);
  return langiumDocument;
}