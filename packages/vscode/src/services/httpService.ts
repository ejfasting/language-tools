import { HttpRequestResponse } from "../types";
import * as https from 'https';
import * as http from 'http';
import { currentSession as session } from "../providers/authenticationProvider";

export async function httpAuthenticatedRequestAsync<T>(path: string, method: https.RequestOptions["method"], body?: object): Promise<HttpRequestResponse<T>> {
    if (!session) {
        throw new Error("No session found");
    }

    const url = new URL(`${session.webApiUri}${path}`);

    const headers: { [key: string]: string } = {
        accept: 'application/json',
        authorization: `Bearer ${session.accessToken}`
    };

    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    const options: https.RequestOptions = {
        headers: headers,
        method: method,
        hostname: url.hostname,
        port: url.port ? parseInt(url.port) : 443,
        protocol: url.protocol,
        path: url.pathname
    };

    const requestBody = body ? JSON.stringify(body) : undefined; // Stringify only once

    try {
        const response = await executeRequestAsync<T>(options, requestBody) as HttpRequestResponse<T>;

        // Check if the response indicates an expired token
        // if (response.status === 401) {
        //     const oldToken = session.accessToken;
        //     session = await superofficeAuthenticationProvider.refreshAccessToken(session);

        //     if (oldToken === session.accessToken) {
        //         throw new Error("Failed to update access token.");
        //     }

        //     options = {
        //         ...options,
        //         headers: {
        //            ...options.headers,
        //            authorization: `Bearer ${session.accessToken}`
        //         }
        //      };

        //     response = await executeRequest(options, requestBody) as HttpRequestResponse<T>;

        //     if (response.status === 401) {
        //         throw new Error("Access denied: After refreshing the accessToken you are still unauthorized. You might not have the required permissions to access this endpoint.");
        //     }
        // }

        return response;

    } catch (error) {
        // Check if the error is an instance of Error and then access its message property
        if (error instanceof Error) {
            if (error.message.includes("Failed to update access token") || error.message.includes("Access denied")) {
                throw error;
            }

            throw new Error("Network error occurred: " + error.message);
        } else {
            throw new Error("Network error occurred.");
        }
    }
}

export async function httpPublicRequestAsync<T>(method: https.RequestOptions["method"], urlString: string, body?: object) {
    const url = new URL(urlString);

    const requestOptions: https.RequestOptions = {
        headers: {
            accept: 'application/json',
        },
        hostname: url.hostname,
        port: url.port ? parseInt(url.port) : 443,
        protocol: url.protocol,
        path: url.pathname,
        method: method,
    };

    const requestBody = body ? JSON.stringify(body) : undefined;

    try {
        return await executeRequestAsync<T>(requestOptions, requestBody) as HttpRequestResponse<T>;
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error(`${error}`);
        }
    }
}

export async function httpLocalRequestAsync<T>(urlString: string, body?: object) {
    const url = new URL(urlString);

    if (!session) {
        throw new Error("No session found");
    }

    const headers: { [key: string]: string } = {
        accept: 'application/json',
        'x-apiendpoint': session.webApiUri,
        'x-accesstoken': `Bearer ${session.accessToken}`
    };

    const requestOptions: https.RequestOptions = {
        headers: headers,
        hostname: url.hostname,
        port: url.port ? parseInt(url.port) : 443,
        protocol: url.protocol,
        path: url.pathname,
        method: 'POST',
    };

    const requestBody = body ? JSON.stringify(body) : undefined;

    try {
        return await executeHttpRequestAsync<T>(requestOptions, requestBody) as HttpRequestResponse<T>;
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error(`${error}`);
        }
    }

}

async function executeHttpRequestAsync<T>(options: https.RequestOptions, body?: string): Promise<HttpRequestResponse<T>> {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    const responseObject: HttpRequestResponse<T> = {
                        status: res.statusCode!,
                        body: parsedData as T, // Type assertions
                        ok: res.statusCode! >= 200 && res.statusCode! < 300,
                        statusText: res.statusMessage ?? "defaultString"
                    };
                    resolve(responseObject);
                } catch (error) {
                    reject(new Error("Failed to parse response data."));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (body) {
            req.write(body);
        }

        req.end();
    });
}


async function executeRequestAsync<T>(options: https.RequestOptions, body?: string): Promise<HttpRequestResponse<T>> {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    const responseObject: HttpRequestResponse<T> = {
                        status: res.statusCode!,
                        body: parsedData as T, // Type assertions
                        ok: res.statusCode! >= 200 && res.statusCode! < 300,
                        statusText: res.statusMessage ?? "defaultString"
                    };
                    resolve(responseObject);
                } catch (error) {
                    reject(new Error("Failed to parse response data."));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (body) {
            req.write(body);
        }

        req.end();
    });
}
