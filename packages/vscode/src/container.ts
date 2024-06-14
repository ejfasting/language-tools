// container.ts

import * as vscode from 'vscode';
import { Issuer as issuer } from 'openid-client';
import { createServer } from 'http';
import { AuthenticationService, IAuthenticationService } from './services/authenticationService';
import { parse } from 'url';
import { FileSystemHandler, IFileSystemHandler } from './handlers/fileSystemHandler';
import { IScriptService, ScriptService } from './services/scriptService';
import { TreeViewDataProvider } from './providers/treeViewDataProvider';
import { VirtualFileSystemProvider } from './handlers/virtualWorkspaceFileManager';

export async function initializeServices(): Promise<{
    authenticationService: IAuthenticationService,
    fileSystemHandler: IFileSystemHandler,
    scriptService: IScriptService,
    treeViewDataProvider: TreeViewDataProvider,
    vfsProvider: VirtualFileSystemProvider
}> {
    const fileSystemHandler: IFileSystemHandler = new FileSystemHandler();

    const authenticationService: IAuthenticationService = new AuthenticationService({
        issuer,
        //generators,
        parse,
        createServer,
        vscode
    }, fileSystemHandler);

    const scriptService: IScriptService = new ScriptService();
    const treeViewDataProvider = new TreeViewDataProvider(scriptService);
    const vfsProvider = new VirtualFileSystemProvider();

    return { authenticationService, fileSystemHandler, scriptService, treeViewDataProvider, vfsProvider };
}