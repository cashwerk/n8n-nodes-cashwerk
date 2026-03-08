import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId, encodeParam, parseJsonParam, requireId, toTimestamp } from '../GenericFunctions';


export async function executeTimeTracking(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    if (operation === 'get') {
        const userId = requireId(this, 'userId', i);
        const date = this.getNodeParameter('date', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/time-tracking/${userId}/trackings/date/${toTimestamp(date)}`);
    }


    if (operation === 'update') {
        const id = requireId(this, 'timeTrackingId', i);
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        if (body.assignedUserIds) {
            body.assignedUserIds = parseJsonParam(body.assignedUserIds, []);
        }
        if (body.tagIds) {
            body.tagIds = parseJsonParam(body.tagIds, []);
        }
        return cashwerkApiRequest.call(this, 'PATCH', `/work-manager/time-tracking/trackings/${id}`, body);
    }

    if (operation === 'breaks') {
        const body: IDataObject = {
            start: this.getNodeParameter('start', i),
            end: this.getNodeParameter('end', i),
            trackingId: this.getNodeParameter('trackingId', i),
            assignedUserIds: parseJsonParam(this.getNodeParameter('assignedUserIds', i, '{}')),
        };
        return cashwerkApiRequest.call(this, 'POST', '/work-manager/time-tracking/breaks', body);
    }

    if (operation === 'getByDateRange') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        const filters = this.getNodeParameter('additionalFilters', i, {}) as IDataObject;
        const results = await cashwerkApiRequest.call(this, 'GET', `/work-manager/time-tracking/${userId}/trackings/range/${toTimestamp(start)}/${toTimestamp(end)}`);
        if (filters.taskId) {
            const items = Array.isArray(results) ? results : [results];
            return items.filter((t: Record<string, unknown>) => String(t.taskId) === String(filters.taskId));
        }
        return results;
    }

    if (operation === 'getRunning') {
        const userId = requireId(this, 'userId', i);
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/time-tracking/${userId}/tracker/running`);
    }

    if (operation === 'pauseTracker') {
        const userId = requireId(this, 'userId', i);
        const trackerId = requireId(this, 'trackerId', i);
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/time-tracking/${userId}/tracker/${trackerId}/pause`);
    }

    if (operation === 'resumeTracker') {
        const userId = requireId(this, 'userId', i);
        const trackerId = requireId(this, 'trackerId', i);
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/time-tracking/${userId}/tracker/${trackerId}/resume`);
    }

    if (operation === 'startTracker') {
        const userId = requireId(this, 'userId', i);
        const body: IDataObject = {
            startTime: new Date().toISOString(),
            fromTrackingId: this.getNodeParameter('fromTrackingId', i),
            taskId: this.getNodeParameter('taskId', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/time-tracking/${userId}/tracker/start`, body);
    }

    if (operation === 'stopTracker') {
        const userId = requireId(this, 'userId', i);
        const trackerId = requireId(this, 'trackerId', i);
        const body: IDataObject = {
            end: new Date().toISOString(),
        };
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/time-tracking/${userId}/tracker/${trackerId}/stop`, body);
    }

    if (operation === 'trackings') {
        const body = this.getNodeParameter('options', i, {}) as IDataObject;
        if (body.assignedUserIds) {
            body.assignedUserIds = parseJsonParam(body.assignedUserIds, []);
        }
        if (body.tagIds) {
            body.tagIds = parseJsonParam(body.tagIds, []);
        }
        return cashwerkApiRequest.call(this, 'POST', '/work-manager/time-tracking/trackings', body);
    }

}

export async function executeTrackingCategory(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        const id = requireId(this, 'trackingCategoryId', i);
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/time-tracking/categories/${id}`);
    }

    if (operation === 'getAll') {
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', '/work-manager/time-tracking/categories', {}, {}, limit);
    }

    if (operation === 'update') {
        const id = requireId(this, 'trackingCategoryId', i);
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/work-manager/time-tracking/categories/${id}`, body);
    }

    if (operation === 'create') {
        const body: IDataObject = {
            name: this.getNodeParameter('name', i) as string,
        };
        return cashwerkApiRequest.call(this, 'POST', '/work-manager/time-tracking/categories', body);
    }

}

