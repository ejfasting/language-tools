import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import {
    createTypeScriptWorkerService,
    ServiceEnvironment,
	activateAutomaticTypeAcquisition,
} from '@volar/monaco/worker.js';



// import { service as crmscriptLanguageService } from "@superoffice/language-service/crmscriptLanguageService.js";
// import { suoLanguagePlugin } from "@superoffice/language-service/suoLanguagePlugin.js";

import { create as createCrmscriptService } from '@superoffice/language-server/src/plugins/crmscript-definition.js';
import { getSuperOfficeLanguageModule } from '@superoffice/language-server/src/core/superoffice.js';

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
		const env: ServiceEnvironment = {
			workspaceFolder: 'file:///',
			typescript: {
				uriToFileName: (uri: string) => uri.substring('file://'.length),
				fileNameToUri: (fileName: string) => 'file://' + fileName,
			},
		};

		activateAutomaticTypeAcquisition(env);
		return createTypeScriptWorkerService({
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
				getSuperOfficeLanguageModule()
			],
			servicePlugins: [
				// ...
				createHtmlService(),
				createCssService(),
				createEmmetService({}),
				...createTypeScriptService(ts),
				createCrmscriptService({ sharedService: shared, definitionService: Definition }),
			],
		});
	});
};