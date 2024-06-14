import { ClientMetadata, Issuer, TokenSet, generators } from "openid-client";
import { createServer, Server } from 'http';
import { parse } from 'url';
import * as vscode from 'vscode';
import { CONFIG_AUTHSERVICE } from "../config";
import { IFileSystemHandler } from "../handlers/fileSystemHandler";


// Configuration variables
const redirectUri = process.env.REDIRECT_URI || CONFIG_AUTHSERVICE.REDIRECT_URI;
const parsedUri = new URL(redirectUri);
let server: Server | null = null;
let codeVerifier: string;

interface AuthServiceDependencies {
    issuer: typeof Issuer;
    //generators: typeof generators;
    parse: typeof parse;
    createServer: typeof createServer;
    vscode: typeof vscode;
}

export interface IAuthenticationService  {
    initializeAsync(): Promise<void>;
    authenticateAsync(): Promise<TokenSet>;
    getEnvironment(): string;
    getClientId(): string
}

export class AuthenticationService implements IAuthenticationService  {
    environment!: string;
    clientId!: string;
    private clientMetadata!: ClientMetadata; // Use definite assignment assertion
    private dependencies: AuthServiceDependencies;
    private fileSystemHandler: IFileSystemHandler;

    constructor(dependencies: AuthServiceDependencies, fileSystemHandler: IFileSystemHandler) {
        this.dependencies = dependencies;
        this.fileSystemHandler = fileSystemHandler;
    }

    public async initializeAsync(): Promise<void> {
        try {
            const suoFile = await this.fileSystemHandler.readSuoFileAsync();
            this.clientMetadata = {
                client_id: suoFile.clientId,
                redirect_uri: CONFIG_AUTHSERVICE.REDIRECT_URI,
                response_types: ['code'],
                token_endpoint_auth_method: 'none'
            };
            this.clientId = suoFile.clientId;
            this.environment = suoFile.environment;
        } catch (error) {
            throw new Error(`Error initializing AuthenticationService: ${error}`);
        }
    }

    public async authenticateAsync(): Promise<TokenSet> {
        try {
            const url = await this.generateAuthorizeUrlAsync();
            await this.dependencies.vscode.env.openExternal(this.dependencies.vscode.Uri.parse(url));
            const temp = await this.startServerAsync();
            console.log('temp', temp.id_token);
            return temp;
        } catch (error) {
            this.handleAuthorizeRequestError(error);
            throw error;
        }
    }

    private async generateAuthorizeUrlAsync(): Promise<string> {
        //const { Issuer, generators } = this.dependencies;
        const superOfficeIssuer = await Issuer.discover(`https://${this.environment}.superoffice.com/login/.well-known/openid-configuration`);

        const client = new superOfficeIssuer.Client(this.clientMetadata);
        const state = generators.state();

        codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);

        const url = client.authorizationUrl({
            scope: 'openid',
            state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });
        return url;
    }

    private async startServerAsync(): Promise<TokenSet> {
        const { parse, createServer } = this.dependencies;
        return new Promise<TokenSet>((resolve, reject) => {
            if (server) { reject(new Error('Server already started')); }

            server = createServer(async (req, res) => {
                if (!req.url) {
                    reject(new Error('Request URL not provided during authentication callback.'));
                    return res.end('Request URL not provided during authentication callback.');
                }

                // Check for favicon.ico and do nothing.
                if (req.url.includes('/favicon.ico')) {
                    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                    res.end();
                    return;
                }

                const parsedUrl = parse(req.url, true);
                const parsedQuery = parsedUrl.query;

                if (!parsedQuery.code) {
                    reject(new Error('Callback does not contain a code.'));
                    return res.end('Callback does not contain a code.');
                }

                const authorizationCode = Array.isArray(parsedQuery.code) ? parsedQuery.code[0] : parsedQuery.code;
                res.end('Received the callback. You may close this page.');

                server?.close();
                server = null;

                try {
                    const token = await this.exchangeAuthorizationCodeAsync(authorizationCode);
                    resolve(token);
                } catch (error) {
                    reject(error);
                }
                return;
            });

            server.on('error', err => {
                console.error(`Server error: ${err.message}`);
                reject(err);
            });

            // Start server
            server.listen(parseInt(parsedUri.port, 10), parsedUri.hostname, () => {
                // Server is now listening
            });

            // Optionally add a timeout to reject the promise if it takes too long
            setTimeout(() => {
                reject(new Error('Authorization timed out'));
                server?.close();
                server = null;
            }, 60000);  // e.g., 60 seconds
        });
    }
    private async exchangeAuthorizationCodeAsync(authorizationCode: string): Promise<TokenSet> {
        if (!this.clientMetadata) {
            throw new Error("Client metadata not initialized");
        }

        const { issuer } = this.dependencies;
        const superOfficeIssuer = await issuer.discover(`https://${this.environment}.superoffice.com/login/.well-known/openid-configuration`);

        const client = new superOfficeIssuer.Client(this.clientMetadata);
        try {
            return await client.callback(this.clientMetadata.redirect_uri as string, { code: authorizationCode }, { code_verifier: codeVerifier }) as TokenSet;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error("Error obtaining token: " + error.message);
            } else {
                throw new Error("Error obtaining token: " + String(error));
            }
        }
    }

    private handleAuthorizeRequestError(error: unknown): void {
        if (error instanceof Error) {
            this.dependencies.vscode.window.showErrorMessage('Failed to open URL: ' + error.message);
        } else {
            console.error(error);
        }
    }

    public getEnvironment(): string {
        return this.environment;
    }

    public getClientId(): string {
        return this.clientId;
    }
}

