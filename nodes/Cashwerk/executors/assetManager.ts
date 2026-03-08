import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, cashwerkApiUploadFile, getOrganizationId, encodeParam, requireId } from '../GenericFunctions';

function isNonEmpty(val: unknown): boolean {
    if (val === undefined || val === null || val === '') return false;
    if (val === false || val === 0) return false;
    if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed !== '' && trimmed !== '{}' && trimmed !== '[]';
    }
    if (typeof val === 'object' && Object.keys(val as Record<string, unknown>).length === 0) return false;
    return true;
}

function buildAssetQueryParams(ctx: IExecuteFunctions, i: number): IDataObject {
    const qs: IDataObject = {};

    const searchQuery = ctx.getNodeParameter('searchQuery', i, '') as string;
    const skip = ctx.getNodeParameter('skip', i, 0) as number;
    const take = ctx.getNodeParameter('take', i, 10) as number;

    if (isNonEmpty(searchQuery)) qs.searchQuery = searchQuery;
    if (skip > 0) qs.skip = skip;
    if (take > 0) qs.take = take;

    const filters = ctx.getNodeParameter('queryFilters', i, {}) as IDataObject;
    for (const [key, val] of Object.entries(filters)) {
        if (isNonEmpty(val)) qs[key] = val;
    }

    return qs;
}

export async function executeAssetUnit(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/units/${requireId(this, 'assetUnitId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/units/organization/${encodeParam(orgId)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            shortCode: this.getNodeParameter('shortCode', i),
        };
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/units', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/assetmanager/units/${requireId(this, 'assetUnitId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/assetmanager/units/${requireId(this, 'assetUnitId', i)}`);
    }

    if (operation === 'search') {
        const qs: IDataObject = {};
        const qVal = this.getNodeParameter('q', i, '') as string;
        if (qVal) qs['q'] = qVal;
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/units/organization/${encodeParam(orgId)}/single-search`, {}, qs);
    }

}

export async function executeMaterial(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/materials/${requireId(this, 'materialId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/materials/organization/${encodeParam(orgId)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            unitId: this.getNodeParameter('unitId', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/materials/new', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/assetmanager/materials/${requireId(this, 'materialId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/assetmanager/materials/${requireId(this, 'materialId', i)}`);
    }

    if (operation === 'deleteMany') {
        const ids = this.getNodeParameter('materialIds', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/materials/delete-many', ids);
    }

    if (operation === 'query') {
        const qs = buildAssetQueryParams(this, i);
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/materials/organization/${encodeParam(orgId)}/query`, {}, qs);
    }

    if (operation === 'uploadImage') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/assetmanager/materials/${requireId(this, 'materialId', i)}/image`, i, binaryPropertyName);
    }

}

export async function executeAssetGroup(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/groups/${requireId(this, 'assetGroupId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/groups/organization/${encodeParam(orgId)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            color: this.getNodeParameter('color', i),
        };
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/groups', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/assetmanager/groups/${requireId(this, 'assetGroupId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/assetmanager/groups/${requireId(this, 'assetGroupId', i)}`);
    }

}

export async function executeMachine(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/machines/${requireId(this, 'machineId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/machines/organization/${encodeParam(orgId)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            unitId: this.getNodeParameter('unitId', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/machines/new', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/assetmanager/machines/${requireId(this, 'machineId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/assetmanager/machines/${requireId(this, 'machineId', i)}`);
    }

    if (operation === 'deleteMany') {
        const ids = this.getNodeParameter('machineIds', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/machines/delete-many', ids);
    }

    if (operation === 'query') {
        const qs = buildAssetQueryParams(this, i);
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/machines/organization/${encodeParam(orgId)}/query`, {}, qs);
    }

    if (operation === 'uploadImage') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/assetmanager/machines/${requireId(this, 'machineId', i)}/image`, i, binaryPropertyName);
    }

}

export async function executeAssetService(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/services/${requireId(this, 'assetServiceId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/services/organization/${encodeParam(orgId)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/services/new', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/assetmanager/services/${requireId(this, 'assetServiceId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/assetmanager/services/${requireId(this, 'assetServiceId', i)}`);
    }

    if (operation === 'deleteMany') {
        const ids = this.getNodeParameter('serviceIds', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/services/delete-many', ids);
    }

    if (operation === 'query') {
        const qs = buildAssetQueryParams(this, i);
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/services/organization/${encodeParam(orgId)}/query`, {}, qs);
    }

    if (operation === 'uploadImage') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/assetmanager/services/${requireId(this, 'assetServiceId', i)}/image`, i, binaryPropertyName);
    }

}

export async function executeSubcontract(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/subcontracts/${requireId(this, 'subcontractId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/subcontracts/organization/${encodeParam(orgId)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            unitId: this.getNodeParameter('unitId', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/subcontracts/new', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/assetmanager/subcontracts/${requireId(this, 'subcontractId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/assetmanager/subcontracts/${requireId(this, 'subcontractId', i)}`);
    }

    if (operation === 'deleteMany') {
        const ids = this.getNodeParameter('subcontractIds', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', '/assetmanager/subcontracts/delete-many', ids);
    }

    if (operation === 'query') {
        const qs = buildAssetQueryParams(this, i);
        return cashwerkApiRequest.call(this, 'GET', `/assetmanager/subcontracts/organization/${encodeParam(orgId)}/query`, {}, qs);
    }

    if (operation === 'uploadImage') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/assetmanager/subcontracts/${requireId(this, 'subcontractId', i)}/image`, i, binaryPropertyName);
    }

}
