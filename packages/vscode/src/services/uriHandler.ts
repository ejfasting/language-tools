import * as vscode from 'vscode';
// Our implementation of a UriHandler.
export class SuperOfficeUriHandler implements vscode.UriHandler {
    private _emitter = new vscode.EventEmitter<vscode.Uri>();
    public readonly onDidReceiveUri: vscode.Event<vscode.Uri> = this._emitter.event;
    async handleUri(uri: vscode.Uri): Promise<void> {
        this._emitter.fire(uri);
    }
}

// Instantiate and export the handler
export const superOfficeUriHandler = new SuperOfficeUriHandler();