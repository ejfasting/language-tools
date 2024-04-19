import { DocumentSelector, ServicePlugin, ServicePluginInstance, TextDocument } from '@volar/language-server';

import { createCrmscriptServices } from './langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';

const { shared, Crmscript } = createCrmscriptServices({ ...NodeFileSystem });

export function create({
    documentSelector = ['crmscript'],
}: {
    documentSelector?: DocumentSelector;
} = {}): ServicePlugin {
    return {
        name: 'crmscript',
        create(context): ServicePluginInstance {
            return {
                async provideCompletionItems(document, position, token) {
                    if (isCrmScriptDocument(document.languageId)) {
                        const langiumDocument = shared.workspace.LangiumDocumentFactory.fromTextDocument(document);
                        const params = { textDocument: document, position: position };
                        const result = await Crmscript.lsp.CompletionProvider?.getCompletion(langiumDocument, params);
                        return result;
                    }
                },
            };
        },
    };
}

function isCrmScriptDocument(languageId: string) {
    return languageId === 'crmscript';
}