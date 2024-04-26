import { Uri, editor } from 'monaco-editor';
import { setupMonacoEnv } from './monaco-setup.js';
import { INITIAL_CODE, fileExtension } from './constants.js';


await setupMonacoEnv();

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
	editorInstance.setModel(editor.createModel(INITIAL_CODE, '', Uri.parse('file:///main' + fileExtension)));
	document.body.appendChild(rootElement);
}