import {
	forEachEmbeddedCode,
	ExtraServiceScript,
	type LanguagePlugin,
} from '@volar/language-core';
import ts from 'typescript';
import { SuoVirtualCode } from './suoVirtualCode.js';

export const suoLanguagePlugin: LanguagePlugin = {
	getLanguageId(uri) {
		if (uri.endsWith('.suo')) {
			return 'suo';
		}
	},

	createVirtualCode(_uri, languageId, snapshot) {
		if (languageId !== 'suo') {
			return;
		}
		return new SuoVirtualCode(snapshot);
	},
	updateVirtualCode(_uri, languageCode, newSnapshot) {
		languageCode.update(newSnapshot);
		return languageCode;
	},
	typescript: {
		extraFileExtensions: [{ extension: 'crmscript', isMixedContent: true, scriptKind: 0 satisfies ts.ScriptKind.Unknown }],
		getServiceScript() {
			return undefined;
		},
		getExtraServiceScripts(fileName, root) {
			const scripts: ExtraServiceScript[] = [];
			for (const code of forEachEmbeddedCode(root)) {
				if (code.languageId === 'javascript') {
					scripts.push({
						fileName: fileName + '.' + code.id + '.js',
						code,
						extension: '.js',
						scriptKind: 1 satisfies ts.ScriptKind.JS,
					});
				}
				else if (code.languageId === 'typescript') {
					scripts.push({
						fileName: fileName + '.' + code.id + '.ts',
						code,
						extension: '.ts',
						scriptKind: 3 satisfies ts.ScriptKind.TS,
					});
				}
			}
			return scripts;
		},
	}
} satisfies LanguagePlugin<SuoVirtualCode>;
