import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId, parseJsonParam, requireId } from '../GenericFunctions';

/**
 * Parse a JSON field and only add it to the body when the result is a non-empty array.
 * Prevents n8n's cached default '[]' from sending an empty array that wipes server data.
 */
function addNonEmptyArray(body: IDataObject, key: string, raw: unknown): void {
    if (!raw) return;
    const parsed = parseJsonParam(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
        body[key] = parsed;
    }
}

async function resolveMailProvider(ctx: IExecuteFunctions, connectionId: number): Promise<string> {
    if (connectionId === -1) return 'user_system';
    const connections = await cashwerkApiRequest.call(ctx, 'GET', '/mailing/connections') as IDataObject[];
    const match = connections.find((c) => c.id === connectionId);
    if (!match) throw new Error(`Mail connection ${connectionId} not found`);
    return match.provider as string;
}

export async function executeOffer(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/offers/${requireId(this, 'offerId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', '/invoicing/offers/query', { ...filters }, {}, limit);
    }

    if (operation === 'create') {
        const additional = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
        const body: IDataObject = {};
        if (additional.offer) body.offer = parseJsonParam(additional.offer);
        if (additional.customer) body.customer = parseJsonParam(additional.customer);
        if (additional.invoiceLines) body.invoiceLines = parseJsonParam(additional.invoiceLines);
        if (additional.paymentTerms) body.paymentTerms = parseJsonParam(additional.paymentTerms);
        if (additional.paymentOptions) body.paymentOptions = parseJsonParam(additional.paymentOptions);
        if (additional.pdfOptions) body.pdfOptions = parseJsonParam(additional.pdfOptions);
        if (additional.totalDiscounts) body.totalDiscounts = parseJsonParam(additional.totalDiscounts);
        if (additional.linkingOptions) body.linkingOptions = parseJsonParam(additional.linkingOptions);
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/offers/create', body);
    }

    if (operation === 'update') {
        const fields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        const body: IDataObject = {};
        if (fields.offer) body.offer = parseJsonParam(fields.offer);
        if (fields.customer) body.customer = parseJsonParam(fields.customer);
        addNonEmptyArray(body, 'invoiceLines', fields.invoiceLines);
        if (fields.paymentTerms) body.paymentTerms = parseJsonParam(fields.paymentTerms);
        if (fields.paymentOptions) body.paymentOptions = parseJsonParam(fields.paymentOptions);
        if (fields.pdfOptions) body.pdfOptions = parseJsonParam(fields.pdfOptions);
        addNonEmptyArray(body, 'totalDiscounts', fields.totalDiscounts);
        if (fields.linkingOptions) body.linkingOptions = parseJsonParam(fields.linkingOptions);
        return cashwerkApiRequest.call(this, 'PATCH', `/invoicing/offers/${requireId(this, 'offerId', i)}`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/${requireId(this, 'offerId', i)}/archive`);
    }

    if (operation === 'book') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/${requireId(this, 'offerId', i)}/book`);
    }

    if (operation === 'cancel') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/${requireId(this, 'offerId', i)}/cancel`);
    }

    if (operation === 'convertToInvoice') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/${requireId(this, 'offerId', i)}/convert-to-invoice`);
    }

    if (operation === 'createFromDeal') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/from-deal/${requireId(this, 'dealId', i)}`);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/${requireId(this, 'offerId', i)}/restore`);
    }

    if (operation === 'send') {
        const connectionId = this.getNodeParameter('connectionId', i) as number;
        const body: IDataObject = {
            recipientEmail: this.getNodeParameter('recipientEmail', i),
            connectionId,
            mailProvider: await resolveMailProvider(this, connectionId),
            subject: this.getNodeParameter('subject', i),
            customMessage: this.getNodeParameter('customMessage', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/offers/${requireId(this, 'offerId', i)}/send-by-mail`, body);
    }

}

export async function executeInvoice(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', '/invoicing/invoices/query', { ...filters }, {}, limit);
    }

    if (operation === 'create') {
        const additional = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
        const body: IDataObject = {
            invoice: parseJsonParam(this.getNodeParameter('invoice', i)),
            customer: parseJsonParam(this.getNodeParameter('customer', i)),
        };
        if (additional.invoiceLines) body.invoiceLines = parseJsonParam(additional.invoiceLines);
        if (additional.paymentTerms) body.paymentTerms = parseJsonParam(additional.paymentTerms);
        if (additional.paymentOptions) body.paymentOptions = parseJsonParam(additional.paymentOptions);
        if (additional.pdfOptions) body.pdfOptions = parseJsonParam(additional.pdfOptions);
        if (additional.totalDiscounts) body.totalDiscounts = parseJsonParam(additional.totalDiscounts);
        if (additional.linkingOptions) body.linkingOptions = parseJsonParam(additional.linkingOptions);
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/invoices/new', body);
    }

    if (operation === 'update') {
        const fields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        const body: IDataObject = {};
        if (fields.invoice) body.invoice = parseJsonParam(fields.invoice);
        if (fields.customer) body.customer = parseJsonParam(fields.customer);
        addNonEmptyArray(body, 'invoiceLines', fields.invoiceLines);
        if (fields.paymentTerms) body.paymentTerms = parseJsonParam(fields.paymentTerms);
        if (fields.paymentOptions) body.paymentOptions = parseJsonParam(fields.paymentOptions);
        if (fields.pdfOptions) body.pdfOptions = parseJsonParam(fields.pdfOptions);
        addNonEmptyArray(body, 'totalDiscounts', fields.totalDiscounts);
        if (fields.linkingOptions) body.linkingOptions = parseJsonParam(fields.linkingOptions);
        return cashwerkApiRequest.call(this, 'PATCH', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/archive`);
    }

    if (operation === 'book') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/book`);
    }

    if (operation === 'cancel') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/cancel`);
    }

    if (operation === 'cancellation') {
        const body: IDataObject = {
            originalInvoiceId: this.getNodeParameter('originalInvoiceId', i),
            reason: this.getNodeParameter('reason', i),
            reasonDescription: this.getNodeParameter('reasonDescription', i),
            fullCancellation: true,
        };
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/invoices/cancellation', body);
    }

    if (operation === 'createXInvoice') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/xinvoice`);
    }

    if (operation === 'createZugferd') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/zugferd`);
    }

    if (operation === 'getDashboard') {
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/dashboard`);
    }

    if (operation === 'markAsPaid') {
        const body: IDataObject = {
            paymentDate: this.getNodeParameter('paymentDate', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/paid`, body);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/restore`);
    }

    if (operation === 'revertCommitted') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/revert-committed`);
    }

    if (operation === 'send') {
        const sendOptions = this.getNodeParameter('sendOptions', i, {}) as IDataObject;
        const connectionId = this.getNodeParameter('connectionId', i) as number;
        const body: IDataObject = {
            recipientEmail: this.getNodeParameter('recipientEmail', i),
            connectionId,
            mailProvider: await resolveMailProvider(this, connectionId),
        };
        if (sendOptions.recipientName) body.recipientName = sendOptions.recipientName;
        if (sendOptions.subject) body.subject = sendOptions.subject;
        if (sendOptions.customMessage) body.customMessage = sendOptions.customMessage;
        if (sendOptions.cc) body.cc = parseJsonParam(sendOptions.cc);
        if (sendOptions.bcc) body.bcc = parseJsonParam(sendOptions.bcc);
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/send-by-mail`, body);
    }

    if (operation === 'validateXInvoice') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/invoices/${requireId(this, 'invoiceId', i)}/validate-xinvoice`);
    }

}