/* eslint-enable @typescript-eslint/naming-convention */

// export const authenticate = async (environment: string): Promise<TokenSet> => {
//     try {
//         const suoFile = await readFile(CONFIG_AUTHSERVICE.REDIRECT_URI);
//         if (!suoFile) {
//             throw new Error('No suo file found');
//         }

//         const url = await generateAuthorizeUrl(environment);
//         await vscode.env.openExternal(vscode.Uri.parse(url));
//         return await startServer();
//     } catch (error) {
//         handleAuthorizeRequestError(error);
//         throw error;
//     }
// };

// async function generateAuthorizeUrl(environment: string): Promise<string> {
//     if (!['sod', 'online'].includes(environment)) {
//         throw new Error(`Invalid environment: ${environment}`);
//     }

//     superOfficeIssuer = await Issuer.discover(`https://${environment}.superoffice.com/login/.well-known/openid-configuration`);

//     const client = new superOfficeIssuer.Client(this.clientMetadata);
//     const state = generators.state();

//     codeVerifier = generators.codeVerifier();
//     const codeChallenge = generators.codeChallenge(codeVerifier);

//     /* eslint-disable @typescript-eslint/naming-convention */
//     const url = client.authorizationUrl({
//         scope: 'openid',
//         state,
//         code_challenge: codeChallenge,
//         code_challenge_method: 'S256'
//     });
//     /* eslint-enable @typescript-eslint/naming-convention */
//     return url;
// }

// function startServer(): Promise<TokenSet> {
//     return new Promise<TokenSet>((resolve, reject) => {
//         if (server) { reject(new Error('Server already started')); }

//         server = createServer(async (req, res) => {
//             if (!req.url) {
//                 reject(new Error('Request URL not provided during authentication callback.'));
//                 return res.end('Request URL not provided during authentication callback.');
//             }

//             // Check for favicon.ico and do nothing.
//             if (req.url.includes('/favicon.ico')) {
//                 // eslint-disable-next-line @typescript-eslint/naming-convention
//                 res.writeHead(200, { 'Content-Type': 'image/x-icon' });
//                 res.end();
//                 return;
//             }

//             const parsedUrl = parse(req.url);
//             const parsedQuery = parseQuery(parsedUrl.query || '');

//             if (!parsedQuery.code) {
//                 reject(new Error('Callback does not contain a code.'));
//                 return res.end('Callback does not contain a code.');
//             }

//             const authorizationCode = Array.isArray(parsedQuery.code) ? parsedQuery.code[0] : parsedQuery.code;
//             res.end('Received the callback. You may close this page.');

//             server?.close();
//             server = null;

//             try {
//                 const token = await exchangeAuthorizationCode(authorizationCode);
//                 resolve(token);
//             } catch (error) {
//                 reject(error);
//             }
//             return;
//         });

//         server.on('error', err => {
//             console.error(`Server error: ${err.message}`);
//             reject(err);
//         });

//         // Start server
//         server.listen(parseInt(parsedUri.port, 10), parsedUri.hostname, () => {
//             // Server is now listening
//         });

//         // Optionally add a timeout to reject the promise if it takes too long
//         setTimeout(() => {
//             reject(new Error('Authorization timed out'));
//             server?.close();
//             server = null;
//         }, 60000);  // e.g., 60 seconds
//     });
// }

// export async function exchangeAuthorizationCode(authorizationCode: string): Promise<TokenSet> {
//     if (!superOfficeIssuer) {
//         throw new Error("Issuer not initialized");
//     }

//     const client = new superOfficeIssuer.Client(clientMetadata);
//     try {
//         // eslint-disable-next-line @typescript-eslint/naming-convention
//         return await client.callback(redirectUri, { code: authorizationCode }, { code_verifier: codeVerifier }) as TokenSet;
//     }
//     catch (error) {
//         if (error instanceof Error) {
//             throw new Error("Error obtaining token: " + error.message);
//         } else {
//             throw new Error("Error obtaining token: " + String(error));
//         }
//     }
// }

// export async function exchangeRefreshToken(session: SuperOfficeAuthenticationSession): Promise<TokenSet | undefined> {
//     const url = new URL(`${(session.claims as UserClaims)['http://schemes.superoffice.net/identity/webapi_url']}`);
//     if (!superOfficeIssuer) {
//         superOfficeIssuer = await Issuer.discover(`${url.hostname}/login/.well-known/openid-configuration`);
//     }
//     const client = new superOfficeIssuer.Client(clientMetadata);
//     try {
//         if (session.refreshToken !== undefined) {
//             return await client.refresh(session.refreshToken);
//         }
//     } catch (err) {
//         if (err instanceof Error) {
//             throw new Error("Error refreshing token: " + err.message);
//         } else {
//             throw new Error("Error refreshing token: " + String(err));
//         }
//     }
// }

// function handleAuthorizeRequestError(error: unknown): void {
//     if (error instanceof Error) {
//         vscode.window.showErrorMessage('Failed to open URL: ' + error.message);
//     } else {
//         console.error(error);
//     }
// }