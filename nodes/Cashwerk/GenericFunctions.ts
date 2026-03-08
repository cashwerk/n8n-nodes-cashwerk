import {
    IExecuteFunctions,
    IHookFunctions,
    ILoadOptionsFunctions,
    IWebhookFunctions,
    IHttpRequestMethods,
    IHttpRequestOptions,
    IDataObject,
    NodeApiError,
    JsonObject,
} from 'n8n-workflow';
import FormData from 'form-data';

import { CASHWERK_URLS, CASHWERK_API_PREFIX } from './constants';

type CashwerkContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;

/** Union of all value types that IDataObject accepts. */
type IDataObjectValue = IDataObject[string];

/**
 * Safely coerce a node parameter into a parsed JSON value.
 *
 * n8n expressions can evaluate to an actual JS object/array (e.g. `={{ [1] }}`)
 * OR to a JSON string (e.g. a user typing `[1]` in a json-type field).
 * The old pattern `JSON.parse(param as string)` breaks in the first case
 * because Array.toString() drops the brackets (`[1]` → `"1"` → parsed as number).
 *
 * This helper handles every case the user or an expression might produce.
 */
export function parseJsonParam(value: unknown, fallback: IDataObjectValue = []): IDataObjectValue {
    if (value === undefined || value === null || value === '') return fallback;
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) return value as IDataObjectValue;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '') return fallback;
        try {
            return JSON.parse(trimmed) as IDataObjectValue;
        } catch {
            return fallback;
        }
    }
    return fallback;
}

/**
 * Safely encode a value for use as a URL path segment.
 * Trims whitespace and applies encodeURIComponent to prevent malformed URLs.
 */
export function encodeParam(value: string | number): string {
    return encodeURIComponent(String(value).trim());
}

/**
 * Parse and validate a node parameter that should be a positive integer ID.
 * Backend endpoints use ParseIntPipe, so we must guarantee a clean integer
 * before constructing the URL. Returns the numeric ID as a string for URL use.
 */
export function requireId(
    context: IExecuteFunctions,
    paramName: string,
    itemIndex: number,
): string {
    const raw = context.getNodeParameter(paramName, itemIndex);
    const num = Number(raw);
    if (!Number.isFinite(num) || !Number.isInteger(num) || num <= 0) {
        throw new Error(
            `Invalid value for "${paramName}": "${raw}". Expected a positive integer ID.`,
        );
    }
    return String(num);
}

/**
 * Convert a date value to a Unix timestamp in milliseconds.
 * Backend date-range routes use ParseIntPipe and expect integer timestamps.
 * Accepts ISO-8601 strings, Date objects, or numeric timestamps.
 */
export function toTimestamp(value: string | number | Date): string {
    if (typeof value === 'number') {
        return String(value);
    }
    const str = String(value).trim();
    if (/^\d+$/.test(str)) {
        return str;
    }
    const ms = new Date(str).getTime();
    if (isNaN(ms)) {
        throw new Error(`Invalid date value: "${value}". Expected an ISO-8601 date string or a Unix timestamp in milliseconds.`);
    }
    return String(ms);
}

/**
 * Build a fully-qualified cashwerk API URL from the credential environment toggle.
 */
function getBaseUrl(credentials: IDataObject): string {
    const env = (credentials.environment as string) || 'production';
    let base: string;

    if (env === 'custom') {
        base = (credentials.customBaseUrl as string) || CASHWERK_URLS.production;
    } else {
        base = CASHWERK_URLS[env as keyof typeof CASHWERK_URLS] || CASHWERK_URLS.production;
    }

    return `${base.replace(/\/+$/, '')}${CASHWERK_API_PREFIX}`;
}

/**
 * Resolve which credential type is active on the current node and return the credentials + auth header.
 */
async function resolveAuth(context: CashwerkContext): Promise<{ credentials: IDataObject; headers: Record<string, string> }> {
    let authMethod = 'apiKey';
    try {
        if ('getCurrentNodeParameter' in context) {
            authMethod = ((context as ILoadOptionsFunctions).getCurrentNodeParameter('authentication') as string) || 'apiKey';
        } else if ('getNodeParameter' in context) {
            authMethod = ((context as IExecuteFunctions).getNodeParameter('authentication', 0, 'apiKey') as string);
        }
    } catch {
        authMethod = 'apiKey';
    }

    if (authMethod === 'oAuth2') {
        const credentials = await context.getCredentials('cashwerkOAuth2Api');
        const tokenData = credentials.oauthTokenData as IDataObject | undefined;
        const accessToken = (tokenData?.access_token as string) || '';
        return {
            credentials,
            headers: { Authorization: `Bearer ${accessToken}` },
        };
    }

    const credentials = await context.getCredentials('cashwerkApi');
    return {
        credentials,
        headers: { 'X-API-Key': credentials.apiKey as string },
    };
}

/**
 * Make an authenticated HTTP request to the cashwerk API.
 * Automatically detects API key vs OAuth2 credentials.
 */