export async function executeAbsence(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        const id = requireId(this, 'absenceId', i);
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/absence-planner/absences/${id}`);
    }

    if (operation === 'getAll') {
        const userId = requireId(this, 'userId', i);
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', `/work-manager/absence-planner/${userId}/absences`, {}, {}, limit);
    }

    if (operation === 'update') {
        const id = requireId(this, 'absenceId', i);
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        return cashwerkApiRequest.call(this, 'PATCH', `/work-manager/absence-planner/absences/${id}`, body);
    }

    if (operation === 'delete') {
        const id = requireId(this, 'absenceId', i);
        return cashwerkApiRequest.call(this, 'DELETE', `/work-manager/absence-planner/absences/${id}`);
    }

    if (operation === 'create') {
        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
        additionalFields.assignedUserIds = parseJsonParam(additionalFields.assignedUserIds, []);
        const body: IDataObject = {
            type: this.getNodeParameter('type', i),
            start: this.getNodeParameter('start', i),
            end: this.getNodeParameter('end', i),
            ...additionalFields,
        };
        return cashwerkApiRequest.call(this, 'POST', '/work-manager/absence-planner/absences', body);
    }

    if (operation === 'approve') {
        const id = requireId(this, 'absenceId', i);
        const body: IDataObject = {
            comment: this.getNodeParameter('comment', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/absence-planner/absences/${id}/approve`, body);
    }

    if (operation === 'getByDateRange') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/absence-planner/${userId}/absences/meta/range/${toTimestamp(start)}/${toTimestamp(end)}`);
    }

    if (operation === 'getMeta') {
        const userId = requireId(this, 'userId', i);
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/absence-planner/${userId}/absences/meta`);
    }

    if (operation === 'getPending') {
        return cashwerkApiRequest.call(this, 'GET', '/work-manager/absence-planner/organization/pending');
    }

    if (operation === 'reject') {
        const id = requireId(this, 'absenceId', i);
        const body: IDataObject = {
            comment: this.getNodeParameter('comment', i),
        };
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/absence-planner/absences/${id}/reject`, body);
    }

}

export async function executeShiftPlan(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    if (operation === 'get') {
        const id = requireId(this, 'shiftPlanId', i);
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/shift-planner/plans/${id}`);
    }

    if (operation === 'getAll') {
        const userId = requireId(this, 'userId', i);
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        return cashwerkApiRequestAllItems.call(this, 'GET', `/work-manager/shift-planner/${userId}/plans`, {}, {}, limit);
    }

    if (operation === 'update') {
        const id = requireId(this, 'shiftPlanId', i);
        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;
        if (body.tagIds) {
            body.tagIds = parseJsonParam(body.tagIds, []);
        }
        if (body.address) {
            body.address = parseJsonParam(body.address, {});
        }
        return cashwerkApiRequest.call(this, 'PATCH', `/work-manager/shift-planner/plans/${id}`, body);
    }

    if (operation === 'delete') {
        const id = requireId(this, 'shiftPlanId', i);
        await cashwerkApiRequest.call(this, 'DELETE', `/work-manager/shift-planner/plans/${id}`);
        return { success: true, deleted: true, id: Number(id) };
    }

    if (operation === 'duplicate') {
        const id = requireId(this, 'shiftPlanId', i);
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/shift-planner/plans/${id}/duplicate`);
    }

    if (operation === 'getByDateRange') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/shift-planner/${userId}/plans/range/${toTimestamp(start)}/${toTimestamp(end)}`);
    }

    if (operation === 'create') {
        const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
        if (additionalFields.assignedUserIds) {
            additionalFields.assignedUserIds = parseJsonParam(additionalFields.assignedUserIds, []);
        }
        if (additionalFields.tagIds) {
            additionalFields.tagIds = parseJsonParam(additionalFields.tagIds, []);
        }
        if (additionalFields.address) {
            additionalFields.address = parseJsonParam(additionalFields.address, {});
        }
        const body: IDataObject = {
            start: this.getNodeParameter('start', i),
            ...additionalFields,
        };
        return cashwerkApiRequest.call(this, 'POST', '/work-manager/shift-planner/plans', body);
    }

}

