
import { editor, languages } from 'monaco-editor';
import editorWorker from 'monaco-editor-core/esm/vs/editor/editor.worker?worker';

import crmscriptWorker from './crmscript-worker?worker';
import {languageId, fileExtension} from '../main';

import * as vls from '@volar/language-service';
import * as volar from '@volar/monaco';

export const setupMonacoEnvcrmscript = async () => {
  
  languages.register({ id: languageId, extensions: [fileExtension] });
  self.MonacoEnvironment ??= {};

  self.MonacoEnvironment.getWorker = (_: any, label: string) => {
    if (label === languageId) {
      return new crmscriptWorker();
    }
    return new editorWorker();
  };

  const worker = editor.createWebWorker<vls.LanguageService>({
    moduleId: 'vs/language/crmscript/crmscriptWorker',
    label: languageId,
    createData: {}
  });

  // worker
  const languageIds = [languageId];
  const getSyncUris = () => editor.getModels().map(model => model.uri);
  volar.activateMarkers(worker, languageIds, languageId, getSyncUris, editor);
  volar.activateAutoInsertion(worker, languageIds, getSyncUris, editor);
  await volar.registerProviders(worker, languageId, getSyncUris, languages);
};