import * as vscode from 'vscode';
import { ScriptInfo } from '../types';
import { IScriptService } from '../services/scriptService';
import { currentSession } from './authenticationProvider';
import { logoUri } from '../extension';
import { CONFIG_COMMANDS } from '../config';

///const logoUri = vscode.Uri.joinPath(vscode.extensions.getExtension('superoffice.@superoffice/vscode')!.extensionUri, 'resources', 'logo.svg');
const iconPath = {
    light: logoUri,
    dark: logoUri
};
interface TreeDataItem {
    label: string;
    children: TreeDataItem[];
    scriptInfo?: ScriptInfo;
}

export class Node implements vscode.TreeItem {
    contextValue: string;
    collapsibleState: vscode.TreeItemCollapsibleState;
    constructor(
        public readonly label: string,
        public readonly children?: Node[],
        public readonly iconPath?: vscode.ThemeIcon | { light: vscode.Uri; dark: vscode.Uri },
        public readonly command?: vscode.Command,
        public readonly scriptInfo?: ScriptInfo,
    ) {
        this.contextValue = scriptInfo ? 'script' : 'folder';
        this.collapsibleState = (this.children?.length ?? 0) > 0 
        ? vscode.TreeItemCollapsibleState.Collapsed 
        : vscode.TreeItemCollapsibleState.None;
    }
}

function convertTreeDataToNode(data: TreeDataItem): Node {
    return new Node(
        data.label, 
        data.children.map(convertTreeDataToNode), 
        data.scriptInfo ? new vscode.ThemeIcon('code') : new vscode.ThemeIcon('folder'), 
        data.scriptInfo ? { command: CONFIG_COMMANDS.CMD_SHOW_SCRIPT_INFO, title: 'Show Script Info', arguments: [data.scriptInfo] } : undefined,
        data.scriptInfo
        );
}

function getOrAddChildNode(parentNode: TreeDataItem, part: string): TreeDataItem {
    let childNode = parentNode.children.find(node => node.label === part);
    if (!childNode) {
        childNode = { label: part, children: [] };
        parentNode.children.push(childNode);
    }
    return childNode;
}

/**
 * Processes a given script along with its path.
 * The function parses the path, constructs the folder hierarchy 
 * if it doesn't exist, and then adds the script at the appropriate 
 * node in the tree.
 *
 * @param root - The root node of the tree.
 * @param scriptPath - The path associated with the script.
 * @param script - The script data.
 */
function addToTreeData(root: TreeDataItem, scriptPath: string, scriptInfo: ScriptInfo) {
    // Split path by '/' and remove empty segments
    const parts = scriptPath.split('/').filter(Boolean);
    const currentNode = parts.reduce(getOrAddChildNode, root);
    currentNode.children.push({ label: scriptInfo.name, children: [], scriptInfo });
}

export class TreeViewDataProvider implements vscode.TreeDataProvider<Node> {
    private _onDidChangeTreeData: vscode.EventEmitter<Node | undefined> = new vscode.EventEmitter<Node | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Node | undefined> = this._onDidChangeTreeData.event;
    scriptService: IScriptService;

    constructor(scriptService: IScriptService){
        this.scriptService =  scriptService;
    }

    public static readonly viewId = 'superoffice.views.treeview';

    // Call this method to trigger a refresh of the tree view
    public refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: Node): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: Node): Promise<Node[]> {
        if (element) {
            return element.children || [];
        }
    
        //Check if user is logged in
        if (currentSession) {
            try {
                const scriptResponseData = await this.scriptService.getAllScriptInfoAsync();
                const root: TreeDataItem = { label: 'Root', children: [] };
                scriptResponseData.value.forEach(script => addToTreeData(root, script.path, script));
                console.log("something: " + iconPath);
                return root.children.map(convertTreeDataToNode);
            } catch (err) {
                if (err instanceof Error) {
                    throw new Error(err.message);
                } else {
                    throw new Error(String(err));
                }
            }
        }
        return [];
    }
}