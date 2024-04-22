import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor-core';
import {
	createTypeScriptWorkerService,
	ServiceEnvironment,
} from '@volar/monaco/worker';


import { create as createCrmscriptService } from "../../../superoffice-vscode-languageserver/src/crmscriptLanguageService.js";
import { crmscriptLanguagePlugin } from "../../../superoffice-vscode-languageserver/src/languagePlugin.js";

import * as ts from 'typescript';
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

		//ReferenceError: process is not defined
		//on line 124 in path-browserify/index.js -
		return createTypeScriptWorkerService({
						typescript: ts,
						compilerOptions: {
							// ...
						},
						workerContext: ctx,
						env,
						languagePlugins: [
							// ...
						],
						servicePlugins: [
							// ...
							...createTypeScriptService(ts),
						],
					});

		//This actually works, kinda, but has no ts support
		// return createSimpleWorkerService({
		// 	workerContext: ctx,
		// 	env,
		// 	languagePlugins: [
		// 		crmscriptLanguagePlugin,
		// 	],
		// 	servicePlugins: [
		// 		createCrmscriptService(),
		// 	],
		// });
	});
};