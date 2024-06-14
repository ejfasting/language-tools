import * as vscode from 'vscode';
import { SuoFile } from '../types';
import { CONFIG } from '../config';

export interface IFileSystemHandler {
    /**
     * Creates a folder at the specified path, in the local workspace.
     * @param relativePath The relative path to the desired file within the workspace.
     * @returns The content of the file as a Uint8Array.
     * @throws {Error} If the file cannot be written to.
     * @returns A promise that resolves when the folder has been created.
     */
    writeFileAsync(relativePath: string, content: string): Promise<vscode.Uri>;

    /**
     * Creates a folder at the specified path, in the local workspace.
     * @param folderPath The path to the folder to create.
     * @throws {Error} If the folder cannot be created.
     * @returns A promise that resolves when the folder has been created.
     */
    createFolderAsync(folderPath: vscode.Uri): Promise<void>;

    /**
     * Reads the .suo-file from the local workspace.
     * @returns The content of the file as a Uint8Array.
     * @throws {Error} If the file cannot be read.
     */
    readSuoFileAsync(): Promise<SuoFile>;

    /**
     * Writes the .suo-file to the local workspace.
     * @param content The content to write to the file.
     * @returns A promise that resolves when the file has been written. 
     * @throws {Error} If the file cannot be written to.
     */
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

    /**
     * Reads a file from the local workspace.
     * @param relativePath The relative path to the desired file within the workspace.
     * @returns The content of the file as a Uint8Array.
     * @throws {Error} If the file cannot be read.
     */
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

    /**
     * Writes content to a file at the specified path.
     * @param relativePath The relative path to the desired file within the workspace.
     * @param content The content to write to the file.
     * @returns The URI of the written file.
     * @throws {Error} If the file cannot be written to.
     */
    public async writeFileAsync(relativePath: string, content: string): Promise<vscode.Uri> {
        const fileUri = this.getFileUriInWorkspace(relativePath);
        const dirUri = fileUri.with({ path: fileUri.path.replace(/\/[^/]+$/, '') });

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

    /**
     * Creates a folder at the specified path.
     * @param folderPath The path to the folder to create.
     * @throws {Error} If the folder cannot be created.
     */
    public async createFolderAsync(folderPath: vscode.Uri): Promise<void> {
        try {
            await vscode.workspace.fs.createDirectory(folderPath);
        } catch (error) {
            throw new Error(`Error creating folder ${folderPath}: ${error}`);
        }
    }

    /**
     * Ensures that the directory exists.
     * @param folderPath The path to the folder.
     * @throws {Error} If an error occurs while ensuring the directory exists.
     */
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

    /**
     * Reads the .suo file from the local workspace.
     * @returns The content of the .suo file.
     * @throws {Error} If the file cannot be read or parsed.
     */
    public async readSuoFileAsync(): Promise<SuoFile> {
        try {
            const suoFileContent = await this.readFileAsync(CONFIG.SUOFILE_PATH);
            const suoFile = JSON.parse(suoFileContent.toString());
            this.validateSuoFile(suoFile);

            return suoFile as SuoFile;
        } catch (error) {
            throw new Error(`Error reading or parsing suoFile ${CONFIG.SUOFILE_PATH}: ${error}`);
        }
    }

    /**
     * Writes content to the .suo file.
     * @param content The content to write to the file.
     * @returns The URI of the written file.
     * @throws {Error} If the file cannot be written to.
     */
    public async writeSuoFileAsync(content: string): Promise<vscode.Uri> {
        return await this.writeFileAsync(CONFIG.SUOFILE_PATH, content);
    }

    /**
     * Validates the .suo file content.
     * @param suoFile The content of the .suo file.
     * @throws {Error} If the .suo file content is invalid.
     */
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
