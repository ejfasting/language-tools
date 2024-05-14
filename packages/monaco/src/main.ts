import { Uri, editor } from 'monaco-editor';
import { setupMonacoEnv } from './monaco-setup.js';
import { languages, type Language } from './constants.js';


await setupMonacoEnv();

function appendEditor(language: Language){
	const div = document.createElement('div');
	div.id = language.id + '-editor';
	div.style.setProperty('width', '800px');
	div.style.setProperty('height', '300px');
	div.style.setProperty('border', '1px solid #ccc');
	document.body.appendChild(div);
}

function configureEditor(language: Language){
	const rootElement = document.getElementById(language.id + '-editor');
	if (rootElement) {
		const editorInstance = editor.create(rootElement);
		editorInstance.setModel(editor.createModel(language.initialCode, '', Uri.parse('file:///main' + '.' + language.id)));
		document.body.appendChild(rootElement);
	}
}
// create div to avoid needing a HtmlWebpackPlugin template
(function () {
	languages.forEach(element => {
		appendEditor(element);
	});
	
})();

languages.forEach(element => {
	configureEditor(element);
});