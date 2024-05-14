
import { editor, languages as editorLanguages } from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import customWorker from './custom.worker?worker';
import { languages, type Language } from './constants.js';

import * as vls from '@volar/language-service';
import * as volar from '@volar/monaco';
import { loadTheme } from './themes/index.js';

export const setupMonacoEnv = async (): Promise<void> => {
  
  languages.forEach(element => {
		editorLanguages.register({ id: element.id, extensions: [element.fileExtension] });
	});

  self.MonacoEnvironment ??= {};

  self.MonacoEnvironment.getWorker = (_: unknown, label: string) => {
    if(languages.find((lang) => lang.id === label)){
      return new customWorker();
    }
    return new editorWorker();
  };
  languages.forEach(element => {
    createAndSetWorker(element);
  });

};

async function createAndSetWorker(language: Language){
  const worker = editor.createWebWorker<vls.LanguageService>({
    moduleId: 'vs/language/' + language.id + '/' + language.id  + 'Worker',
    label: language.id,
    createData: {}
  });
  
  const theme = await loadTheme(editor);
  editor.setTheme(theme.dark);

  const languageIds = [language.id];
  const getSyncUris = () => editor.getModels().map(model => model.uri);
  volar.activateMarkers(worker, languageIds, language.id, getSyncUris, editor);
  volar.activateAutoInsertion(worker, languageIds, getSyncUris, editor);
  await volar.registerProviders(worker, languageIds, getSyncUris, editorLanguages);
}