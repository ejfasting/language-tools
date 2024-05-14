import { httpAuthenticatedRequestAsync } from "./httpService";
import { ExecuteScriptResponse, ScriptEntity, ScriptInfoArray } from "../types";
import { CONFIG_SCRIPTSERVICE } from '../config';
import * as https from 'https';
import { joinPaths, writeFile } from "../workspace/fileSystemHandler";
import { Uri } from "vscode";
import { Node } from "../providers/treeViewDataProvider";

// Helper function for error checking and response extraction
const fetchAndCheckAsync = async <T>(endpoint: string, method: https.RequestOptions["method"], errorMessagePrefix: string, body?: object): Promise<T> => {
    const response = await httpAuthenticatedRequestAsync<T>(endpoint, method, body);
    if (!response.ok) {
        throw new Error(`${errorMessagePrefix}: ${response.statusText}`);
    }
    return response.body;
};

export const getAllScriptInfoAsync = async (): Promise<ScriptInfoArray> => {
    return fetchAndCheckAsync<ScriptInfoArray>(CONFIG_SCRIPTSERVICE.SCRIPT_ENDPOINT_URI, 'GET', 'Failed to get script info');
};

export const getScriptEntityAsync = async (uniqueIdentifier: string): Promise<ScriptEntity> => {
    return fetchAndCheckAsync<ScriptEntity>(`${CONFIG_SCRIPTSERVICE.SCRIPT_ENDPOINT_URI}${uniqueIdentifier}`, 'GET', 'Failed to get script entity');
};

export const executeScriptAsync = async (script: string): Promise<ExecuteScriptResponse> => {
    const payload = {
        script: script,
        parameters: {
            "parameters1": "mandatory"
        }
    };
    return fetchAndCheckAsync<ExecuteScriptResponse>(CONFIG_SCRIPTSERVICE.EXECUTESCRIPT_ENDPOINT_URI, 'POST', 'Failed to execute script', payload);
};

export const executeScriptLocallyAsync = async (script: string): Promise<string> => {
    const payload = {
        scriptbody: script,
        parameters: "",
        eventData: ""
    };
    return fetchAndCheckAsync<any>(CONFIG_SCRIPTSERVICE.EXECUTESCRIPT_ENDPOINT_URI, 'POST', 'Failed to execute script', payload);
};


export const downloadScriptAsync = async (uniqueIdentifier: string): Promise<Uri> => {
    const scriptEntity = await getScriptEntityAsync(uniqueIdentifier);
    const filePath = joinPaths(scriptEntity.Path, scriptEntity.Name + ".jsfso");
    return await writeFile(filePath, scriptEntity.Source);
};

export const downloadScriptFolderAsync = async (folder: Node): Promise<void> => {
    try{
        folder.children?.forEach(async (childNode) => {
            if(childNode.contextValue === 'folder') {
                await downloadScriptFolderAsync(childNode);
            }
            else if(childNode.contextValue === 'script') {
                if(childNode.scriptInfo === undefined) {
                    console.log(`superoffice-vscode: Could not find scriptInfo for ${childNode.label}`);
                    return;
                }
                await downloadScriptAsync(childNode.scriptInfo.uniqueIdentifier);
                console.log(`superoffice-vscode: Downloaded script: ${childNode.scriptInfo.name}`);
            }
        });
    }
    catch (err) {
        throw new Error(`Failed to download scriptFolder: ${err}`);
    }
};