import { ExtraServiceScript, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from '@volar/language-core';
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

//TODO: Refactor into own file
const _SCRIPT_START = '%EJSCRIPT_START%';
//const _SCRIPT_END = '%EJSCRIPT_END%';
const _SCRIPT_INCLUDE_START = '<%';
const _SCRIPT_INCLUDE_END = '%>';

function blankOutNonScriptContent(text: string): string {
	let result = '';
	let start = 0;
	let end = text.indexOf(_SCRIPT_INCLUDE_START);

	while (end !== -1) {
		result += ' '.repeat(end - start);
		start = text.indexOf(_SCRIPT_INCLUDE_END, end);
		if (start === -1) {
			break;
		}
		start += _SCRIPT_INCLUDE_END.length;
		result += ' '.repeat(_SCRIPT_INCLUDE_START.length) + text.substring(end + _SCRIPT_INCLUDE_START.length, start - _SCRIPT_INCLUDE_END.length) + ' '.repeat(_SCRIPT_INCLUDE_END.length);
		end = text.indexOf(_SCRIPT_INCLUDE_START, start);
	}
	result += ' '.repeat(text.length - start);
	return result;
}

function createSuperOfficeCode(snapshot: ts.IScriptSnapshot): VirtualCode {
	const text = snapshot.getText(0, snapshot.getLength());

	const ejscriptStart = text.indexOf(_SCRIPT_START);
	// EJSCRIPT_START not found. It means we can skip this, since it's standard typescript content
	if (ejscriptStart === -1) {
		//console.log('EJSCRIPT_START not found. It means we can skip this, since it\'s a standard JavaScript file');
		const addCode = `import * as RTL from "@superoffice/webapi"; \n`;
		const newText = addCode + text;

		return {
			id: 'root',
			languageId: 'typescript',
			snapshot: {
				getText: (start, end) => newText.substring(start, end),
				getLength: () => newText.length,
				getChangeRange: () => undefined,
			},
			mappings: [{
				sourceOffsets: [0],
				generatedOffsets: [addCode.length],
				lengths: [newText.length],
				data: {
					completion: true,
					format: true,
					navigation: true,
					semantic: true,
					structure: true,
					verification: true,
				},
			}],
			embeddedCodes: []
		};
	}

	const newText = blankOutNonScriptContent(text);

	//TODO: create logic for the embedded languages. Also extract this logic into its own file..
	return {
		id: 'root',
		languageId: 'crmscript',
		snapshot: {
			getText: (start, end) => newText.substring(start, end),
			getLength: () => newText.length,
			getChangeRange: () => undefined,
		},
		mappings: [{
			sourceOffsets: [0],
			generatedOffsets: [newText.length],
			lengths: [newText.length],
			data: {
				completion: true,
				format: true,
				navigation: true,
				semantic: true,
				structure: true,
				verification: true,
			},
		}],
		embeddedCodes: []
	};
}