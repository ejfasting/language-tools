
import { editor, languages, Uri } from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import customWorker from './custom.worker?worker';
import {languageId, fileExtension} from './constants.js';

import * as vls from '@volar/language-service';
import * as volar from '@volar/monaco';
import { loadTheme } from './themes/index.js';

export const setupMonacoEnv = async (): Promise<void> => {
  
  languages.register({ id: languageId, extensions: [fileExtension] }); 


  // 
  // languages.typescript.javascriptDefaults.addExtraLib(api.default, modelUri);
  // editor.createModel(api.default, "javascript", Uri.parse(modelUri));

  const modelUri = "ts:/node_modules/@types/superoffice/index.d.ts";
  Promise.all([
    fetch('https://www.unpkg.com/@superoffice/webapi@10.3.4/dist/cjs/WebApi.ts').then((res) => res.text())
]).then(([typings]) => {
    languages.typescript.typescriptDefaults.addExtraLib(typings, modelUri);
    editor.createModel(typings, 'typescript', Uri.parse(modelUri));
});


  self.MonacoEnvironment ??= {};

  self.MonacoEnvironment.getWorker = (_: unknown, label: string) => {
    if (label === languageId) {
      return new customWorker();
    }
    return new editorWorker();
  };

  const worker = editor.createWebWorker<vls.LanguageService>({
    moduleId: 'vs/language/' + languageId + '/' + languageId  + 'Worker',
    label: languageId,
    createData: {}
  });


   const theme = await loadTheme(editor);
   editor.setTheme(theme.dark);

  // worker
  const languageIds = [languageId];
  const getSyncUris = () => editor.getModels().map(model => model.uri);
  volar.activateMarkers(worker, languageIds, languageId, getSyncUris, editor);
  volar.activateAutoInsertion(worker, languageIds, getSyncUris, editor);
  await volar.registerProviders(worker, languageId, getSyncUris, languages);
};