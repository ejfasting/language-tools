import { DocumentSelector, ServicePlugin, ServicePluginInstance } from '@volar/language-server';

import { createCrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';
import { CompletionList } from 'vscode';

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
                async provideCompletionItems(document, position, context, token) {
                    if (isCrmScriptDocument(document.languageId)) {
                        const langiumDocument = shared.workspace.LangiumDocumentFactory.fromTextDocument(document);
                        const params = { textDocument: document, position: position };
                        const result = await Crmscript.lsp.CompletionProvider?.getCompletion(langiumDocument, params);
                        const completionList: CompletionList = {
                            isIncomplete: true,
                            items: []
                        };
                        result?.items.forEach(element => {
                            const completionItem = {
                                label: element.label,
                                kind: element.kind
                            };
                            completionList.items.push(completionItem);
                        });
                        return completionList;
                    }
                    // return {
                    //     isIncomplete: true,
                    //     items: [
                    //       {
                    //         label: 'Hello',
                    //         kind: CompletionItemKind.Text,
                    //         isIncomplete: false
                    //       },
                    //       {
                    //         label: 'World',
                    //         kind: CompletionItemKind.Text,
                    //         isIncomplete: false
                    //       },
                    //     ]
                    //   }
                },
            };
        },
    };
}

function isCrmScriptDocument(languageId: string) {
    return languageId === 'crmscript';
}