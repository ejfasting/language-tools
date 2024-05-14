// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as serverProtocol from '@volar/language-server/protocol';
import { LabsInfo, createLabsInfo, getTsdk } from '@volar/vscode';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';

let client: lsp.BaseLanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<LabsInfo> {

	const serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist', 'server.js');
	const runOptions = { execArgv: <string[]>[] };
	
	//const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };
	// The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };
	
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
		'suoLanguageServer',
		'SuperOffice Language Server',
		serverOptions,
		clientOptions,
	);
	await client.start();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "SuperOffice-vscode" is now active!');

	//TODO: Volar labs needs to be active in the debug-window for the extension, so you can run it with --disable-extensions if you want the proper intellisense.. 
	const labsInfo = createLabsInfo(serverProtocol);
	labsInfo.addLanguageClient(client);
	return labsInfo.extensionExports;
}

// This method is called when your extension is deactivated
export function deactivate(): void {}
