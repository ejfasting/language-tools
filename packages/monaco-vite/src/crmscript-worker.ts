import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';

import type * as monaco from 'monaco-editor-core';
import {
	createTypeScriptWorkerService,
	ServiceEnvironment,
} from '@volar/monaco/worker';
import * as ts from 'typescript';

import { create as createTypeScriptService } from 'volar-service-typescript';

import { create as createCrmscriptService } from "../../superoffice-vscode-languageserver/src/crmscriptLanguageService.js";
import { crmscriptLanguagePlugin } from '../../superoffice-vscode-languageserver/src/languagePlugin.js';

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
				// ...
			},
			workerContext: ctx,
			env,
			languagePlugins: [crmscriptLanguagePlugin],
			servicePlugins: [
				// ...
				...createTypeScriptService(ts, {}),
				createCrmscriptService(),
			],
		});
	});
};