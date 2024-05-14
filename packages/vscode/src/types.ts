/* eslint-disable @typescript-eslint/naming-convention */

import { IdTokenClaims } from "openid-client";
import { AuthenticationSession } from "vscode";

export interface HttpRequestResponse<T = any> {
    status: number;
    body: T;
    ok: boolean;
    statusText: string;
}

interface ResponseOdataMetadata {
    "odata.metadata": string;
    "odata.nextLink": null | string;  // Assuming the value can sometimes be a string
}

export interface ScriptInfoArray extends ResponseOdataMetadata {
    value: ScriptInfo[];
}

export interface ScriptInfo {
    PrimaryKey: string;
    EntityName: string;
    hierarchyId: number;
    hierarchyFullname: string;
    hierarchyName: string;
    hierarchyParentId: number;
    hierarchyFullpathIds: number[];
    ejscriptId: number;
    name: string;
    description: string;
    includeId: string;
    accessKey: string;
    htmlOutput: boolean;
    extraMenuId: number;
    uniqueIdentifier: string;
    registeredBy: string;
    registeredDate: Date;  // You might want to consider using Date if you're going to parse and use this as a date
    path: string;
    updatedBy: string;
    updatedDate: Date; // Similarly, consider using Date here as well
    screenChooserId: number;
    screenType: string;
    enabled: boolean;
}
export interface ScriptEntity {
    UniqueIdentifier: string;
    Name: string;
    Description: string;
    IncludeId: string;
    Source: string;
    Registered: Date;
    RegisteredBy: string;
    Updated: Date;
    UpdatedBy: string;
    Path: string;
    TableRight: null;
    FieldProperties: Record<string, unknown>;
}
export interface ExecuteScriptResponse {
    Output: string;
    Parameters: {
        Parameters1: string;
        Parameters2: string;
    };
    Trace: string;
    Eventdata: null; // If Eventdata can be of other types, replace 'null' with the appropriate type or types
    Success: boolean;
    ErrorInformation: null | string; // I'm assuming ErrorInformation can be a string, adjust as needed
    TableRight: null | string; // Adjust type based on the possible values of 'TableRight'
    FieldProperties: {
        [key: string]: {
            FieldRight: null | string; // Adjust type based on the possible values of 'FieldRight'
            FieldType: string;
            FieldLength: number;
        }
    };
}
export interface StateResponse {
    ContextIdentifier: string;
    Endpoint: string;
    State: string;
    IsRunning: boolean;
    ValidUntil: Date;
    Api: string;
}
export interface UserClaims extends IdTokenClaims {
    "http://schemes.superoffice.net/identity/ctx": string;
    "http://schemes.superoffice.net/identity/netserver_url": string;
    "http://schemes.superoffice.net/identity/webapi_url": string;
}

export interface SuperOfficeAuthenticationSession extends AuthenticationSession {
    contextIdentifier: string;
    refreshToken?: string;
    webApiUri: string;
    claims: UserClaims;
    expiresAt?: number;
}

export type SuoFile = {
    contextIdentifier: string;
};

export type NodeRequest = {
    scriptbody: string;
    parameters: string;
    eventData: string;
};