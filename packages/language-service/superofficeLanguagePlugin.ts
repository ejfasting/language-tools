import {
	type CodeMapping,
	type LanguagePlugin,
	type VirtualCode,
	forEachEmbeddedCode,
	ExtraServiceScript,
} from '@volar/language-core';
import type ts from 'typescript';
import { getEmbeddedCodes } from './embeddedCodes.js';

export const superofficeLanguagePlugin: LanguagePlugin<SuoVirtualCode> = {
	createVirtualCode(fileId, languageId, snapshot) {
		if (languageId === 'suo') {
			console.log(fileId);
			// fileId will never be a uri in ts plugin
			const fileName = fileId;
			return new SuoVirtualCode(fileName, snapshot);
		}
	},
	updateVirtualCode(_fileId, suoFile, snapshot) {
		suoFile.update(snapshot);
		return suoFile;
	},
	typescript: {
		extraFileExtensions: [{ extension: 'crmscript', isMixedContent: true, scriptKind: 0 satisfies ts.ScriptKind.Unknown }],
		getScript() {
			return undefined;
		},
		getExtraScripts(fileName, root) {
			const scripts: ExtraServiceScript[] = [];
			//TODO: Is this still needed?
			for (const code of forEachEmbeddedCode(root)) {
				if (code.languageId === 'typescript') {
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

		// TODO: Test if this can be used to inject a custom *d.ts file -> languageServerHost.getScriptFileNames
		// resolveLanguageServiceHost(host) {
		// 	// host.getScriptFileNames().forEach(element => {
		// 	// 	console.log(element);
		// 	// });
		// 	const scriptFiles = host.getScriptFileNames();
		// 	const myFile = path.join(__dirname, 'MyInterface.d.ts');
		// 	scriptFiles.push(myFile);
		// 	return {
		// 		...host,
		// 		getScriptFileNames: () => scriptFiles,
		// 	};
		// }
	}
};


export class SuoVirtualCode implements VirtualCode {
	id = 'root';
	languageId = 'suo';
	mappings!: CodeMapping[];
	embeddedCodes!: VirtualCode[];

	constructor(
		public fileName: string,
		public snapshot: ts.IScriptSnapshot
	) {
		this.onSnapshotUpdated();
	}

	public update(newSnapshot: ts.IScriptSnapshot) {
		this.snapshot = newSnapshot;
		this.onSnapshotUpdated();
	}

	onSnapshotUpdated() {
		this.mappings = [
			{
				sourceOffsets: [0],
				generatedOffsets: [0],
				lengths: [this.snapshot.getLength()],
				data: {
					verification: true,
					completion: true,
					semantic: true,
					navigation: true,
					structure: true,
					format: false,
				},
			},
		];

		this.embeddedCodes = [];
		if (this.snapshot.getLength() > 0) {
			const embeddedCodes = getEmbeddedCodes(this.snapshot.getText(0, this.snapshot.getLength()), this.fileName);
			this.embeddedCodes = embeddedCodes;
		}
	}
}