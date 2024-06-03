import * as vscode from 'vscode';
import { SuoFile } from '../types';
import { CONFIG } from '../config';
//TODO: Move this to a service instead?
export interface IFileSystemHandler {
    writeFileAsync(relativePath: string, content: string): Promise<vscode.Uri>;
    createFolderAsync(folderPath: vscode.Uri): Promise<void>;
    readSuoFileAsync(): Promise<SuoFile>;
    writeSuoFileAsync(content: string): Promise<vscode.Uri>;
}

export class FileSystemHandler implements IFileSystemHandler {
    constructor() { }

    /**
     * Get the full URI for a file located within the current workspace.
     * 
     * @param relativePath The relative path to the desired file within the workspace.
     * @returns The full URI pointing to the file in the current workspace.
     * @throws {Error} If there's no workspace currently opened in VSCode.
     */
    private getFileUriInWorkspace(relativePath: string): vscode.Uri {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

        if (!workspaceFolder) {
            throw new Error("No workspace is currently open.");
        }

        return vscode.Uri.joinPath(workspaceFolder.uri, relativePath);
    }

    public async readFileAsync(relativePath: string): Promise<Uint8Array> {
        try {
            const data = await vscode.workspace.fs.readFile(this.getFileUriInWorkspace(relativePath));
            return data;
        } catch (error) {
            if (error instanceof vscode.FileSystemError) {
                throw new Error(`Failed to read file: ${relativePath}. Reason: ${error.message}`);
            }
            throw new Error(`An unexpected error occurred while reading file: ${relativePath}`);
        }
    }

    // Write file to relativePath
    public async writeFileAsync(relativePath: string, content: string): Promise<vscode.Uri> {
        const fileUri = this.getFileUriInWorkspace(relativePath);
        const dirUri = fileUri.with({ path: fileUri.path.replace(/\/[^/]+$/, '') }); // remove the last segment of the path to get the directory

        // Ensure directory structure exists
        await this.ensureDirectoryExistsAsync(dirUri);

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

    public async createFolderAsync(folderPath: vscode.Uri): Promise<void> {
        try {
            await vscode.workspace.fs.createDirectory(folderPath);
        } catch (error) {
            throw new Error(`Error creating folder ${folderPath}: ${error}`);
        }
    }

    private async ensureDirectoryExistsAsync(folderPath: vscode.Uri): Promise<void> {
        try {
            await vscode.workspace.fs.stat(folderPath);
        } catch (error) {
            if (error instanceof vscode.FileSystemError && error.code === 'FileNotFound') {
                const parentUri = vscode.Uri.joinPath(folderPath, '..');
                await this.ensureDirectoryExistsAsync(parentUri);
                await vscode.workspace.fs.createDirectory(folderPath);
            } else {
                throw error;
            }
        }
    }

    public async readSuoFileAsync(): Promise<SuoFile> {
        try {
            const suoFileContent = await this.readFileAsync(CONFIG.SUOFILE_PATH);
            const suoFile = JSON.parse(suoFileContent.toString());
             // Validate manually
             this.validateSuoFile(suoFile);

            return JSON.parse(suoFileContent.toString()) as SuoFile;
        } catch (error) {
            throw new Error(`Error reading or parsing suoFile ${CONFIG.SUOFILE_PATH}: ${error}`);
        }
    }

    public async writeSuoFileAsync(content: string): Promise<vscode.Uri> {
        return await this.writeFileAsync(CONFIG.SUOFILE_PATH, content);
    }

    private validateSuoFile(suoFile: SuoFile): void {
        if (typeof suoFile.clientId !== 'string') {
            throw new Error("Invalid suoFile: 'clientId' is required and must be a string.");
        }
        if (typeof suoFile.contextIdentifier !== 'string') {
            throw new Error("Invalid suoFile: 'contextIdentifier' is required and must be a string.");
        }
        if (typeof suoFile.environment !== 'string') {
            throw new Error("Invalid suoFile: 'environment' is required and must be a string.");
        }
    }
}