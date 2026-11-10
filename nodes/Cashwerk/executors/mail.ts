import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { cashwerkApiRequest, encodeParam, requireId } from '../GenericFunctions';
import { resolveMailProvider } from './invoicing';

const BASE = '/mailing/compose';

function addressList(raw: unknown): string[] {
	return String(raw ?? '')
		.split(',')
		.map((address) => address.trim())
		.filter(Boolean);
}

function idList(raw: unknown): number[] {
	return addressList(raw)
		.map(Number)
		.filter((id) => Number.isInteger(id) && id > 0);
}

/** Recipients, text and the optional envelope, shared by Send and Update. */
function envelope(ctx: IExecuteFunctions, i: number, options: IDataObject): IDataObject {
	const body: IDataObject = {
		to: addressList(ctx.getNodeParameter('to', i)),
		subject: ctx.getNodeParameter('subject', i),
		message: ctx.getNodeParameter('message', i, ''),
	};
	if (options.cc) body.cc = addressList(options.cc);
	if (options.bcc) body.bcc = addressList(options.bcc);
	if (options.driveFileIds) body.driveFileIds = idList(options.driveFileIds);
	if (options.scheduledAt) body.scheduledAt = new Date(String(options.scheduledAt)).toISOString();
	if (options.copyToSelf) body.copyToSelf = true;
	return body;
}

export async function executeMail(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'send') {
		const options = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const connectionId = Number(this.getNodeParameter('connectionId', i));
		const body: IDataObject = {
			...envelope(this, i, options),
			connectionId,
			mailProvider: await resolveMailProvider(this, connectionId),
		};
		if (options.recordType && options.recordId) {
			body.recordType = options.recordType;
			body.recordId = Number(options.recordId);
		}
		if (options.referenceType && options.referenceId) {
			body.referenceType = options.referenceType;
			body.referenceId = Number(options.referenceId);
		}
		return cashwerkApiRequest.call(this, 'POST', BASE, body);
	}

	if (operation === 'update') {
		const options = this.getNodeParameter('updateFields', i, {}) as IDataObject;
		return cashwerkApiRequest.call(this, 'PUT', `${BASE}/${requireId(this, 'mailId', i)}`, envelope(this, i, options));
	}

	if (operation === 'get') {
		return cashwerkApiRequest.call(this, 'GET', `${BASE}/${requireId(this, 'mailId', i)}`);
	}

	if (operation === 'getHistory') {
		const recordType = encodeParam(this.getNodeParameter('recordType', i) as string);
		return cashwerkApiRequest.call(this, 'GET', `${BASE}/records/${recordType}/${requireId(this, 'recordId', i)}`);
	}

	if (operation === 'getLimits') {
		return cashwerkApiRequest.call(this, 'GET', `${BASE}/limits`);
	}

	if (operation === 'cancel' || operation === 'sendNow' || operation === 'resend') {
		const action = { cancel: 'cancel', sendNow: 'send-now', resend: 'resend' }[operation];
		return cashwerkApiRequest.call(this, 'POST', `${BASE}/${requireId(this, 'mailId', i)}/${action}`);
	}

	throw new Error(`Unsupported Mail operation: ${operation}`);
}
