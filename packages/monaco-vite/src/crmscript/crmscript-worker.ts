import * as worker from 'monaco-editor/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor-core';
import {
	createSimpleWorkerService,
	ServiceEnvironment,
} from '@volar/monaco/worker';

 import { create as createCrmscriptService } from "../../../superoffice-vscode-languageserver/src/crmscriptLanguageService.js";
 import { crmscriptLanguagePlugin } from "../../../superoffice-vscode-languageserver/src/languagePlugin.js";
//  import { loadTsdkByUrl } from '@volar/language-server/browser.js';


self.onmessage = () => {
	worker.initialize((ctx: monaco.worker.IWorkerContext) => {
		const env: ServiceEnvironment = {
			workspaceFolder: 'file:///',
		};

		console.log("the worker is initialized");
		return createSimpleWorkerService({
			workerContext: ctx,
			env,
			languagePlugins: [
				crmscriptLanguagePlugin
			],
			servicePlugins: [
				createCrmscriptService(),
			],
		});
	});
};