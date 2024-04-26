import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor-core';
import {
    createTypeScriptWorkerService,
    ServiceEnvironment
} from '@volar/monaco/worker.js';


import { create as crmscriptLanguageService } from "@superoffice/language-service/crmscriptLanguageService.js";
import { superofficeLanguagePlugin } from "@superoffice/language-service/superofficeLanguagePlugin.js";

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
				superofficeLanguagePlugin
			],
			servicePlugins: [
				// ...
				...createTypeScriptService(ts),
				crmscriptLanguageService()
			],
		});
	});
};