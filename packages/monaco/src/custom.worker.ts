import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import {
	createTypeScriptWorkerLanguageService,
	type LanguageServiceEnvironment,
} from '@volar/monaco/worker.js';
import { createNpmFileSystem } from '@volar/jsdelivr';
import { URI } from 'vscode-uri';

// import { service as crmscriptLanguageService } from "@superoffice/language-service/crmscriptLanguageService.js";
// import { suoLanguagePlugin } from "@superoffice/language-service/suoLanguagePlugin.js";

import { create as createCrmscriptService } from '@superoffice/language-server/src/plugins/crmscript-definition.js';
import { getSuperOfficeLanguagePlugin } from '@superoffice/language-server/src/core/superoffice.js';

import ts from 'typescript';
import { create as createEmmetService } from 'volar-service-emmet';
import { create as createHtmlService } from 'volar-service-html';
import { create as createCssService } from 'volar-service-css';
import { create as createTypeScriptService } from 'volar-service-typescript';
import { createCrmscriptServices } from '@superoffice/langium-crmscript/src/language/crmscript-module.js';

import { NodeFileSystem } from 'langium/node';

// Inject the shared services and language-specific services
const { shared, Definition } = createCrmscriptServices({ ...NodeFileSystem });

self.onmessage = () => {
	worker.initialize((ctx: monaco.worker.IWorkerContext) => {
		const env: LanguageServiceEnvironment = {
			workspaceFolders: [URI.parse('file:///')],
			fs: createNpmFileSystem(),
		};
		const asFileName = (uri: URI) => uri.path
		const asUri = (fileName: string): URI => URI.file(fileName)

		return createTypeScriptWorkerLanguageService({
			typescript: ts,
			compilerOptions: {
				...ts.getDefaultCompilerOptions(),
				allowJs: true,
				module: ts.ModuleKind.ESNext,
				target: ts.ScriptTarget.ESNext,
			},
			workerContext: ctx,
			env,
			languagePlugins: [
				//TODO: Figure this out
				getSuperOfficeLanguagePlugin()
			],
			languageServicePlugins: [
				// ...
				createHtmlService(),
				createCssService(),
				createEmmetService({}),
				...createTypeScriptService(ts),
				createCrmscriptService({ sharedService: shared, definitionService: Definition }),
			],
			uriConverter: {
				asFileName,
				asUri,
			},
		});
	});
};