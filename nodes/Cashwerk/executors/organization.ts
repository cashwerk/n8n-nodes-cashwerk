import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, getOrganizationId, encodeParam } from '../GenericFunctions';

const SENSITIVE_ORG_KEYS = [
    'members', 'roles', 'licenses', 'founder',
    'bankAccounts', 'stripeCustomerId', 'leitwegId',
    'taxNumber', 'vatId', 'note',
];

function sanitizeOrganization(org: IDataObject): IDataObject {
    for (const key of SENSITIVE_ORG_KEYS) {
        delete org[key];
    }
    return org;
}


export async function executeOrganization(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<unknown> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        const result = await cashwerkApiRequest.call(this, 'GET', `/organization/${encodeParam(orgId)}`);
        return sanitizeOrganization(result as IDataObject);
    }

}
