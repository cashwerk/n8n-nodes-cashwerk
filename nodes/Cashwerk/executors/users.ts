import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId, requireId } from '../GenericFunctions';

const SENSITIVE_USER_KEYS = [
    'password', 'salt', 'sessionId',
    'salary', 'bank', 'taxData', 'privatePhones',
    'note', 'isOhRoot', 'workTimeHistory',
];

const SENSITIVE_ROLE_KEYS = ['permissions'];

function sanitizeUser(user: IDataObject): IDataObject {
    for (const key of SENSITIVE_USER_KEYS) {
        delete user[key];
    }
    if (user.role && typeof user.role === 'object') {
        const role = user.role as IDataObject;
        for (const key of SENSITIVE_ROLE_KEYS) {
            delete role[key];
        }
    }
    if (user.license && typeof user.license === 'object') {
        const license = user.license as IDataObject;
        delete license.product;
    }
    return user;
}

function sanitizeUserResponse(data: unknown): unknown {
    if (Array.isArray(data)) {
        return data.map((item) => sanitizeUser(item as IDataObject));
    }
    if (data && typeof data === 'object') {
        const obj = data as IDataObject;
        if (Array.isArray(obj.result)) {
            obj.result = obj.result.map((item: unknown) => sanitizeUser(item as IDataObject));
            return obj;
        }
        return sanitizeUser(obj);
    }
    return data;
}


export async function executeUser(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<unknown> {
    if (operation === 'get') {
        const result = await cashwerkApiRequest.call(this, 'GET', `/users/${requireId(this, 'userId', i)}`);
        return sanitizeUserResponse(result);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const result = await cashwerkApiRequestAllItems.call(this, 'GET', '/users/search', {}, {}, limit);
        return sanitizeUserResponse(result);
    }

    if (operation === 'getActive') {
        const orgId = await getOrganizationId.call(this);
        const result = await cashwerkApiRequest.call(this, 'GET', '/users/active', {}, { organizationId: orgId });
        return sanitizeUserResponse(result);
    }

}

export async function executeWorkTime(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<unknown> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/work-time/latest/by-user/${requireId(this, 'userId', i)}`);
    }

    if (operation === 'forUser') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/work-time/for-user/${requireId(this, 'workTimeId', i)}`, body);
    }

}
