import { ExtraServiceScript, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from '@volar/language-core';
import type * as ts from 'typescript';

export const crmscriptLanguagePlugin: LanguagePlugin = {
	createVirtualCode(_id, languageId, snapshot) {
		if (languageId === 'crmscript') {
			return createSuperOfficeCode(snapshot, languageId);
		}
	},
	updateVirtualCode(_id, _oldVirtualCode, newSnapshot) {
		return createSuperOfficeCode(newSnapshot, '');
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

function createSuperOfficeCode(snapshot: ts.IScriptSnapshot, languageId: string): VirtualCode {
	const text = snapshot.getText(0, snapshot.getLength());

	const ejscriptStart = text.indexOf(_SCRIPT_START);
	// EJSCRIPT_START not found. It means we can skip this, since it's standard typescript content
	if (ejscriptStart === -1) {
		//console.log('EJSCRIPT_START not found. It means we can skip this, since it\'s a standard JavaScript file');

		//const addCode = `import * as RTL from "${__dirname.replace(/\\/g, '/')}/cjs/WebApi"; \n`;
		//C:\Github\ejfasting\superoffice-vscode\packages\superoffice-vscode-client\dist\custom-types.d.ts
		//const addCode = `import * as RTL from "C:/Github/ejfasting/superoffice-vscode/packages/superoffice-vscode-client/dist/cjs/WebApi.d.ts"; \n`;
		const addCode = "";
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

	const addCode: string = `import * as RTL from "${__dirname.replace(/\\/g, '/')}/cjs/WebApi"; \n`;
	const newText = addCode + blankOutNonScriptContent(text);

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


// function createHtmlCode(snapshot: ts.IScriptSnapshot): HtmlCode {
// 	const document = html.TextDocument.create('', 'html', 0, snapshot.getText(0, snapshot.getLength()));
// 	const htmlDocument = htmlLs.parseHTMLDocument(document);

// 	return {
// 		id: 'root',
// 		languageId: 'html',
// 		snapshot,
// 		mappings: [{
// 			sourceOffsets: [0],
// 			generatedOffsets: [0],
// 			lengths: [snapshot.getLength()],
// 			data: {
// 				completion: true,
// 				format: true,
// 				navigation: true,
// 				semantic: true,
// 				structure: true,
// 				verification: true,
// 			},
// 		}],
// 		embeddedCodes: [...createEmbeddedCodes()],
// 		htmlDocument,
// 	};

// 	function* createEmbeddedCodes(): Generator<VirtualCode> {

// 		let styles = 0;
// 		let scripts = 0;

// 		for (const root of htmlDocument.roots) {
// 			if (root.tag === 'style' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
// 				const styleText = snapshot.getText(root.startTagEnd, root.endTagStart);
// 				yield {
// 					id: 'style_' + styles++,
// 					languageId: 'crmscript', //TEST - To see if the crmscriptLanguageService actually gives the completion items through the langium import
// 					snapshot: {
// 						getText: (start, end) => styleText.substring(start, end),
// 						getLength: () => styleText.length,
// 						getChangeRange: () => undefined,
// 					},
// 					mappings: [{
// 						sourceOffsets: [root.startTagEnd],
// 						generatedOffsets: [0],
// 						lengths: [styleText.length],
// 						data: {
// 							completion: true,
// 							format: true,
// 							navigation: true,
// 							semantic: true,
// 							structure: true,
// 							verification: true,
// 						},
// 					}],
// 					embeddedCodes: [],
// 				};
// 			}
// 			if (root.tag === 'script' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
// 				const text = snapshot.getText(root.startTagEnd, root.endTagStart);
// 				const lang = root.attributes?.lang;
// 				const isTs = lang === 'ts' || lang === '"ts"' || lang === "'ts'";
				
// 				/*TEST */
// 				const addCode: string = `import * as RTL from "${__dirname.replace(/\\/g, '/')}/cjs/WebApi"; \n`;
// 				const newText = addCode + text;
// 				/* EnD TEST */

// 				yield {
// 					id: 'script_' + scripts++,
// 					languageId: isTs ? 'typescript' : 'javascript',
// 					snapshot: {
// 						getText: (start, end) => newText.substring(start, end),
// 						getLength: () => newText.length,
// 						getChangeRange: () => undefined,
// 					},
// 					mappings: [{
// 						sourceOffsets: [root.startTagEnd],
// 						generatedOffsets: [addCode.length],
// 						lengths: [newText.length],
// 						data: {
// 							completion: true,
// 							format: true,
// 							navigation: true,
// 							semantic: true,
// 							structure: true,
// 							verification: true,
// 						},
// 					}],
// 					embeddedCodes: [],
// 				};
// 			}
// 		}
// 	}
// }