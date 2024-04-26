import { VirtualCode } from "@volar/language-core";
import ts from 'typescript';

export function getEmbeddedCodes(text: string, fileName: string){
	const startTag = "<%";
	const endTag = "%>";
	const ejscriptStartTag = "%EJSCRIPT_START%";
	const ejscriptEndTag = "%EJSCRIPT_END%";

	const virtualCodes: VirtualCode[] = [];
	const isCrmScript = text.includes('#setLanguageLevel');

	//If the document does not contain %EJSCRIPT_START%, we can assume that it is a root document
	if (!text.includes(ejscriptStartTag)) {
		virtualCodes.push(createEmbeddedVirtualCode(text, isCrmScript ? 'crmscript' : 'typescript'));
	}
	else {
		//If the document contains %EJSCRIPT_START%, we can assume that it is a mixed content document
		//We need to split the document into multiple virtual codes, one for each language
		//Anything between startTag and endTag are considered crmscript or typescript. Anything outside of these tags are considered plaintext
		//Create method to split the document into virtual codes

		virtualCodes.push(createEmbeddedVirtualCode(replaceOutsideCustomBlocks(text), isCrmScript ? 'crmscript' : 'typescript'));
		virtualCodes.push(createEmbeddedVirtualCode(replaceInsideCustomTags(text), 'plaintext'));

		// const { customCode, standardCode } = separateCustomAndStandardCode(text);
		// virtualCodes.push(createEmbeddedVirtualCode(customCode, 'plaintext'));
		// virtualCodes.push(createEmbeddedVirtualCode(standardCode, 'plaintext'));
	}

	function replaceOutsideCustomBlocks(text: string): ts.IScriptSnapshot {
		const startTag = "<%";
		const endTag = "%>";
	
		let result = "";
		let currentPosition = 0;
		let lastEndIndex = 0;
	
		while (currentPosition < text.length) {
			const startIndex = text.indexOf(startTag, currentPosition);
			if (startIndex === -1) break;
	
			const endIndex = text.indexOf(endTag, startIndex + startTag.length);
			if (endIndex === -1) break;
	
			// Add whitespace between last code block and current one
			result += " ".repeat(startIndex - lastEndIndex);
	
			// Replace <% with a corresponding number of spaces
			result += " ".repeat(startTag.length);
	
			// Add code block content
			result += text.substring(startIndex + startTag.length, endIndex);
	
			// Replace %> with a corresponding number of spaces
			result += " ".repeat(endTag.length);
	
			lastEndIndex = endIndex + endTag.length;
			currentPosition = lastEndIndex;
		}
	
		// Add whitespace after the last code block
		result += " ".repeat(text.length - lastEndIndex);
		return ts.ScriptSnapshot.fromString(result);
	}

	function replaceInsideCustomTags(text: string): ts.IScriptSnapshot {
		let result = "";
		let currentPosition = 0;
	
		// Find the index of %EJSCRIPT_START%
		const ejscriptStartIndex = text.indexOf(ejscriptStartTag);
		if (ejscriptStartIndex !== -1) {
			result += text.substring(currentPosition, ejscriptStartIndex) + " ".repeat(ejscriptStartTag.length);
			currentPosition = ejscriptStartIndex + ejscriptStartTag.length;
	
			// If %EJSCRIPT_START% is found but %EJSCRIPT_END% is not, return early
			const ejscriptEndIndex = text.indexOf(ejscriptEndTag, currentPosition);
			if (ejscriptEndIndex === -1) {
				return result;
			}
		}
	
		// Loop through the text to find code blocks and non-code text
		while (currentPosition < text.length) {
			const startIndex = text.indexOf(startTag, currentPosition);
			const endIndex = text.indexOf(endTag, currentPosition);
	
			// If endIndex is not found or it occurs before startIndex, break the loop
			if (endIndex === -1 || (startIndex !== -1 && endIndex < startIndex)) {
				break;
			}
	
			// Add non-code text before the code block
			result += text.substring(currentPosition, startIndex);
	
			// Replace the content inside <CUSTOMSTART> and <CUSTOMEND> tags with whitespace
			result += " ".repeat(endIndex - startIndex - startTag.length);
	
			currentPosition = endIndex + endTag.length;
		}
	
		// Add remaining text after the last code block
		result += text.substring(currentPosition);
	
		// Replace %EJSCRIPT_END% with whitespace if found
		const ejscriptEndIndex = result.indexOf(ejscriptEndTag);
		if (ejscriptEndIndex !== -1) {
			result = result.substring(0, ejscriptEndIndex) + " ".repeat(ejscriptEndTag.length) + result.substring(ejscriptEndIndex + ejscriptEndTag.length);
		}
		return ts.ScriptSnapshot.fromString(result);
	}

	function createEmbeddedVirtualCode(snapshot: ts.IScriptSnapshot, languageId: string): VirtualCode {
		return {
			id: 'embedded_' + languageId,
			languageId: languageId,
			snapshot: snapshot,
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

	return virtualCodes;
}