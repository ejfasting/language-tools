/* eslint-disable @typescript-eslint/naming-convention */
export const ENVIRONMENTS = ['sod', 'online'];

export const CONFIG_SCRIPTSERVICE = {
    SCRIPT_ENDPOINT_URI: '/v1/Script/',
    MIME_TYPE_JSON: 'application/json',
    EXECUTESCRIPT_ENDPOINT_URI: '/v1/Agents/CRMScript/ExecuteScriptByString'
};

export const CONFIG_COMMANDS = {
    CMD_SIGN_IN: 'signIn',
    CMD_SIGN_OUT: 'signOut',
    CMD_SHOW_SCRIPT_INFO: 'vscode-superoffice.showScriptInfo',
    CMD_PREVIEW_SCRIPT: 'previewScript',
    CMD_DOWNLOAD_SCRIPT: 'downloadScript',
    CMD_DOWNLOAD_SCRIPTFOLDER: 'downloadScriptFolder',
    CMD_EXECUTE_SCRIPT: 'executeScript',
    VFS_SCHEME: 'vfs',
    CMD_EXECUTE_SCRIPT_LOCALLY: 'executeScriptLocally'
};

export const CONFIG_AUTHSERVICE = {
    REDIRECT_URI: 'http://127.0.0.1:8000',
};

export const CONFIG_SYSTEMSERVICE = {
    STATE_URI_TEMPLATE: (environment: string, contextIdentifier: string): string => 
        `https://${environment}.superoffice.com/api/state/${contextIdentifier}`
};

export const CONFIG = {
    SUOFILE_PATH: `./.superoffice/.suo`,
};
