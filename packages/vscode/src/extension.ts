// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as serverProtocol from '@volar/language-server/protocol';
import { LabsInfo, createLabsInfo, getTsdk } from '@volar/vscode';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';
import { TreeViewDataProvider } from './providers/treeViewDataProvider';
import { VirtualFileSystemProvider } from './workspace/virtualWorkspaceFileManager';
import { CONFIG_COMMANDS } from './config';
import { SuperofficeAuthenticationProvider } from './providers/authenticationProvider';
import { registerCommands } from './commands';
import { DslLibraryFileSystemProvider } from './providers/dslLibraryFileSystemProvider';

let client: lsp.BaseLanguageClient;

export const treeViewDataProvider = new TreeViewDataProvider();
export const vfsProvider = new VirtualFileSystemProvider();
export let logoUri: vscode.Uri;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<LabsInfo> {
	logoUri = vscode.Uri.joinPath(context.extensionUri, 'resources', 'logo.svg');

	const serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist', 'server.js');
	const runOptions = { execArgv: <string[]>[] };
	
	const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };
	//const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };
	const serverOptions: lsp.ServerOptions = {
		run: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: runOptions
		},
		debug: {
			module: serverModule.fsPath,
			transport: lsp.TransportKind.ipc,
			options: debugOptions
		},
	};
	const clientOptions: lsp.LanguageClientOptions = {
		documentSelector: [
			{ language: 'jsfso' },
			{ language: 'crmscript'}			
		],
		initializationOptions: {
			typescript: {
				tsdk: (await getTsdk(context)).tsdk,
			}
		},
	};
	client = new lsp.LanguageClient(
		'superoffice',
		'SuperOffice Language Server',
		serverOptions,
		clientOptions,
	);
	await client.start();

	// Register Virtual File System Provider
    vscode.workspace.registerFileSystemProvider(CONFIG_COMMANDS.VFS_SCHEME, vfsProvider, { isCaseSensitive: true });
    // Register Tree View Data Provider
    vscode.window.registerTreeDataProvider(TreeViewDataProvider.viewId, treeViewDataProvider);

	// Register Authentication Provider
    context.subscriptions.push(
		new SuperofficeAuthenticationProvider(context)
	);

	//Register Commands
    await registerCommands(context);
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "SuperOffice-vscode" is now active!');
	
	DslLibraryFileSystemProvider.register(context);
	//TODO: Volar labs needs to be active in the debug-window for the extension, so you can run it with --disable-extensions if you want the proper intellisense.. 
	const labsInfo = createLabsInfo(serverProtocol);
	labsInfo.addLanguageClient(client);
	return labsInfo.extensionExports;
}

// This method is called when your extension is deactivated
export function deactivate(): void {}
