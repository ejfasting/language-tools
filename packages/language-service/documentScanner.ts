import { type VirtualCode } from "@volar/language-core";
import type * as ts from 'typescript';

//This file is responsible for creating the virtual code for the SuperOffice language plugin.
//It takes care of all the logic for embedded languages and the main language itself.

//Constants for the script tags
// const _SCRIPT_START = '%EJSCRIPT_START%';
// const _SCRIPT_END = '%EJSCRIPT_END%';
// const _SCRIPT_INCLUDE_START = '<%';
// const _SCRIPT_INCLUDE_END = '%>';

export function createSuperOfficeCode(snapshot: ts.IScriptSnapshot): VirtualCode {
		//const addCode = `import * as RTL from "@superoffice/webapi"; \n`;
		//const newText = addCode + text;

		return {
			id: 'root',
			languageId: 'typescript',
			snapshot,
			mappings: [{
				sourceOffsets: [0],
				generatedOffsets: [0],
				lengths: [snapshot.getLength()],
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

	// const newText = blankOutNonScriptContent(text);

	// //TODO: create logic for the embedded languages. Also extract this logic into its own file..
	// return {
	// 	id: 'root',
	// 	languageId: 'crmscript',
	// 	snapshot: {
	// 		getText: (start, end) => newText.substring(start, end),
	// 		getLength: () => newText.length,
	// 		getChangeRange: () => undefined,
	// 	},
	// 	mappings: [{
	// 		sourceOffsets: [0],
	// 		generatedOffsets: [newText.length],
	// 		lengths: [newText.length],
	// 		data: {
	// 			completion: true,
	// 			format: true,
	// 			navigation: true,
	// 			semantic: true,
	// 			structure: true,
	// 			verification: true,
	// 		},
	// 	}],
	// 	embeddedCodes: []
	// };
//}

// function blankOutNonScriptContent(text: string): string {
// 	let result = '';
// 	let start = 0;
// 	let end = text.indexOf(_SCRIPT_INCLUDE_START);

// 	while (end !== -1) {
// 		result += ' '.repeat(end - start);
// 		start = text.indexOf(_SCRIPT_INCLUDE_END, end);
// 		if (start === -1) {
// 			break;
// 		}
// 		start += _SCRIPT_INCLUDE_END.length;
// 		result += ' '.repeat(_SCRIPT_INCLUDE_START.length) + text.substring(end + _SCRIPT_INCLUDE_START.length, start - _SCRIPT_INCLUDE_END.length) + ' '.repeat(_SCRIPT_INCLUDE_END.length);
// 		end = text.indexOf(_SCRIPT_INCLUDE_START, start);
// 	}
// 	result += ' '.repeat(text.length - start);
// 	return result;
// }