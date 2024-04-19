// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { getTsdk } from '@volar/vscode';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';

let client: lsp.BaseLanguageClient;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext): Promise<void> {

	const serverModule = vscode.Uri.joinPath(context.extensionUri, 'dist', 'server.js');
	const runOptions = { execArgv: <string[]>[] };
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };
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
		documentSelector: [{ language: 'crmscript' }],
		initializationOptions: {
			typescript: {
				tsdk: (await getTsdk(context)).tsdk,
			},
		},
	};
	client = new lsp.LanguageClient(
		'crmscript-language-server',
		'crmscript Language Server',
		serverOptions,
		clientOptions,
	);
	await client.start();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "superoffice-vscode-core" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('superoffice-vscode-core.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from superoffice-vscode-core in a web extension host!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate(): void {}