export async function executeTaxRate(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/taxrates/${requireId(this, 'taxRateId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', '/invoicing/taxrates', {}, {}, limit);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            rate: this.getNodeParameter('rate', i),
            countryCode: this.getNodeParameter('countryCode', i),
            isDefault: this.getNodeParameter('isDefault', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/taxrates/new', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/invoicing/taxrates/${requireId(this, 'taxRateId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/invoicing/taxrates/${requireId(this, 'taxRateId', i)}`);
    }

    if (operation === 'deleteMany') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/taxrates/delete-many', body);
    }

}

export async function executeSalesTaxRegulation(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/sales-tax-regulations/${requireId(this, 'salesTaxRegulationId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', '/invoicing/sales-tax-regulations', {}, {}, limit);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            transactionType: this.getNodeParameter('transactionType', i),
            regulationText: this.getNodeParameter('regulationText', i),
            rate: this.getNodeParameter('rate', i),
            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/sales-tax-regulations/new', body);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/invoicing/sales-tax-regulations/${requireId(this, 'salesTaxRegulationId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/invoicing/sales-tax-regulations/${requireId(this, 'salesTaxRegulationId', i)}`);
    }

    if (operation === 'deleteMany') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/sales-tax-regulations/delete-many', body);
    }

}

export async function executeIncomingPayment(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'getByInvoice') {
        const invoiceId = requireId(this, 'invoiceId', i);
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/payments/invoice/${invoiceId}`);
    }

    if (operation === 'total') {
        const invoiceId = requireId(this, 'invoiceId', i);
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/payments/invoice/${invoiceId}/total`);
    }

    if (operation === 'createForInvoice') {
        const invoiceId = requireId(this, 'invoiceId', i);
        const additional = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
        const body: IDataObject = {
            amount: this.getNodeParameter('amount', i),
            paymentDate: this.getNodeParameter('paymentDate', i),
            ...additional,
        };
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/payments/create-for-invoice/${invoiceId}`, body);
    }

    if (operation === 'delete') {
        const paymentId = requireId(this, 'paymentId', i);
        return cashwerkApiRequest.call(this, 'DELETE', `/invoicing/payments/${paymentId}`);
    }

}

export async function executeCancellationInvoice(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/invoicing/cancellation-invoices/${requireId(this, 'cancellationInvoiceId', i)}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', '/invoicing/cancellation-invoices/query', { ...filters }, {}, limit);
    }

    if (operation === 'update') {
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/invoicing/cancellation-invoices/${requireId(this, 'cancellationInvoiceId', i)}`, body);
    }

    if (operation === 'archive') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/cancellation-invoices/${requireId(this, 'cancellationInvoiceId', i)}/archive`);
    }

    if (operation === 'createXInvoice') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/cancellation-invoices/${requireId(this, 'cancellationInvoiceId', i)}/xinvoice`);
    }

    if (operation === 'createZugferd') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/cancellation-invoices/${requireId(this, 'cancellationInvoiceId', i)}/zugferd`);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            originalInvoiceId: this.getNodeParameter('originalInvoiceId', i),
            reason: this.getNodeParameter('reason', i),
            reasonDescription: this.getNodeParameter('reasonDescription', i),
            fullCancellation: true,
        };
        return cashwerkApiRequest.call(this, 'POST', '/invoicing/cancellation-invoices', body);
    }

    if (operation === 'restore') {
        return cashwerkApiRequest.call(this, 'POST', `/invoicing/cancellation-invoices/${requireId(this, 'cancellationInvoiceId', i)}/restore`);
    }

}
