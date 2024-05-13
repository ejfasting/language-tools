import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor';
import {
    createTypeScriptWorkerService,
    ServiceEnvironment,
	activateAutomaticTypeAcquisition,
} from '@volar/monaco/worker.js';


// import { service as crmscriptLanguageService } from "@superoffice/language-service/crmscriptLanguageService.js";
// import { suoLanguagePlugin } from "@superoffice/language-service/suoLanguagePlugin.js";

import { create as createCrmscriptService } from '@superoffice/language-server/src/plugins/crmscript.js';
import { getSuperOfficeLanguageModule } from '@superoffice/language-server/src/core/superoffice.js';

import ts from 'typescript';
import { create as createTypeScriptService } from 'volar-service-typescript';

self.onmessage = () => {
	worker.initialize((ctx: monaco.worker.IWorkerContext) => {
		const env: ServiceEnvironment = {
			workspaceFolder: 'file:///',
			typescript: {
				uriToFileName: uri => uri.substring('file://'.length),
				fileNameToUri: fileName => 'file://' + fileName,
			},
		};

		activateAutomaticTypeAcquisition(env);
		return createTypeScriptWorkerService({
			typescript: ts,
			compilerOptions: {
                ...ts.getDefaultCompilerOptions(),
                allowJs: true,
                jsx: ts.JsxEmit.Preserve,
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.NodeNext,
            },
			workerContext: ctx,
			env,
			languagePlugins: [
				getSuperOfficeLanguageModule()
			],
			servicePlugins: [
				// ...
				...createTypeScriptService(ts),
				createCrmscriptService(),
			],
		});
	});
};