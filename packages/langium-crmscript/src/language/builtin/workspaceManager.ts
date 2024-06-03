import {
    AstNode,
    DefaultWorkspaceManager,
    LangiumDocument,
    LangiumDocumentFactory,
    LangiumSharedCoreServices
} from "langium";
import { WorkspaceFolder } from 'vscode-languageserver';
import { URI } from "vscode-uri";
import { builtin } from './builtin.js';

export class CrmscriptWorkspaceManager extends DefaultWorkspaceManager {

    private documentFactory: LangiumDocumentFactory;

    constructor(services: LangiumSharedCoreServices) {
        super(services);
        this.documentFactory = services.workspace.LangiumDocumentFactory;
    }

    protected override async loadAdditionalDocuments(
        folders: WorkspaceFolder[],
        collector: (document: LangiumDocument<AstNode>) => void
    ): Promise<void> {
        await super.loadAdditionalDocuments(folders, collector);
        // Load our library using the `builtin` URI schema
        collector(this.documentFactory.fromString(builtin, URI.parse('builtin:///library.crmscript-definition')));
    }
}