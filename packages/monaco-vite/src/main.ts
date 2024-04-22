import { editor, languages } from 'monaco-editor';
import { setupMonacoEnvcrmscript } from './crmscript/setup-crmscript';

export const languageId: string = 'crmscript';
export const fileExtension: string = '.crmscript';

await setupMonacoEnvcrmscript();

// create div to avoid needing a HtmlWebpackPlugin template
(function () {

	const div = document.createElement('div');
	div.id = 'root';
	div.style.setProperty('width', '800px');
	div.style.setProperty('height', '600px');
	div.style.setProperty('border', '1px solid #ccc');

	document.body.appendChild(div);
})();

const rootElement = document.getElementById('root');
if (rootElement) {
	const editorInstance = editor.create(rootElement);
	editorInstance.setModel(editor.createModel('const foo = () => 0;', languageId));
	document.body.appendChild(rootElement);
}