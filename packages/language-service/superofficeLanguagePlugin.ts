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
		//console.log("old: " + _oldVirtualCode.snapshot.getText(0, _oldVirtualCode.snapshot.getLength()) + "\n, new: " + newSnapshot.getText(0, newSnapshot.getLength()));
		return createSuperOfficeCode(newSnapshot);
	},
	typescript: {
		extraFileExtensions: [{ extension: 'crmscript', isMixedContent: true, scriptKind: 0 satisfies ts.ScriptKind.Unknown }],
		getScript() {
			return undefined;
		},
		getExtraScripts(fileName, root) {
			const scripts: ExtraServiceScript[] = [];
			for (const code of forEachEmbeddedCode(root)) {
				scripts.push({
					fileName: fileName + '.' + code.id + '.ts',
					code,
					extension: '.ts',
					scriptKind: 3 satisfies ts.ScriptKind.TS,
				});
			}
			return scripts;
		}
	}
};