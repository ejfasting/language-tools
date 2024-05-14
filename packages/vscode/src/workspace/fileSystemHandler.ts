import * as vscode from 'vscode';
import { SuoFile } from '../types';
import { CONFIG_FILESYSTEMHANDLER } from '../config';

export function joinPaths(part1: string, part2: string): string {
    return `${part1.replace(/\/$/, '')}/${part2.replace(/^\//, '')}`;
}

/**
 * Get the full URI for a file located within the current workspace.
 * 
 * @param relativePath The relative path to the desired file within the workspace.
 * @returns The full URI pointing to the file in the current workspace.
 * @throws {Error} If there's no workspace currently opened in VSCode.
 */
export function getFileUriInWorkspace(relativePath: string): vscode.Uri {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        throw new Error("No workspace is currently open.");
    }

    return vscode.Uri.joinPath(workspaceFolder.uri, relativePath);
}

// Ensure directory exists
async function ensureDirectoryExists(uri: vscode.Uri): Promise<void> {
    try {
        await vscode.workspace.fs.stat(uri);
    } catch (error) {
        if (error instanceof vscode.FileSystemError && error.code === 'FileNotFound') {
            const parentUri = vscode.Uri.joinPath(uri, '..');
            await ensureDirectoryExists(parentUri);
            await vscode.workspace.fs.createDirectory(uri);
        } else {
            throw error;
        }
    }
}

// Read file from relativePath
export async function readFile(relativePath: string): Promise<string> {
    try {
        const data = await vscode.workspace.fs.readFile(getFileUriInWorkspace(relativePath));
        return data.toString();
    } catch (error) {
        if (error instanceof vscode.FileSystemError) {
            throw new Error(`Failed to read file: ${relativePath}. Reason: ${error.message}`);
        }
        throw new Error(`An unexpected error occurred while reading file: ${relativePath}`);
    }
}

// Write file to relativePath
export async function writeFile(relativePath: string, content: string): Promise<vscode.Uri> {
    const fileUri = getFileUriInWorkspace(relativePath);
    const dirUri = fileUri.with({ path: fileUri.path.replace(/\/[^/]+$/, '') }); // remove the last segment of the path to get the directory

    // Ensure directory structure exists
    await ensureDirectoryExists(dirUri);

    try {
        const data = Buffer.from(content);
        await vscode.workspace.fs.writeFile(fileUri, data);
        return fileUri;
    } catch (error) {
        if (error instanceof vscode.FileSystemError) {
            throw new Error(`Failed to write to file: ${relativePath}. Reason: ${error.message}`);
        }
        throw new Error(`An unexpected error occurred while writing to file: ${relativePath}`);
    }
}

export async function getSuoFile() : Promise<SuoFile> {
    try {
        const suoFile = await readFile(CONFIG_FILESYSTEMHANDLER.SUOFILE_PATH);
        return JSON.parse(suoFile);
    }
    catch(error){
        throw new Error('No suo file found: ' + error);
    }
}

export async function writeSuoFile(content: string) : Promise<vscode.Uri> {
    return await writeFile(CONFIG_FILESYSTEMHANDLER.SUOFILE_PATH, content);
}