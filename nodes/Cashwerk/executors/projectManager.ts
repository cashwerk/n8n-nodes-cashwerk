import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, cashwerkApiUploadFile, getOrganizationId, parseJsonParam, requireId } from '../GenericFunctions';


export async function executeProject(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/projects/${requireId(this, 'projectId', i)}`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/projects/new', body);
    }

    if (operation === 'addAssignees') {
        const projectId = requireId(this, 'projectId', i);
        const orgId = await getOrganizationId.call(this);
        const body: IDataObject = {
            userIds: parseJsonParam(this.getNodeParameter('userIds', i, '[]')),
            remove: this.getNodeParameter('remove', i),
            projectId: Number(projectId),
            orgId,
        };
        return cashwerkApiRequest.call(this, 'POST', `/projects/${projectId}/assignees`, body);
    }

    if (operation === 'addContactPersons') {
        const projectId = requireId(this, 'projectId', i);
        const raw = this.getNodeParameter('contactIds', i);
        let contactIds: number[];
        if (Array.isArray(raw)) {
            contactIds = raw.map(id => Number(id)).filter(id => !isNaN(id));
        } else {
            contactIds = String(raw).split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
        }
        const body: IDataObject = { contactIds };
        return cashwerkApiRequest.call(this, 'POST', `/projects/${projectId}/contacts`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'PATCH', `/projects/${requireId(this, 'projectId', i)}/archive`);
    }

    if (operation === 'customer') {
        const body: IDataObject = {
            type: this.getNodeParameter('type', i),
            companyId: this.getNodeParameter('companyId', i),
            contactId: this.getNodeParameter('contactId', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/projects/${requireId(this, 'projectId', i)}/portfolio/customer`, body);
    }

    if (operation === 'getAssignees') {
        return cashwerkApiRequest.call(this, 'GET', `/projects/${requireId(this, 'projectId', i)}/assignees`);
    }

    if (operation === 'getDashboard') {
        return cashwerkApiRequest.call(this, 'GET', `/projects/${requireId(this, 'projectId', i)}/dashboard`);
    }

    if (operation === 'getStatuses') {
        return cashwerkApiRequest.call(this, 'GET', '/projects/statuses');
    }

    if (operation === 'query') {
        const qs: IDataObject = {};
        const skipVal = this.getNodeParameter('skip', i, 0) as number;
        if (skipVal) qs['skip'] = skipVal;
        const takeVal = this.getNodeParameter('take', i, 50) as number;
        if (takeVal) qs['take'] = takeVal;
        const sortByVal = this.getNodeParameter('sortBy', i, '') as string;
        if (sortByVal) qs['sortBy'] = sortByVal;
        const sortTypeVal = this.getNodeParameter('sortType', i, '') as string;
        if (sortTypeVal) qs['sortType'] = sortTypeVal;
        const searchQueryVal = this.getNodeParameter('searchQuery', i, '') as string;
        if (searchQueryVal) qs['searchQuery'] = searchQueryVal;
        const includeArchivedVal = this.getNodeParameter('includeArchived', i, false) as boolean;
        if (includeArchivedVal) qs['includeArchived'] = includeArchivedVal;
        const statusFilterVal = this.getNodeParameter('statusFilter', i, '') as string;
        if (statusFilterVal) qs['statusFilter'] = statusFilterVal;
        return cashwerkApiRequest.call(this, 'GET', '/projects/query', {}, qs);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'PATCH', `/projects/${requireId(this, 'projectId', i)}/restore`);
    }

    if (operation === 'updateAddressWithPortfolio') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/projects/${requireId(this, 'projectId', i)}/address-with-portfolio`, body);
    }

    if (operation === 'updateAssignees') {
        const projectId = requireId(this, 'projectId', i);
        const orgId = await getOrganizationId.call(this);
        const body: IDataObject = {
            userIds: parseJsonParam(this.getNodeParameter('userIds', i, '[]')),
            remove: this.getNodeParameter('remove', i),
            projectId: Number(projectId),
            orgId,
        };
        return cashwerkApiRequest.call(this, 'PATCH', `/projects/${projectId}/assignees`, body);
    }

    if (operation === 'updateDefaultTaskBoard') {
        const body: IDataObject = {
            boardId: this.getNodeParameter('boardId', i) as number,
        };
        return cashwerkApiRequest.call(this, 'POST', `/projects/${requireId(this, 'projectId', i)}/update-default-task-board`, body);
    }

    if (operation === 'uploadImage') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/projects/${requireId(this, 'projectId', i)}/image`, i, binaryPropertyName);
    }

}
