
import { editor, languages } from 'monaco-editor';
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';

import customWorker from './custom.worker?worker';
import {languageId, fileExtension} from './constants';

import * as vls from '@volar/language-service';
import * as volar from '@volar/monaco';
import { loadTheme } from './themes';

export const setupMonacoEnv = async () => {
  
  languages.register({ id: languageId, extensions: [fileExtension] });

  self.MonacoEnvironment ??= {};

  self.MonacoEnvironment.getWorker = (_: any, label: string) => {
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

  const theme = loadTheme(editor);
  editor.setTheme((await theme).dark);

  // worker
  const languageIds = [languageId];
  const getSyncUris = () => editor.getModels().map(model => model.uri);
  volar.activateMarkers(worker, languageIds, languageId, getSyncUris, editor);
  volar.activateAutoInsertion(worker, languageIds, getSyncUris, editor);
  await volar.registerProviders(worker, languageId, getSyncUris, languages);
};