export async function cashwerkApiRequest(
    this: CashwerkContext,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
): Promise<any> {
    const { credentials, headers } = await resolveAuth(this);
    const baseUrl = getBaseUrl(credentials);

    const options: IHttpRequestOptions = {
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        qs,
        json: true,
    };

    if (Object.keys(body).length > 0) {
        options.body = body;
    }

    try {
        const response = await this.helpers.httpRequest(options);
        // Unwrap the TransformInterceptor envelope: { success, data, message, statusCode }
        if (response && typeof response === 'object' && response.success !== undefined && 'data' in response) {
            return response.data;
        }
        return response;
    } catch (error: any) {
        const statusCode = error?.statusCode
            || error?.response?.status
            || error?.response?.statusCode
            || error?.httpCode
            || error?.code
            || '';

        let detail = '';

        const candidates = [
            error?.response?.data,
            error?.response?.body,
            error?.body,
            error?.cause?.response?.data,
            error?.cause?.response?.body,
            error?.data,
            error?.error,
        ];

        for (const candidate of candidates) {
            if (!candidate || detail) break;
            const parsed = typeof candidate === 'string'
                ? (() => { try { return JSON.parse(candidate); } catch { return null; } })()
                : candidate;
            if (!parsed) continue;
            const nestedMsg = parsed?.response?.message;
            if (nestedMsg) {
                detail = Array.isArray(nestedMsg) ? nestedMsg.join('; ') : String(nestedMsg);
                break;
            }
            if (parsed?.message && parsed.message !== 'Bad Request Exception'
                && parsed.message !== 'Internal Server Error'
                && !String(parsed.message).startsWith('Request failed')) {
                const msg = parsed.message;
                detail = Array.isArray(msg) ? msg.join('; ') : String(msg);
                break;
            }
        }

        if (!detail && error?.response?.message) {
            const rm = error.response.message;
            detail = Array.isArray(rm) ? rm.join('; ') : String(rm);
        }

        if (!detail) {
            detail = error?.description || '';
        }
        if (!detail && error?.message
            && !error.message.includes('Request failed with status code')
            && error.message !== 'Bad Request Exception'
            && error.message !== 'Internal Server Error') {
            detail = error.message;
        }

        const hint = statusCode === 403 || statusCode === 401
            ? ' – Check that your API key has the required scopes.'
            : '';
        const summary = `cashwerk API error (${statusCode}) on ${method} ${endpoint}${hint}`;

        throw new NodeApiError(
            (this as any).getNode(),
            error as JsonObject,
            {
                message: summary,
                description: detail || 'An unexpected error occurred. Check the server logs for details.',
                httpCode: String(statusCode),
            },
        );
    }
}

/**
 * Make an authenticated request and automatically paginate through all results.
 * Expects the API to return { data: [...], meta?: { page, limit, total } } or a flat array.
 */
export async function cashwerkApiRequestAllItems(
    this: IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
    limit = 0,
): Promise<IDataObject[]> {
    const returnData: IDataObject[] = [];
    let page = 1;
    const pageSize = 50;

    do {
        const requestBody: IDataObject = {
            ...body,
            page,
            limit: pageSize,
        };

        // cashwerkApiRequest already unwraps the TransformInterceptor envelope
        const response = await cashwerkApiRequest.call(this, method, endpoint, requestBody, qs);

        const items: IDataObject[] = Array.isArray(response)
            ? response
            : (response?.result ?? response?.data ?? response?.items ?? []);

        returnData.push(...items);

        if (limit > 0 && returnData.length >= limit) {
            return returnData.slice(0, limit);
        }

        const total = response?.total ?? response?.meta?.total;
        if (total !== undefined && returnData.length >= total) {
            break;
        }

        if (items.length < pageSize) {
            break;
        }

        page++;
    } while (true);

    return returnData;
}

/**
 * Upload a file via multipart/form-data to the cashwerk API.
 * Reads binary data from the n8n input item and sends it as a file field.
 *
 * @param endpoint   API path (e.g. `/drive/5/upload/direct`)
 * @param itemIndex  Current item index
 * @param binaryPropertyName  Name of the binary property on the input item (default: `data`)
 * @param formFields Additional form fields to include alongside the file
 * @param fileFieldName The multipart field name for the file (default: `file`)
 */
export async function cashwerkApiUploadFile(
    this: IExecuteFunctions,
    endpoint: string,
    itemIndex: number,
    binaryPropertyName = 'data',
    formFields: IDataObject = {},
    fileFieldName = 'file',
): Promise<any> {
    const { credentials, headers } = await resolveAuth(this);
    const baseUrl = getBaseUrl(credentials);

    const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
    const dataBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

    const form = new FormData();

    for (const [key, value] of Object.entries(formFields)) {
        if (value !== undefined && value !== null && value !== '') {
            form.append(key, String(value));
        }
    }

    form.append(fileFieldName, dataBuffer, {
        filename: binaryData.fileName || 'file',
        contentType: binaryData.mimeType || 'application/octet-stream',
    });

    const options: IHttpRequestOptions = {
        method: 'POST',
        url: `${baseUrl}${endpoint}`,
        headers: {
            ...headers,
            ...form.getHeaders(),
        },
        body: form as any,
    };

    try {
        const response = await this.helpers.httpRequest(options);
        return response;
    } catch (error) {
        throw new NodeApiError(this.getNode(), error as JsonObject, {
            message: 'cashwerk file upload failed',
        });
    }
}

/**
 * Resolve the organization ID from the authenticated API key or OAuth2 token.
 * Caches the result in workflow static data to avoid repeated calls.
 */
export async function getOrganizationId(
    this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions,
): Promise<number> {
    const staticData = this.getWorkflowStaticData('node');

    if (staticData.organizationId) {
        return staticData.organizationId as number;
    }

    const meResponse = await cashwerkApiRequest.call(this, 'GET', '/api-platform/me');
    const orgId = (meResponse?.organizationId ?? meResponse?.data?.organizationId) as number;

    staticData.organizationId = orgId;

    return orgId;
}