export async function executeWorkReport(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
    const orgId = await getOrganizationId.call(this);

    // ── User Summary (aggregated tracking meta by date range) ──
    if (operation === 'getUserSummary') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/reports/user/${userId}/meta/${toTimestamp(start)}/${toTimestamp(end)}`);
    }

    // ── User Report (full work report by date range) ──
    if (operation === 'getUserReport') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/reports/user/${userId}/range/${toTimestamp(start)}/${toTimestamp(end)}`);
    }

    // ── User Monthly Summary (by year & month) ──
    if (operation === 'getUserMonthly') {
        const userId = requireId(this, 'userId', i);
        const year = this.getNodeParameter('year', i) as number;
        const month = (this.getNodeParameter('month', i) as number) - 1;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/reports/user/${userId}/${encodeParam(year)}/${encodeParam(month)}`);
    }

    // ── User Weekly Stats (breakdown by year & month, for charts) ──
    if (operation === 'getWeekStats') {
        const userId = requireId(this, 'userId', i);
        const year = this.getNodeParameter('year', i) as number;
        const month = (this.getNodeParameter('month', i) as number) - 1;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/reports/user/${userId}/${encodeParam(year)}/${encodeParam(month)}/weekstats`);
    }

    // ── Query User Trackings (search with filters) ──
    if (operation === 'queryTrackings') {
        const userId = requireId(this, 'userId', i);
        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);
        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;
        return cashwerkApiRequestAllItems.call(this, 'POST', `/work-manager/reports/${userId}/trackings/query`, { ...filters }, {}, limit);
    }

    // ── Get Working Days (vacation calculation) ──
    if (operation === 'getWorkingDays') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/reports/user/${userId}/workingdays/${toTimestamp(start)}/${toTimestamp(end)}`);
    }

    // ── Organization Summary (org-level aggregated meta) ──
    if (operation === 'getOrgSummary') {
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        return cashwerkApiRequest.call(this, 'GET', `/work-manager/reports/organization/meta/${toTimestamp(start)}/${toTimestamp(end)}`);
    }

    // ── Organization Report (full org report with all users) ──
    if (operation === 'getOrgReport') {
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        const options = this.getNodeParameter('options', i, {}) as IDataObject;
        if (options.userIds) {
            options.userIds = parseJsonParam(options.userIds, []);
        }
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/reports/organization/${orgId}/range/${toTimestamp(start)}/${toTimestamp(end)}`, options);
    }

    // ── Export CSV ──
    if (operation === 'exportCsv') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        const options = this.getNodeParameter('exportOptions', i, {}) as IDataObject;
        const body: IDataObject = {
            startDate: Number(toTimestamp(start)),
            endDate: Number(toTimestamp(end)),
            ...options,
        };
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/reports/user/${userId}/export/csv`, body);
    }

    // ── Export PDF ──
    if (operation === 'exportPdf') {
        const userId = requireId(this, 'userId', i);
        const start = this.getNodeParameter('start', i) as string;
        const end = this.getNodeParameter('end', i) as string;
        const options = this.getNodeParameter('exportOptions', i, {}) as IDataObject;
        const body: IDataObject = {
            startDate: Number(toTimestamp(start)),
            endDate: Number(toTimestamp(end)),
            ...options,
        };
        return cashwerkApiRequest.call(this, 'POST', `/work-manager/reports/user/${userId}/export/pdf`, body);
    }

}
