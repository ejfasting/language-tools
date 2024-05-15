/* eslint-disable @typescript-eslint/naming-convention */
export const ENVIRONMENTS = ['sod', 'online'];

export const CONFIG_SCRIPTSERVICE = {
    SCRIPT_ENDPOINT_URI: '/v1/Script/',
    MIME_TYPE_JSON: 'application/json',
    EXECUTESCRIPT_ENDPOINT_URI: '/v1/Agents/CRMScript/ExecuteScriptByString'
};

export const CONFIG_COMMANDS = {
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

export const CONFIG_AUTHSERVICE = {
    REDIRECT_URI: 'http://127.0.0.1:8000',
    CLIENT_ID: '1a5764a8090f136cc9d30f381626d5fa'
};

export const CONFIG_SYSTEMSERVICE = {
    STATE_URI_TEMPLATE: (environment: string, contextIdentifier: string): string => 
        `https://${environment}.superoffice.com/api/state/${contextIdentifier}`
};

export const CONFIG_FILESYSTEMHANDLER = {
    SUOFILE_PATH: `./.superoffice/.suo`,
};
