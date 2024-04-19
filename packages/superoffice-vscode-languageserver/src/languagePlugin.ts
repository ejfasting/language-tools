import { ExtraServiceScript, forEachEmbeddedCode, type LanguagePlugin, type VirtualCode } from '@volar/language-core';
import type * as ts from 'typescript';
import * as html from 'vscode-html-languageservice';

export const crmscriptLanguagePlugin: LanguagePlugin = {
	createVirtualCode(_id, languageId, snapshot) {
		if (languageId === 'crmscript') {
			return createcrmscriptCode(snapshot);
		}
	},
	updateVirtualCode(_id, _oldVirtualCode, newSnapshot) {
		return createcrmscriptCode(newSnapshot);
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
		},
		resolveLanguageServiceHost(host) {
			const fileNames = host.getScriptFileNames();
			console.log(fileNames);
			//Now what?
			return host;
		}
	}
};

const htmlLs = html.getLanguageService();

export interface CrmscriptCode extends VirtualCode {
	// Reuse for custom service plugin
	htmlDocument: html.HTMLDocument;
}

function createcrmscriptCode(snapshot: ts.IScriptSnapshot): CrmscriptCode {
	const document = html.TextDocument.create('', 'html', 0, snapshot.getText(0, snapshot.getLength()));
	const htmlDocument = htmlLs.parseHTMLDocument(document);

	return {
		id: 'root',
		languageId: 'html',
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
		embeddedCodes: [...createEmbeddedCodes()],
		htmlDocument,
	};

	function* createEmbeddedCodes(): Generator<VirtualCode> {

		let styles = 0;
		let scripts = 0;

		for (const root of htmlDocument.roots) {
			if (root.tag === 'style' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
				const styleText = snapshot.getText(root.startTagEnd, root.endTagStart);
				yield {
					id: 'style_' + styles++,
					languageId: 'crmscript',
					snapshot: {
						getText: (start, end) => styleText.substring(start, end),
						getLength: () => styleText.length,
						getChangeRange: () => undefined,
					},
					mappings: [{
						sourceOffsets: [root.startTagEnd],
						generatedOffsets: [0],
						lengths: [styleText.length],
						data: {
							completion: true,
							format: true,
							navigation: true,
							semantic: true,
							structure: true,
							verification: true,
						},
					}],
					embeddedCodes: [],
				};
			}
			if (root.tag === 'script' && root.startTagEnd !== undefined && root.endTagStart !== undefined) {
				const text = snapshot.getText(root.startTagEnd, root.endTagStart);
				const lang = root.attributes?.lang;
				const isTs = lang === 'ts' || lang === '"ts"' || lang === "'ts'";

				/*TEST */
				const addCode: string = `import { MyCustomType } from "${__dirname.replace(/\\/g, '/')}/custom-types"; \n`;
				const newCode = addCode + text;
				/* EnD TEST */
				yield {
					id: 'script_' + scripts++,
					languageId: isTs ? 'typescript' : 'javascript',
					snapshot: {
						getText: (start, end) => newCode.substring(start, end),
						getLength: () => newCode.length,
						getChangeRange: () => undefined,
					},
					mappings: [{
						sourceOffsets: [root.startTagEnd],
						generatedOffsets: [125],
						lengths: [newCode.length],
						data: {
							completion: true,
							format: true,
							navigation: true,
							semantic: true,
							structure: true,
							verification: true,
						},
					}],
					embeddedCodes: [],
				};
			}
		}
	}
}