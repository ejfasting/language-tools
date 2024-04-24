import { ExtraServiceScript, forEachEmbeddedCode, type LanguagePlugin } from '@volar/language-core';
import { createSuperOfficeCode } from './documentScanner.js';
import type * as ts from 'typescript';

export const superofficeLanguagePlugin: LanguagePlugin = {
	createVirtualCode(_id, languageId, snapshot) {
		if (languageId === 'suo') {
			return createSuperOfficeCode(snapshot);
		}
	},
	updateVirtualCode(_id, _oldVirtualCode, newSnapshot) {
		return createSuperOfficeCode(newSnapshot);
	},
	typescript: {
		extraFileExtensions: [{ extension: 'crmscript', isMixedContent: true, scriptKind: 7 satisfies ts.ScriptKind.Deferred }],
		getScript() {
			return undefined;
		},
		getExtraScripts(fileName, root) {
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
		}
	}
};