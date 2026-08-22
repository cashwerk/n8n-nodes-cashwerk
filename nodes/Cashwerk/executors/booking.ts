import { IExecuteFunctions, IDataObject } from 'n8n-workflow';

import { cashwerkApiRequest, encodeParam, parseJsonParam, requireId } from '../GenericFunctions';

function isNonEmpty(val: unknown): boolean {
	if (val === undefined || val === null || val === '') return false;
	if (typeof val === 'string') {
		const trimmed = val.trim();
		return trimmed !== '' && trimmed !== '{}' && trimmed !== '[]';
	}
	if (typeof val === 'object' && Object.keys(val as Record<string, unknown>).length === 0)
		return false;
	return true;
}

/** Drop empty collection entries and parse json-typed fields so the API receives real objects. */
function sanitizeCollection(raw: IDataObject, jsonKeys: string[] = []): IDataObject {
	const clean: IDataObject = {};
	for (const [key, val] of Object.entries(raw)) {
		if (!isNonEmpty(val)) continue;
		clean[key] = jsonKeys.includes(key) ? parseJsonParam(val) : val;
	}
	return clean;
}

function applyLimit(this: IExecuteFunctions, qs: IDataObject, i: number): void {
	const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
	if (!returnAll && qs.limit === undefined) {
		qs.limit = this.getNodeParameter('limit', i, 50) as number;
	}
}

export async function executeBooking(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'GET', `/booking/bookings/${id}`);
	}

	if (operation === 'getAll') {
		// GET /booking/bookings — offset pagination via limit/offset query params.
		const qs = sanitizeCollection(this.getNodeParameter('filters', i, {}) as IDataObject);
		applyLimit.call(this, qs, i);
		return cashwerkApiRequest.call(this, 'GET', '/booking/bookings', {}, qs);
	}

	if (operation === 'create') {
		// POST /booking/bookings/staff — host-side booking on behalf of an invitee.
		const body: IDataObject = {
			eventTypeId: this.getNodeParameter('eventTypeId', i),
			inviteeEmail: this.getNodeParameter('inviteeEmail', i),
			inviteeName: this.getNodeParameter('inviteeName', i),
			startAt: this.getNodeParameter('startAt', i),
			timezone: this.getNodeParameter('timezone', i),
			...sanitizeCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject, [
				'formResponses',
			]),
		};
		return cashwerkApiRequest.call(this, 'POST', '/booking/bookings/staff', body);
	}

	if (operation === 'cancel') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'POST', `/booking/bookings/${id}/cancel`);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

export async function executeBookingDateOverride(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getAll') {
		const qs = sanitizeCollection(this.getNodeParameter('filters', i, {}) as IDataObject);
		return cashwerkApiRequest.call(this, 'GET', '/booking/date-overrides', {}, qs);
	}

	if (operation === 'create') {
		const body: IDataObject = {
			date: this.getNodeParameter('date', i),
			isUnavailable: this.getNodeParameter('isUnavailable', i),
			timezone: this.getNodeParameter('timezone', i),
			...sanitizeCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
		};
		return cashwerkApiRequest.call(this, 'POST', '/booking/date-overrides', body);
	}

	if (operation === 'delete') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'DELETE', `/booking/date-overrides/${id}`);
	}

	if (operation === 'uploadBatch') {
		// PUT /booking/date-overrides/batch — replaces the override set for an event type.
		const body = sanitizeCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'overrides',
		]);
		return cashwerkApiRequest.call(this, 'PUT', '/booking/date-overrides/batch', body);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

const EVENT_TYPE_JSON_FIELDS = ['hosts', 'hostUserIds', 'reminderOffsetsMinutes'];

