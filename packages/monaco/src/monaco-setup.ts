
import { editor, languages } from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

import customWorker from './custom.worker?worker';
import {languageId, fileExtension} from './constants.js';

import * as vls from '@volar/language-service';
import * as volar from '@volar/monaco';
import { loadTheme } from './themes/index.js';

export const setupMonacoEnv = async (): Promise<void> => {
  
  languages.register({ id: languageId, extensions: [fileExtension] }); 

  /*Top-level 'await' expressions are only allowed when the 'module' option is set to 'es2022', 'esnext', 'system', 'node16', 
  'nodenext', or 'preserve', and the 'target' option is set to 'es2017' or higher.ts(1378) */
  languages.typescript.typescriptDefaults.setCompilerOptions({
      target: languages.typescript.ScriptTarget.ES2017,
      module: languages.typescript.ModuleKind.ESNext,
      allowNonTsExtensions: true
  });

  languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    diagnosticCodesToIgnore: [1378]
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