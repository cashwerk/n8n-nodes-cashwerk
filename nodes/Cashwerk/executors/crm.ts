import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, cashwerkApiUploadFile, encodeParam, getOrganizationId, parseJsonParam, requireId } from '../GenericFunctions';


export async function executeCompany(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/crm/companies/${requireId(this, 'companyId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', `/crm/companies/organization/${encodeParam(orgId)}/companies/query`, { ...filters }, {}, limit);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/crm/companies/${requireId(this, 'companyId', i)}`, body);
    }

    if (operation === 'create') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/organization/${encodeParam(orgId)}/companies`, body);
    }

    if (operation === 'addContacts') {
        const body: IDataObject = {
            contactIds: parseJsonParam(this.getNodeParameter('contactIds', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'PUT', `/crm/companies/${requireId(this, 'companyId', i)}/contacts`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/archive`);
    }

    if (operation === 'archiveMany') {
        const companyIds = parseJsonParam(this.getNodeParameter('companyIds', i, '[]'));
        const body = { companyIds };
        return cashwerkApiRequest.call(this, 'POST', '/crm/companies/archive', body);
    }

    if (operation === 'exportCsv') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/organization/${encodeParam(orgId)}/export/csv`, body);
    }

    if (operation === 'exportPdf') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/organization/${encodeParam(orgId)}/export/pdf`, body);
    }

    if (operation === 'getCancellationInvoices') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/cancellation-invoices`, body);
    }

    if (operation === 'getDeals') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/deals`, body);
    }

    if (operation === 'getInvoices') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/invoices`, body);
    }

    if (operation === 'getOffers') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/offers`, body);
    }

    if (operation === 'getProjects') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/projects`, body);
    }

    if (operation === 'getTasks') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/tasks`, body);
    }

    if (operation === 'removeContact') {
        return cashwerkApiRequest.call(this, 'DELETE', `/crm/companies/${requireId(this, 'companyId', i)}/contacts/${requireId(this, 'contactId', i)}`);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'POST', `/crm/companies/${requireId(this, 'companyId', i)}/restore`);
    }

    if (operation === 'restoreMany') {
        const companyIds = parseJsonParam(this.getNodeParameter('companyIds', i, '[]'));
        const body = { companyIds };
        return cashwerkApiRequest.call(this, 'POST', '/crm/companies/restore', body);
    }

    if (operation === 'uploadLogo') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/crm/companies/${requireId(this, 'companyId', i)}/logo`, i, binaryPropertyName);
    }

}

export async function executeContact(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/crm/contacts/${requireId(this, 'contactId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', `/crm/contacts/organization/${encodeParam(orgId)}/contacts/query`, { ...filters }, {}, limit);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/crm/contacts/${requireId(this, 'contactId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/crm/contacts/${requireId(this, 'contactId', i)}/companies/${requireId(this, 'companyId', i)}`);
    }

    if (operation === 'create') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/organization/${encodeParam(orgId)}/contacts`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/archive`);
    }

    if (operation === 'archiveMany') {
        const contactIds = parseJsonParam(this.getNodeParameter('contactIds', i, '[]'));
        const body = { contactIds };
        return cashwerkApiRequest.call(this, 'POST', '/crm/contacts/archive', body);
    }

    if (operation === 'exportCsv') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/organization/${encodeParam(orgId)}/export/csv`, body);
    }

    if (operation === 'exportPdf') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/organization/${encodeParam(orgId)}/export/pdf`, body);
    }

    if (operation === 'getCancellationInvoices') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/cancellation-invoices`, body);
    }

    if (operation === 'linkCompanies') {
        const body: IDataObject = {
            companyIds: parseJsonParam(this.getNodeParameter('companyIds', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'PUT', `/crm/contacts/${requireId(this, 'contactId', i)}/companies`, body);
    }

    if (operation === 'getDeals') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/deals`, body);
    }

    if (operation === 'getInvoices') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/invoices`, body);
    }

    if (operation === 'getOffers') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/offers`, body);
    }

    if (operation === 'getProjects') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/projects`, body);
    }

    if (operation === 'getTasks') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/tasks`, body);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'POST', `/crm/contacts/${requireId(this, 'contactId', i)}/restore`);
    }

    if (operation === 'restoreMany') {
        const contactIds = parseJsonParam(this.getNodeParameter('contactIds', i, '[]'));
        const body = { contactIds };
        return cashwerkApiRequest.call(this, 'POST', '/crm/contacts/restore', body);
    }

    if (operation === 'uploadAvatar') {
        const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
        return cashwerkApiUploadFile.call(this, `/crm/contacts/${requireId(this, 'contactId', i)}/avatar`, i, binaryPropertyName);
    }

}

export async function executePortfolio(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        const type = this.getNodeParameter('type', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/crm/${encodeParam(type)}/${requireId(this, 'clientId', i)}/portfolios/${requireId(this, 'portfolioId', i)}`);
    }

    if (operation === 'getAll') {
        const type = this.getNodeParameter('type', i) as string;
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', `/crm/${encodeParam(type)}/${requireId(this, 'clientId', i)}/portfolios/query`, { ...filters }, {}, limit);
    }

    if (operation === 'update') {
        const type = this.getNodeParameter('type', i) as string;
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/crm/${encodeParam(type)}/${requireId(this, 'clientId', i)}/portfolios/${requireId(this, 'portfolioId', i)}`, body);
    }

    if (operation === 'delete') {
        const type = this.getNodeParameter('type', i) as string;
        return cashwerkApiRequest.call(this, 'DELETE', `/crm/${encodeParam(type)}/${requireId(this, 'clientId', i)}/portfolios/${requireId(this, 'portfolioId', i)}`);
    }

    if (operation === 'create') {
        const type = this.getNodeParameter('type', i) as string;
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', `/crm/${encodeParam(type)}/${requireId(this, 'clientId', i)}/portfolios`, body);
    }

}

export async function executeCrmMetrics(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'getContactMetrics') {
        const date = this.getNodeParameter('date', i, '') as string;
        const qs: IDataObject = {};
        if (date) qs.date = date;
        return cashwerkApiRequest.call(this, 'GET', `/crm-metrics/organization/${encodeParam(orgId)}/contacts`, {}, qs);
    }

    if (operation === 'getCompanyMetrics') {
        const date = this.getNodeParameter('date', i, '') as string;
        const qs: IDataObject = {};
        if (date) qs.date = date;
        return cashwerkApiRequest.call(this, 'GET', `/crm-metrics/organization/${encodeParam(orgId)}/companies`, {}, qs);
    }

}
