import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId, requireId } from '../GenericFunctions';

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

function sanitizeCollection(raw: IDataObject): IDataObject {
    const clean: IDataObject = {};
    for (const [key, val] of Object.entries(raw)) {
        if (isNonEmpty(val)) clean[key] = val;
    }
    return clean;
}

export async function executeCalendarEvent(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/calendar-events/${requireId(this, 'calendarEventId', i)}`);
    }

    if (operation === 'getAll') {
        const filters = sanitizeCollection(this.getNodeParameter('filters', i, {}) as IDataObject);
        return cashwerkApiRequest.call(this, 'POST', '/calendar-events/query', filters);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            title: this.getNodeParameter('title', i),
            start: this.getNodeParameter('start', i),
            end: this.getNodeParameter('end', i),
            ...sanitizeCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/calendar-events', body);
    }

    if (operation === 'update') {
        const body = sanitizeCollection(this.getNodeParameter('updateFields', i, {}) as IDataObject);
        return cashwerkApiRequest.call(this, 'PUT', `/calendar-events/${requireId(this, 'calendarEventId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/calendar-events/${requireId(this, 'calendarEventId', i)}`);
    }

    if (operation === 'checkBusy') {
        const qs: IDataObject = {
            userId: this.getNodeParameter('userId', i),
            start: this.getNodeParameter('start', i),
            end: this.getNodeParameter('end', i),
        };
        const options = this.getNodeParameter('checkBusyOptions', i, {}) as IDataObject;
        if (isNonEmpty(options.excludeEventId)) qs.excludeEventId = options.excludeEventId;
        return cashwerkApiRequest.call(this, 'GET', '/calendar-events/check-busy', {}, qs);
    }

    if (operation === 'updateResponse') {
        const body: IDataObject = {
            response: this.getNodeParameter('response', i),
            userId: this.getNodeParameter('userId', i),
        };
        return cashwerkApiRequest.call(this, 'PATCH', `/calendar-events/${requireId(this, 'calendarEventId', i)}/response`, body);
    }

}

export async function executeCalendar(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        return cashwerkApiRequest.call(this, 'GET', `/calendars/${requireId(this, 'calendarId', i)}`);
    }

    if (operation === 'getAll') {
        return cashwerkApiRequest.call(this, 'GET', '/calendars');
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i),
            ...sanitizeCollection(this.getNodeParameter('additionalFields', i, {}) as IDataObject),
        };
        return cashwerkApiRequest.call(this, 'POST', '/calendars', body);
    }

    if (operation === 'update') {
        const body = sanitizeCollection(this.getNodeParameter('updateFields', i, {}) as IDataObject);
        return cashwerkApiRequest.call(this, 'PUT', `/calendars/${requireId(this, 'calendarId', i)}`, body);
    }

    if (operation === 'delete') {
        return cashwerkApiRequest.call(this, 'DELETE', `/calendars/${requireId(this, 'calendarId', i)}`);
    }

}
