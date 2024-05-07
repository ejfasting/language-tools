import { create as createEmmetService } from 'volar-service-emmet';
import { create as createHtmlService } from 'volar-service-html';
import { create as createCssService } from 'volar-service-css';
import { create as createTypeScriptServices } from 'volar-service-typescript';
import { createServer, createConnection, createTypeScriptProjectProvider, loadTsdkByPath } from '@volar/language-server/node.js';

import { service as crmscriptLanguageService } from "@superoffice/language-service/crmscriptLanguageService.js";
import { suoLanguagePlugin } from '@superoffice/language-service/suoLanguagePlugin.js';

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
			crmscriptLanguageService,
		],
		createTypeScriptProjectProvider(tsdk.typescript, tsdk.diagnosticMessages, () => [suoLanguagePlugin]),
	);
});

connection.onInitialized(server.initialized);

connection.onShutdown(server.shutdown);