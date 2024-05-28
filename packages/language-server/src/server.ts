import { create as createEmmetService } from 'volar-service-emmet';
import { create as createHtmlService } from 'volar-service-html';
import { create as createCssService } from 'volar-service-css';
import { create as createTypeScriptServices } from 'volar-service-typescript';
import { createServer, createConnection, createTypeScriptProjectProvider, loadTsdkByPath } from '@volar/language-server/node.js';

import { create as createCrmscriptService } from './plugins/crmscript.js';
import { getSuperOfficeLanguageModule } from './core/superoffice.js';

import { createCrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';
import { NodeFileSystem } from 'langium/node';

// Inject the shared services and language-specific services
const { shared, crmscript } = createCrmscriptServices({ ...NodeFileSystem });

const connection = createConnection();
const server = createServer(connection);

connection.listen();
connection.onInitialize(params => {
	const tsdk = loadTsdkByPath(params.initializationOptions.typescript.tsdk, params.locale);
	return server.initialize(
		params,
		[
			createHtmlService(),
			createCssService(),
			createEmmetService({}),
			...createTypeScriptServices(tsdk.typescript, {}),
			createCrmscriptService({ sharedService: shared, crmscriptService: crmscript }),
		],
		createTypeScriptProjectProvider(tsdk.typescript, tsdk.diagnosticMessages, () => [getSuperOfficeLanguageModule()]),
	);
});

connection.onInitialized(params => {
	shared.workspace.WorkspaceManager.initialized(params);
	console.log('initialized');
	return server.initialized;
})


;/**/
connection.onShutdown(server.shutdown);