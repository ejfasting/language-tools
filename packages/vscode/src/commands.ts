import * as vscode from 'vscode';
import { ScriptInfo } from './types';
import { downloadScriptAsync, downloadScriptFolderAsync, executeScriptAsync, getScriptEntityAsync } from './services/scriptService';
import { Node } from './providers/treeViewDataProvider';
import { vfsProvider } from './extension';
import { CONFIG_COMMANDS } from './config';
//import { executeScriptLocallyAsync } from './services/nodeService';

const openedScripts: Map<string, vscode.TextDocument> = new Map();

export async function registerCommands(context: vscode.ExtensionContext) {

    const signInCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_SIGN_IN, async () => {
        const session = await vscode.authentication.getSession("superoffice", [], { createIfNone: true });
        console.log(JSON.stringify(session));
    });

    // Register Command to Show Script Info
    const showScriptInfoCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_SHOW_SCRIPT_INFO, async (script: ScriptInfo) => {
        const doc = openedScripts.get(script.PrimaryKey);
        doc ? vscode.window.showTextDocument(doc) : (async () => {
            const jsonString = JSON.stringify(script, null, 2);  // Pretty print JSON
            const document = await vscode.workspace.openTextDocument({ content: jsonString, language: 'json' });
            vscode.window.showTextDocument(document);
            openedScripts.set(script.PrimaryKey, document);
        })();
    });

    // Register Command to Preview Script. This version uses the Virtual File System Provider
    const previewScriptCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_PREVIEW_SCRIPT, async (node: Node) => {
        if (node?.scriptInfo) {
            const scriptInfo: ScriptInfo = node.scriptInfo;
            try {
                const scriptEntity = await getScriptEntityAsync(scriptInfo.uniqueIdentifier);

                // Create a virtual URI for the file based on the desired filename
                const filename = `${scriptInfo.name}.jsfso`;
                const virtualUri = vscode.Uri.parse(`${CONFIG_COMMANDS.VFS_SCHEME}:/scripts/${filename}`);

                // "Write" the content to the virtual file
                vfsProvider.writeFile(virtualUri, Buffer.from(scriptEntity.Source, 'utf8'), { create: true, overwrite: true });

                // Open the virtual file in VSCode
                const document = await vscode.workspace.openTextDocument(virtualUri);
                vscode.window.showTextDocument(document);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to preview script: ${err}`);
            }
        }
    });

    // Register command to download the script and store it into workspace
    const downloadScriptCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_DOWNLOAD_SCRIPT, async (node: Node) => {
        if (node?.scriptInfo) {
            const scriptInfo: ScriptInfo = node.scriptInfo;
            if (vscode.workspace.workspaceFolders !== undefined) {
                try {
                    const fullPath = await downloadScriptAsync(scriptInfo.uniqueIdentifier);
                    const document = await vscode.workspace.openTextDocument(fullPath);
                    vscode.window.showTextDocument(document);
                } catch (err) {
                    throw new Error(`Failed to download script: ${err}`);
                }
            }
            else {
                vscode.window.showErrorMessage("superoffice-vscode: Working folder not found, open a folder an try again");
            }
        }
    });

    // Register command to download the script and store it into workspace
    const downloadScriptFolderCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_DOWNLOAD_SCRIPTFOLDER, async (node: Node) => {
        try {
            await downloadScriptFolderAsync(node);
        }
        catch (err) {
            throw new Error(`Failed to download scriptFolder: ${err}`);
        }
    });

    const executeScriptCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_EXECUTE_SCRIPT, async (fileUri: vscode.Uri) => {
        if (fileUri && fileUri.fsPath) {
            try {
                const fileContent = await vscode.workspace.fs.readFile(fileUri);
                const decodedContent = new TextDecoder().decode(fileContent);

                // Send the script content to the server for execution
                const result = await executeScriptAsync(decodedContent);
                vscode.window.showInformationMessage(result.Output);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to execute script: ${err}`);
                //throw new Error(`Failed to download script: ${err}`);
            }
        } else {
            vscode.window.showInformationMessage('No file selected!');
        }
    });

    // const executeScriptLocallyCommand = vscode.commands.registerCommand(CONFIG_COMMANDS.CMD_EXECUTE_SCRIPT_LOCALLY, async (fileUri: vscode.Uri) => {
    //     if (fileUri && fileUri.fsPath) {
    //         try {
    //             const fileContent = await vscode.workspace.fs.readFile(fileUri);
    //             const decodedContent = new TextDecoder().decode(fileContent);

    //             // Send the script content to the server for execution
    //             const result = await executeScriptLocallyAsync(decodedContent);
    //             vscode.window.showInformationMessage(JSON.stringify(result));
    //         } catch (err) {
    //             vscode.window.showErrorMessage(`Failed to execute script: ${err}`);
    //             //throw new Error(`Failed to download script: ${err}`);
    //         }
    //     } else {
    //         vscode.window.showInformationMessage('No file selected!');
    //     }
    // });

    context.subscriptions.push(signInCommand, showScriptInfoCommand, previewScriptCommand, downloadScriptCommand, downloadScriptFolderCommand, executeScriptCommand);
}