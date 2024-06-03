import { create as createEmmetService } from 'volar-service-emmet';
import { create as createHtmlService } from 'volar-service-html';
import { create as createCssService } from 'volar-service-css';
import { create as createTypeScriptServices } from 'volar-service-typescript';
import { createServer, createConnection, createTypeScriptProjectProvider, loadTsdkByPath } from '@volar/language-server/node.js';

import { create as createCrmscriptService, createOrUpdateLangiumDocument } from './plugins/crmscript-definition.js';
import { getSuperOfficeLanguageModule } from './core/superoffice.js';

import { createCrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';
import { URI } from 'langium';

const connection = createConnection();

const server = createServer(connection);

connection.listen();

// Inject the shared services and language-specific services
const { shared, Definition } = createCrmscriptServices({ connection, ...NodeFileSystem });

//TODO: Figure out if this is correct. it seems very inefficient
server.documents.onDidChangeContent(change => {
	if(change.document.uri.endsWith('.crmscript-definition')) {
		//createOrUpdateLangiumDocument(shared, change.document);
	}
});

server.documents.onDidOpen(change => {
	if(change.document.uri.endsWith('.crmscript-definition')) {
		//createOrUpdateLangiumDocument(shared, change.document);
	}
});

connection.onInitialize(params => {
	const tsdk = loadTsdkByPath(params.initializationOptions.typescript.tsdk, params.locale);
	return server.initialize(
		params,
		[
			createHtmlService(),
			createCssService(),
			createEmmetService({}),
			...createTypeScriptServices(tsdk.typescript, {}),
			createCrmscriptService({ sharedService: shared, definitionService: Definition }),
		],
		createTypeScriptProjectProvider(tsdk.typescript, tsdk.diagnosticMessages, () => [getSuperOfficeLanguageModule()]),
	);
});

connection.onInitialized(params => {
	shared.workspace.WorkspaceManager.initialized(params);
	return server.initialized;
});

connection.onShutdown(server.shutdown);