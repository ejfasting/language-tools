import { CodeInformation, CodeMapping, Segment, VirtualCode, buildMappings, toString as volarToString } from "@volar/language-core";
import ts from "typescript";

const EJSCRIPT_START = '%EJSCRIPT_START%';
const EJSCRIPT_END = '%EJSCRIPT_END%';
const SCRIPT_START = '<%';
const SCRIPT_END = '%>';
const npmImport = `import * as RTL from "@superoffice/webapi"; \n`;

export class SuoVirtualCode implements VirtualCode {
	id = 'root';
	languageId = 'suo';
	mappings: CodeMapping[] = []; // Change this type according to your needs
	embeddedCodes: VirtualCode[] = [];

	constructor(
		public snapshot: ts.IScriptSnapshot
	) {
		this.snapshot = snapshot;
		this.onSnapshotUpdated();
	}

	public update(newSnapshot: ts.IScriptSnapshot): void {
		this.snapshot = newSnapshot;
		this.onSnapshotUpdated();
	}

	onSnapshotUpdated(): void {
		const snapshotContent = this.snapshot.getText(0, this.snapshot.getLength());
		const isCrmScript = snapshotContent.includes('#setLanguageLevel');

		if (snapshotContent.includes(EJSCRIPT_START) && snapshotContent.includes(EJSCRIPT_END)) {
			this.embeddedCodes = [];
			//this.injectImportStatements(snapshotContent);
			this.getScriptCodeBlocks(snapshotContent);

			this.languageId = 'plaintext';
			this.mappings = [{
				sourceOffsets: [0],
				generatedOffsets: [0],
				lengths: [this.snapshot.getLength()],
				data: {
					completion: true,
					format: true,
					navigation: true,
					semantic: true,
					structure: true,
					verification: true,
				},
			}];
		}
		else {
			if (!isCrmScript) {
				this.languageId = 'typescript';
				this.generateTypeScriptMappingsWithAdditions(snapshotContent);
			}
			else {
				this.languageId = 'crmscript';
				this.mappings = [{
					sourceOffsets: [0],
					generatedOffsets: [0],
					lengths: [this.snapshot.getLength()],
					data: {
						completion: true,
						format: true,
						navigation: true,
						semantic: true,
						structure: true,
						verification: true,
					},
				}];
			}
			this.embeddedCodes = [];
		}
	}

	//TODO: Validate that this is the correct way to do it? 
	generateTypeScriptMappingsWithAdditions(snapshotContent: string): void {
		const segments: Segment<CodeInformation>[] = [];
		segments.push([npmImport, undefined, snapshotContent.length + npmImport.length, this.typescriptFeatures]);
		segments.push([snapshotContent, undefined, 0, this.typescriptFeatures]);
		const generated = volarToString(segments);
		this.snapshot = {
			getText: (start, end) => generated.slice(start, end),
			getLength: () => generated.length,
			getChangeRange: () => undefined,
		};
		this.mappings = buildMappings(segments);
	}

	getScriptCodeBlocks(snapshotContent: string): void {
		let start = 0;
		let end = 0;

		//Add segment with the import for @superoffice/webapi
		const segments: Segment<CodeInformation>[] = [];
		segments.push([npmImport, undefined, snapshotContent.length + npmImport.length, this.typescriptFeatures]);

		//Loop the content and find all script blocks
		while (start !== -1 && end !== -1) {
			start = snapshotContent.indexOf(SCRIPT_START, end);
			end = snapshotContent.indexOf(SCRIPT_END, start);
			if (start !== -1 && end !== -1) {
				segments.push([snapshotContent.slice(start + 2, end), undefined, start + 2, this.typescriptFeatures]);
			}
		}
		const generated = volarToString(segments);

		const scriptBlock = {
			id: 'typescript',
			languageId: 'typescript',
			snapshot: {
				getText: (start: number | undefined, end: number | undefined) => generated.slice(start, end),
				getLength: () => generated.length,
				getChangeRange: () => undefined,
			},
			mappings: buildMappings(segments)
		};
		this.embeddedCodes.push(scriptBlock);
	}

	typescriptFeatures = {
		verification: true,
		completion: true,
		semantic: true,
		navigation: true,
		structure: true,
		format: false,
	};
}