/* eslint-disable @typescript-eslint/naming-convention */
export const ENVIRONMENTS = ['sod', 'online'];

type ScriptService = {
    SCRIPT_ENDPOINT_URI: string;
    MIME_TYPE_JSON: string;
    EXECUTESCRIPT_ENDPOINT_URI: string;
};

export const CONFIG_SCRIPTSERVICE: ScriptService = {
    SCRIPT_ENDPOINT_URI: '/v1/Script/',
    MIME_TYPE_JSON: 'application/json',
    EXECUTESCRIPT_ENDPOINT_URI: '/v1/Agents/CRMScript/ExecuteScriptByString'
};

type Commands = {
    CMD_SIGN_IN: string;
    CMD_SIGN_OUT: string;
    CMD_SHOW_SCRIPT_INFO: string;
    CMD_PREVIEW_SCRIPT: string;
    CMD_DOWNLOAD_SCRIPT: string;
    CMD_DOWNLOAD_SCRIPTFOLDER: string;
    CMD_EXECUTE_SCRIPT: string;
    VFS_SCHEME: string;
    CMD_EXECUTE_SCRIPT_LOCALLY: string;
};

export const CONFIG_COMMANDS: Commands = {
    CMD_SIGN_IN: '@superoffice/vscode.signIn',
    CMD_SIGN_OUT: '@superoffice/vscode.signOut',
    CMD_SHOW_SCRIPT_INFO: '@superoffice/vscode.showScriptInfo',
    CMD_PREVIEW_SCRIPT: '@superoffice/vscode.previewScript',
    CMD_DOWNLOAD_SCRIPT: '@superoffice/vscode.downloadScript',
    CMD_DOWNLOAD_SCRIPTFOLDER: '@superoffice/vscode.downloadScriptFolder',
    CMD_EXECUTE_SCRIPT: '@superoffice/vscode.executeScript',
    VFS_SCHEME: 'vfs',
    CMD_EXECUTE_SCRIPT_LOCALLY: '@superoffice/vscode.executeScriptLocally'
};

type AuthService = {
    REDIRECT_URI: string;
    CLIENT_ID: string;
};

export const CONFIG_AUTHSERVICE: AuthService = {
    REDIRECT_URI: 'http://127.0.0.1:8000',
    CLIENT_ID: '1a5764a8090f136cc9d30f381626d5fa'
};

type SystemService = {
    STATE_URI_TEMPLATE: (environment: string, contextIdentifier: string) => string;
};

export const CONFIG_SYSTEMSERVICE: SystemService = {
    STATE_URI_TEMPLATE: (environment, contextIdentifier) => 
        `https://${environment}.superoffice.com/api/state/${contextIdentifier}`
};

type FileSystemhandler = {
    SUOFILE_PATH: string,
};

export const CONFIG_FILESYSTEMHANDLER: FileSystemhandler = {
    SUOFILE_PATH: `./.superoffice/.suo`,
};
