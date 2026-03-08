import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, parseJsonParam, requireId } from '../GenericFunctions';


export async function executeDeal(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}`);
    }

    if (operation === 'getAll') {
        const pipelineId = requireId(this, 'pipelineId', i);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/sales-pipeline/deals/by-pipeline/${pipelineId}/search`, filters);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PUT', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}`);
    }

    if (operation === 'addCompanies') {
        const body: IDataObject = {
            companyIds: parseJsonParam(this.getNodeParameter('companyIds', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'POST', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}/companies`, body);
    }

    if (operation === 'addContacts') {
        const raw = this.getNodeParameter('contactIds', i);
        let contactIds: number[];
        if (Array.isArray(raw)) {
            contactIds = raw.map(id => Number(id)).filter(id => !isNaN(id));
        } else {
            contactIds = String(raw).split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
        }
        const body: IDataObject = { contactIds };
        return cashwerkApiRequest.call(this, 'POST', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}/contacts`, body);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i) as string,
            boardId: this.getNodeParameter('boardId', i) as number,
            columnId: this.getNodeParameter('columnId', i) as number,
            dealValue: this.getNodeParameter('dealValue', i) as number,
            currency: this.getNodeParameter('currency', i) as string,
            priority: this.getNodeParameter('priority', i) as string,
            ...this.getNodeParameter('additionalFields', i, {}) as IDataObject,
        };
        return cashwerkApiRequest.call(this, 'POST', '/sales-pipeline/deals', body);
    }

    if (operation === 'addTag') {
        return cashwerkApiRequest.call(this, 'POST', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}/tags/${requireId(this, 'tagId', i)}`);
    }

    if (operation === 'stage') {
        const body: IDataObject = {
            newStageId: this.getNodeParameter('newStageId', i),
            position: this.getNodeParameter('position', i),
            lostReason: this.getNodeParameter('lostReason', i),
        };
        return cashwerkApiRequest.call(this, 'PUT', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}/stage`, body);
    }

    if (operation === 'updateLines') {
        const body: IDataObject = {
            dealId: this.getNodeParameter('dealId', i),
            lines: parseJsonParam(this.getNodeParameter('lines', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'PUT', `/sales-pipeline/deals/${requireId(this, 'dealId', i)}/lines`, body);
    }

}

export async function executePipeline(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/sales-pipeline/pipelines/${requireId(this, 'pipelineId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', '/sales-pipeline/pipelines');
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PUT', `/sales-pipeline/pipelines/${requireId(this, 'pipelineId', i)}`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'DELETE', `/sales-pipeline/pipelines/${requireId(this, 'pipelineId', i)}`);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'POST', `/sales-pipeline/pipelines/${requireId(this, 'pipelineId', i)}/restore`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i) as string,
            pipelineType: this.getNodeParameter('pipelineType', i) as string,
            ...this.getNodeParameter('additionalFields', i, {}) as IDataObject,
        };
        return cashwerkApiRequest.call(this, 'POST', '/sales-pipeline/pipelines', body);
    }

}