export async function executeBookingEventType(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'getByPage') {
		// GET /booking/event-types/by-page/{pageId} — all event types of a booking page.
		const pageId = encodeParam(requireId(this, 'pageId', i));
		return cashwerkApiRequest.call(this, 'GET', `/booking/event-types/by-page/${pageId}`);
	}

	if (operation === 'create') {
		const body: IDataObject = {
			durationMinutes: this.getNodeParameter('durationMinutes', i),
			pageId: this.getNodeParameter('pageId', i),
			slug: this.getNodeParameter('slug', i),
			title: this.getNodeParameter('title', i),
			...sanitizeCollection(
				this.getNodeParameter('additionalFields', i, {}) as IDataObject,
				EVENT_TYPE_JSON_FIELDS,
			),
		};
		return cashwerkApiRequest.call(this, 'POST', '/booking/event-types', body);
	}

	if (operation === 'update') {
		const id = encodeParam(requireId(this, 'id', i));
		const body = sanitizeCollection(
			this.getNodeParameter('updateFields', i, {}) as IDataObject,
			EVENT_TYPE_JSON_FIELDS,
		);
		return cashwerkApiRequest.call(this, 'PUT', `/booking/event-types/${id}`, body);
	}

	if (operation === 'delete') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'DELETE', `/booking/event-types/${id}`);
	}

	if (operation === 'availability') {
		// PUT /booking/event-types/{id}/availability — replaces the weekly availability rules.
		const id = encodeParam(requireId(this, 'id', i));
		const body = sanitizeCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'rules',
		]);
		return cashwerkApiRequest.call(this, 'PUT', `/booking/event-types/${id}/availability`, body);
	}

	if (operation === 'formFields') {
		// PUT /booking/event-types/{id}/form-fields — replaces the invitee form definition.
		const id = encodeParam(requireId(this, 'id', i));
		const body = sanitizeCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'fields',
		]);
		return cashwerkApiRequest.call(this, 'PUT', `/booking/event-types/${id}/form-fields`, body);
	}

	throw new Error(`Unknown operation: ${operation}`);
}

export async function executeBookingPage(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<IDataObject | IDataObject[]> {
	if (operation === 'get') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'GET', `/booking/pages/${id}`);
	}

	if (operation === 'getAll') {
		// GET /booking/pages returns the full list; limit is applied client-side.
		const pages = (await cashwerkApiRequest.call(this, 'GET', '/booking/pages')) as unknown;
		const list = Array.isArray(pages) ? (pages as IDataObject[]) : [];
		const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
		if (returnAll || !Array.isArray(pages)) return pages as IDataObject | IDataObject[];
		return list.slice(0, this.getNodeParameter('limit', i, 50) as number);
	}

	if (operation === 'create') {
		const body: IDataObject = {
			slug: this.getNodeParameter('slug', i),
			title: this.getNodeParameter('title', i),
			...sanitizeCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject, [
				'pageType',
			]),
		};
		return cashwerkApiRequest.call(this, 'POST', '/booking/pages', body);
	}

	if (operation === 'update') {
		const id = encodeParam(requireId(this, 'id', i));
		const body = sanitizeCollection(this.getNodeParameter('updateFields', i, {}) as IDataObject, [
			'pageType',
		]);
		return cashwerkApiRequest.call(this, 'PUT', `/booking/pages/${id}`, body);
	}

	if (operation === 'delete') {
		const id = encodeParam(requireId(this, 'id', i));
		return cashwerkApiRequest.call(this, 'DELETE', `/booking/pages/${id}`);
	}

	if (operation === 'shareLinks') {
		// With options set → POST creates a share link; without → GET lists existing links.
		const id = encodeParam(requireId(this, 'id', i));
		const body = sanitizeCollection(this.getNodeParameter('options', i, {}) as IDataObject);
		if (Object.keys(body).length === 0) {
			return cashwerkApiRequest.call(this, 'GET', `/booking/pages/${id}/share-links`);
		}
		return cashwerkApiRequest.call(this, 'POST', `/booking/pages/${id}/share-links`, body);
	}

	if (operation === 'theme') {
		const id = encodeParam(requireId(this, 'id', i));
		const body = sanitizeCollection(this.getNodeParameter('options', i, {}) as IDataObject, [
			'buttonStyle',
		]);
		return cashwerkApiRequest.call(this, 'PUT', `/booking/pages/${id}/theme`, body);
	}

	throw new Error(`Unknown operation: ${operation}`);
}
