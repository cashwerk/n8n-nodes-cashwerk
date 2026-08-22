import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import { cashwerkApiRequest, cleanCollection, encodeParam, requireId } from '../GenericFunctions';

export async function executeChat(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		// GET /chat/conversations uses cursor-based pagination (cursor/limit query params).
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
		const qs: IDataObject = {};
		if (filters.type) qs.type = filters.type;
		if (filters.archived !== undefined && filters.archived !== '') qs.archived = filters.archived;
		if (filters.cursor) qs.cursor = filters.cursor;
		if (filters.limit) qs.limit = filters.limit;
		if (!returnAll && qs.limit === undefined) {
			qs.limit = this.getNodeParameter('limit', i) as number;
		}
		return cashwerkApiRequest.call(this, 'GET', '/chat/conversations', {}, qs);
	}

	if (operation === 'create') {
		// POST /chat/conversations/direct — opens (or returns) a 1:1 conversation.
		const targetUserId = this.getNodeParameter('targetUserId', i) as number;
		return cashwerkApiRequest.call(this, 'POST', '/chat/conversations/direct', {
			targetUserId,
		});
	}

	if (operation === 'update') {
		// PATCH /chat/conversations/{id} — e.g. rename a group conversation.
		const id = encodeParam(requireId(this, 'id', i));
		const body: IDataObject = {};
		const name = this.getNodeParameter('name', i, '') as string;
		if (name) body.name = name;
		return cashwerkApiRequest.call(this, 'PATCH', `/chat/conversations/${id}`, body);
	}

	if (operation === 'delete') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'DELETE', `/chat/conversations/${id}`);
	}

	if (operation === 'archive') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'PATCH', `/chat/conversations/${id}/archive`);
	}

	if (operation === 'participants') {
		// POST /chat/conversations/{id}/participants — add a user to a group conversation.
		const id = encodeParam(requireId(this, 'id', i));
		const options = this.getNodeParameter('options', i, {}) as IDataObject;
		return cashwerkApiRequest.call(this, 'POST', `/chat/conversations/${id}/participants`, {
			userId: options.userId,
		});
	}

	if (operation === 'read') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'POST', `/chat/conversations/${id}/read`);
	}

	if (operation === 'sendMessage') {
		// POST /chat/conversations/{id}/messages
		const body = cleanCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'attachmentIds',
			'mentionedUserIds',
		]);
		return cashwerkApiRequest.call(
			this,
			'POST',
			`/chat/conversations/${encodeParam(this.getNodeParameter('id', i) as string)}/messages`,
			body,
		);
	}

	throw new Error(`Unknown operation: ${operation}`);
}
