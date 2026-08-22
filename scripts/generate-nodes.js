#!/usr/bin/env node
/**
 * n8n Node Generator from OpenAPI Spec
 *
 * Reads the cashwerk external API OpenAPI spec and generates:
 * - Description files for each resource (nodes/Cashwerk/descriptions/)
 * - Executor files grouped by domain (nodes/Cashwerk/executors/)
 * - Updated Cashwerk.node.ts main file
 */

const fs = require('fs');
const path = require('path');

const API_PREFIX = '/api/v1';
const SPEC_PATH = path.join(__dirname, 'openapi-external.json');
const DESCRIPTIONS_DIR = path.join(__dirname, '..', 'nodes', 'Cashwerk', 'descriptions');
const EXECUTORS_DIR = path.join(__dirname, '..', 'nodes', 'Cashwerk', 'executors');
const NODE_DIR = path.join(__dirname, '..', 'nodes', 'Cashwerk');

const spec = JSON.parse(fs.readFileSync(SPEC_PATH, 'utf8'));

// ─── Tag Configuration ──────────────────────────────────────────────────
const TAG_CONFIG = {
    'Contacts':               { resource: 'contact',             displayName: 'Contact',              descFile: 'ContactDescription',             domain: 'crm',              needsOrgId: true },
    'Companies':              { resource: 'company',             displayName: 'Company',              descFile: 'CompanyDescription',             domain: 'crm',              needsOrgId: true },
    'Portfolios':             { resource: 'portfolio',           displayName: 'Portfolio',            descFile: 'PortfolioDescription',           domain: 'crm' },
    'CRM Metrics':            { resource: 'crmMetrics',          displayName: 'CRM Metrics',          descFile: 'CrmMetricsDescription',          domain: 'crm',              needsOrgId: true },
    'Invoices':               { resource: 'invoice',             displayName: 'Invoice',              descFile: 'InvoiceDescription',             domain: 'invoicing' },
    'Offers':                 { resource: 'offer',               displayName: 'Offer',                descFile: 'OfferDescription',               domain: 'invoicing' },
    'Cancellation Invoices':  { resource: 'cancellationInvoice', displayName: 'Cancellation Invoice', descFile: 'CancellationInvoiceDescription', domain: 'invoicing' },
    'Tax Rates':              { resource: 'taxRate',             displayName: 'Tax Rate',             descFile: 'TaxRateDescription',             domain: 'invoicing' },
    'Sales Tax Regulations':  { resource: 'salesTaxRegulation',  displayName: 'Sales Tax Regulation', descFile: 'SalesTaxRegulationDescription',  domain: 'invoicing' },
    'Payments':               { resource: 'incomingPayment',     displayName: 'Incoming Payment',     descFile: 'IncomingPaymentDescription',     domain: 'invoicing' },
    'Deals':                  { resource: 'deal',                displayName: 'Deal',                 descFile: 'DealDescription',                domain: 'salesPipeline' },
    'Pipelines':              { resource: 'pipeline',            displayName: 'Pipeline',             descFile: 'PipelineDescription',            domain: 'salesPipeline' },
    'Projects':               { resource: 'project',             displayName: 'Project',              descFile: 'ProjectDescription',             domain: 'projectManager' },
    'Tasks':                  { resource: 'task',                displayName: 'Task',                 descFile: 'TaskDescription',                domain: 'taskManager' },
    'Task Boards':            { resource: 'taskBoard',           displayName: 'Task Board',           descFile: 'TaskBoardDescription',           domain: 'taskManager' },
    'Task Board Columns':     { resource: 'taskBoardColumn',     displayName: 'Task Board Column',    descFile: 'TaskBoardColumnDescription',     domain: 'taskManager' },
    'Task Comments':          { resource: 'taskComment',         displayName: 'Task Comment',         descFile: 'TaskCommentDescription',         domain: 'taskManager' },
    'Time Tracking':          { resource: 'timeTracking',        displayName: 'Time Tracking',        descFile: 'TimeTrackingDescription',        domain: 'workManager' },
    'Tracking Categories':    { resource: 'trackingCategory',    displayName: 'Tracking Category',    descFile: 'TrackingCategoryDescription',    domain: 'workManager' },
    'Work Reports':           { resource: 'workReport',          displayName: 'Work Report',          descFile: 'WorkReportDescription',          domain: 'workManager' },
    'Shift Planner':          { resource: 'shiftPlan',           displayName: 'Shift Plan',           descFile: 'ShiftPlanDescription',           domain: 'workManager' },
    'Absence Planner':        { resource: 'absence',             displayName: 'Absence',              descFile: 'AbsenceDescription',             domain: 'workManager' },
    'Calendar Events':        { resource: 'calendarEvent',       displayName: 'Calendar Event',       descFile: 'CalendarEventDescription',       domain: 'calendar' },
    'Calendars':              { resource: 'calendar',            displayName: 'Calendar',             descFile: 'CalendarDescription',            domain: 'calendar' },
    'Asset Materials':        { resource: 'material',            displayName: 'Material',             descFile: 'MaterialDescription',            domain: 'assetManager',     needsOrgId: true },
    'Asset Machines':         { resource: 'machine',             displayName: 'Machine',              descFile: 'MachineDescription',             domain: 'assetManager',     needsOrgId: true },
    'Asset Services':         { resource: 'assetService',        displayName: 'Asset Service',        descFile: 'AssetServiceDescription',        domain: 'assetManager',     needsOrgId: true },
    'Asset Subcontracts':     { resource: 'subcontract',         displayName: 'Subcontract',          descFile: 'SubcontractDescription',         domain: 'assetManager',     needsOrgId: true },
    'Asset Units':            { resource: 'assetUnit',           displayName: 'Asset Unit',           descFile: 'AssetUnitDescription',           domain: 'assetManager',     needsOrgId: true },
    'Asset Groups':           { resource: 'assetGroup',          displayName: 'Asset Group',          descFile: 'AssetGroupDescription',          domain: 'assetManager',     needsOrgId: true },
    'Users':                  { resource: 'user',                displayName: 'User',                 descFile: 'UserDescription',                domain: 'users' },
    'Work Time':              { resource: 'workTime',            displayName: 'Work Time',            descFile: 'WorkTimeDescription',            domain: 'users' },
    'Organization':           { resource: 'organization',        displayName: 'Organization',         descFile: 'OrganizationDescription',        domain: 'organization',     needsOrgId: true },
    'Drive':                  { resource: 'drive',               displayName: 'Drive',                descFile: 'DriveDescription',               domain: 'drive' },
    'Drive Files':            { resource: 'driveFile',           displayName: 'Drive File',           descFile: 'DriveFileDescription',           domain: 'drive' },
    'Drive Folders':          { resource: 'driveFolder',         displayName: 'Drive Folder',         descFile: 'DriveFolderDescription',         domain: 'drive' },
    'Drive Sharing':          { resource: 'driveSharing',        displayName: 'Drive Sharing',        descFile: 'DriveSharingDescription',        domain: 'drive' },
};

const SKIP_TAGS = ['API Platform', 'Webhooks'];

// ─── Helpers ─────────────────────────────────────────────────────────────

function resolveSchema(ref) {
    if (!ref) return {};
    const schemaName = ref.replace('#/components/schemas/', '');
    return spec.components?.schemas?.[schemaName] || {};
}

function getSchemaFromBody(operation) {
    const content = operation.requestBody?.content?.['application/json'];
    if (!content?.schema) return null;
    if (content.schema.$ref) return { ...resolveSchema(content.schema.$ref), _ref: content.schema.$ref };
    return content.schema;
}

function mapType(prop) {
    if (!prop) return 'string';
    if (prop.$ref) return 'json';
    if (prop.type === 'integer' || prop.type === 'number') return 'number';
    if (prop.type === 'boolean') return 'boolean';
    if (prop.type === 'array') return 'json';
    if (prop.type === 'object') return 'json';
    return 'string';
}

function camelCase(str) {
    return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

function pascalCase(str) {
    const cc = camelCase(str);
    return cc.charAt(0).toUpperCase() + cc.slice(1);
}

function titleCase(str) {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function stripPrefix(p) {
    return p.startsWith(API_PREFIX) ? p.slice(API_PREFIX.length) : p;
}

// ─── Endpoint Grouping ──────────────────────────────────────────────────

function groupByTag() {
    const groups = {};
    for (const [rawPath, methods] of Object.entries(spec.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
            if (method === 'parameters') continue;
            const tags = operation.tags || ['Untagged'];
            for (const tag of tags) {
                if (SKIP_TAGS.includes(tag)) continue;
                if (!groups[tag]) groups[tag] = [];
                groups[tag].push({
                    method: method.toUpperCase(),
                    path: stripPrefix(rawPath),
                    summary: operation.summary || '',
                    operationId: operation.operationId || '',
                    operation,
                });
            }
        }
    }
    return groups;
}

// ─── Operation Classification ───────────────────────────────────────────

function classifyEndpoint(ep) {
    const { method, path, summary } = ep;
    const segments = path.split('/').filter(Boolean);
    const lastSeg = segments[segments.length - 1];
    const secondLast = segments.length > 1 ? segments[segments.length - 2] : '';
    const hasIdAtEnd = lastSeg.startsWith('{') && lastSeg.endsWith('}');
    const summaryLower = summary.toLowerCase();

    // Query / paginated list endpoints
    if (method === 'POST' && lastSeg === 'query') return { op: 'getAll', label: 'Get Many', action: 'query' };
    if (method === 'POST' && lastSeg === 'search') return { op: 'getAll', label: 'Get Many', action: 'search' };
    if (method === 'GET' && lastSeg === 'search') return { op: 'getAll', label: 'Get Many', action: 'search' };

    // Get by ID
    if (method === 'GET' && hasIdAtEnd && !path.includes('/range/')) return { op: 'get', label: 'Get', action: 'get' };

    // Get all (list)
    if (method === 'GET' && !hasIdAtEnd && !path.includes('/range/') && !path.includes('/meta') &&
        !path.includes('/dashboard') && !path.includes('/preview') && !path.includes('/weekstats') &&
        !path.includes('/search') && !path.includes('/query') && !path.includes('/presets') &&
        !path.includes('/statuses') && !path.includes('/assignees') && !path.includes('/subfolders') &&
        !path.includes('/details') && !path.includes('/size') && !path.includes('/trash') &&
        !path.includes('/contents') && !path.includes('/folders') && !path.includes('/items') &&
        !path.includes('/check-busy') && !path.includes('/single-search') && !path.includes('/total') &&
        !path.includes('/memory') && !path.includes('/running') && !path.includes('/active') &&
        !path.includes('/pending') && !path.includes('/avatar') && !path.includes('/view')) {
        return { op: 'getAll', label: 'Get Many', action: 'list' };
    }

    // Create
    if (method === 'POST' && (lastSeg === 'new' || lastSeg === 'create')) return { op: 'create', label: 'Create', action: 'create' };
    if (method === 'POST' && !hasIdAtEnd && !path.includes('/') && !summaryLower.includes('delete') && !summaryLower.includes('archive')) {
        // POST to root of resource might be create
    }

    // Update
    if (method === 'PATCH' && hasIdAtEnd) return { op: 'update', label: 'Update', action: 'update' };
    if (method === 'PUT' && hasIdAtEnd) return { op: 'update', label: 'Update', action: 'update' };

    // Delete
    if (method === 'DELETE' && hasIdAtEnd) return { op: 'delete', label: 'Delete', action: 'delete' };

    // Bulk delete
    if (lastSeg === 'delete-many') return { op: 'deleteMany', label: 'Delete Many', action: 'deleteMany' };
    if (lastSeg === 'delete-bulk') return { op: 'deleteBulk', label: 'Delete Bulk', action: 'deleteBulk' };

    // Archive / restore
    if (lastSeg === 'archive' && method === 'POST') {
        if (secondLast.startsWith('{')) return { op: 'archive', label: 'Archive', action: 'archive' };
        return { op: 'archiveMany', label: 'Archive Many', action: 'archiveMany' };
    }
    if (lastSeg === 'archive' && method === 'PATCH') return { op: 'archive', label: 'Archive', action: 'archive' };
    if (lastSeg === 'restore' && method === 'POST') {
        if (secondLast.startsWith('{')) return { op: 'restore', label: 'Restore', action: 'restore' };
        return { op: 'restoreMany', label: 'Restore Many', action: 'restoreMany' };
    }
    if (lastSeg === 'restore' && method === 'PATCH') return { op: 'restore', label: 'Restore', action: 'restore' };
    if (lastSeg === 'archive-many') return { op: 'archiveMany', label: 'Archive Many', action: 'archiveMany' };
    if (lastSeg === 'restore-many') return { op: 'restoreMany', label: 'Restore Many', action: 'restoreMany' };

    // Activate
    if (lastSeg === 'activate') return { op: 'activate', label: 'Activate', action: 'activate' };

    // Derive custom operation name from path suffix
    const customName = deriveCustomOp(ep);
    return customName;
}

function deriveCustomOp(ep) {
    const { method, path, summary } = ep;
    const segments = path.split('/').filter(Boolean);
    const lastSeg = segments[segments.length - 1];
    const secondLast = segments.length > 1 ? segments[segments.length - 2] : '';

    // Handle specific patterns
    const pathSuffix = lastSeg.startsWith('{') ? secondLast : lastSeg;

    // Derive from summary
    const cleanSummary = summary.replace(/^(Get|Create|Update|Delete|List|Search|Query)\s+/i, '').trim();

    // Special cases from path
    const opMap = {
        'send-by-mail': 'send', 'book': 'book', 'cancel': 'cancel', 'paid': 'markAsPaid',
        'revert-committed': 'revertCommitted', 'xinvoice': 'createXInvoice', 'zugferd': 'createZugferd',
        'validate-xinvoice': 'validateXInvoice', 'dashboard': 'getDashboard', 'preview': 'getPreview',
        'convert-to-invoice': 'convertToInvoice', 'from-deal': 'createFromDeal',
        'mark-as-completed': 'markAsCompleted', 'mark-as-incompleted': 'markAsIncomplete',
        'update-title': 'updateTitle', 'update-description': 'updateDescription',
        'update-assignee': 'updateAssignee', 'update-due-date': 'updateDueDate',
        'update-position': 'updatePosition', 'update-name': 'updateName',
        'clone': 'clone', 'clone-subtask': 'cloneSubtask', 'duplicate': 'duplicate',
        'create-subtask': 'createSubtask', 'remove-subtask': 'removeSubtask',
        'update-subtask-position': 'updateSubtaskPosition',
        'add-tag': 'addTag', 'remove-tag': 'removeTag',
        'create-comment': 'createComment', 'add-collaborator': 'addCollaborator',
        'remove-collaborator': 'removeCollaborator',
        'companies': method === 'DELETE' ? 'removeCompany' : (method === 'POST' ? 'addCompanies' : 'getCompanies'),
        'contacts': method === 'DELETE' ? 'removeContact' : (method === 'PUT' ? 'addContacts' : (method === 'POST' ? 'addContacts' : 'getContacts')),
        'start': 'startTracker', 'stop': 'stopTracker', 'pause': 'pauseTracker', 'resume': 'resumeTracker',
        'gps': 'updateGps',
        'invite-user': 'inviteUser', 'remove-user': 'removeUser',
        'update-project': 'updateProject', 'create-column': 'createColumn',
        'save-as-preset': 'saveAsPreset', 'create-by-preset': 'createFromPreset',
        'approve': 'approve', 'reject': 'reject',
        'import': 'import', 'import-update': 'importUpdate',
        'logo': 'uploadLogo', 'avatar': 'uploadAvatar', 'image': 'uploadImage', 'header': 'uploadHeader',
        'invoices': 'getInvoices', 'offers': 'getOffers', 'deals': 'getDeals',
        'projects': 'getProjects', 'tasks': 'getTasks',
        'cancellation-invoices': 'getCancellationInvoices',
        'update-branch': 'updateBranch', 'update-sector': 'updateSector',
        'update-timezone': 'updateTimezone', 'update-birthdate': 'updateBirthdate',
        'update-birth-place': 'updateBirthPlace', 'update-nationality': 'updateNationality',
        'update-address': 'updateAddress', 'update-public-phone': 'updatePublicPhone',
        'update-social-media': 'updateSocialMedia', 'update-profile-data': 'updateProfileData',
        'update-default-task-board': 'updateDefaultTaskBoard',
        'address-with-portfolio': 'updateAddressWithPortfolio',
        'export': summaryLower => summaryLower.includes('csv') ? 'exportCsv' : 'exportPdf',
        'csv': 'exportCsv', 'pdf': 'exportPdf',
        'clear': 'clear', 'response': 'updateResponse',
        'busy': 'checkBusy', 'check-busy': 'checkBusy',
        'view': 'getView', 'trash': method === 'GET' ? 'getTrash' : (method === 'DELETE' ? 'clearTrash' : 'moveToTrash'),
        'contents': 'getContents', 'folders': 'getFolders', 'subfolders': 'getSubfolders',
        'details': 'getDetails', 'size': 'getSize', 'zip': 'zip',
        'direct': 'uploadDirect', 'batch': 'uploadBatch',
        'items': 'getSharedItems', 'share': 'share', 'unshare': 'unshare',
        'access': method === 'DELETE' ? 'deleteAccess' : 'updateAccess',
        'tags': method === 'PATCH' ? 'updateTags' : 'getTags',
        'move': 'move',
        'create-folder': 'createFolder',
        'active': 'getActive', 'pending': 'getPending', 'running': 'getRunning',
        'memory': 'getMemory', 'presets': 'getPresets', 'statuses': 'getStatuses',
        'assignees': method === 'GET' ? 'getAssignees' : (method === 'POST' ? 'addAssignees' : (method === 'PATCH' ? 'updateAssignees' : 'removeAssignee')),
        'assigned-users': 'updateAssignedUsers',
        'stages': method === 'POST' ? 'addStage' : undefined,
        'reorder': 'reorderStages',
        'workingdays': 'getWorkingDays',
        'weekstats': 'getWeekStats',
        'meta': 'getMeta',
        'work-days': 'updateWorkDays', 'vacation-days': 'updateVacationDays',
        'headquarters': 'updateHeadquarters', 'invite': 'inviteUser',
        'single-search': 'search',
        'calculate-working-days': 'calculateWorkingDays',
    };

    let opName = opMap[pathSuffix];
    if (typeof opName === 'function') opName = opName(summary.toLowerCase());
    if (!opName) {
        // Try from the full path
        if (path.includes('/export/csv')) opName = 'exportCsv';
        else if (path.includes('/export/pdf')) opName = 'exportPdf';
        else if (path.includes('/range/')) {
            if (method === 'GET') opName = 'getByDateRange';
            else opName = 'getByDateRange';
        }
        else if (path.includes('/date/')) opName = 'getByDate';
        else if (path.includes('/preview-from-dto')) opName = 'previewFromDto';
        else if (path.includes('/create-preview')) opName = 'createPreview';
        else if (path.includes('/organization-possessed')) opName = 'getOrgPossessed';
        else if (path.includes('/request-deletion')) opName = 'requestDeletion';
        else if (path.includes('/bulk-positions')) opName = 'bulkUpdatePositions';
        else if (path.includes('/reasons')) opName = 'getReasons';
        else if (path.includes('/by-company/')) opName = 'getByCompany';
        else if (path.includes('/by-contact/')) opName = 'getByContact';
        else if (path.includes('/lines')) opName = 'updateLines';
        else {
            // Fallback: derive from last segment
            opName = camelCase(pathSuffix.replace(/[{}]/g, ''));
        }
    }

    const label = titleCase(opName.replace(/([A-Z])/g, ' $1').trim());
    return { op: opName, label, action: opName };
}

// ─── Extract Path Params (non-orgId) ────────────────────────────────────

function extractPathParams(pathStr) {
    const matches = pathStr.match(/\{([^}]+)\}/g) || [];
    return matches
        .map(m => m.replace(/[{}]/g, ''))
        .filter(p => p !== 'orgId');
}

// ─── Schema Property to n8n Field ───────────────────────────────────────

function schemaPropsToFields(schema, resource, operation) {
    if (!schema || !schema.properties) return [];
    const required = schema.required || [];
    const fields = [];
    for (const [name, prop] of Object.entries(schema.properties)) {
        if (name === 'organizationId') continue;
        const n8nType = mapType(prop);
        let description = prop.description || '';
        if (prop.enum) description += (description ? '. ' : '') + `Options: ${prop.enum.join(', ')}`;

        fields.push({
            displayName: titleCase(name),
            name,
            type: n8nType,
            default: n8nType === 'number' ? 0 : (n8nType === 'boolean' ? false : ''),
            required: required.includes(name),
            description: description || `${titleCase(name)} value`,
        });
    }
    return fields;
}

// ─── Determine if endpoint needs orgId ──────────────────────────────────

function needsOrgId(pathStr) {
    return pathStr.includes('{orgId}');
}

function needsUserId(pathStr) {
    return pathStr.includes('{userId}');
}

// ─── Generate Description File ──────────────────────────────────────────

function generateDescription(tagName, config, endpoints) {
    const { resource, displayName } = config;
    const operations = [];
    const seenOps = new Set();

    // Classify and deduplicate
    for (const ep of endpoints) {
        const classification = classifyEndpoint(ep);
        if (!classification || !classification.op) continue;
        if (seenOps.has(classification.op)) {
            // Prefer POST query over GET list for getAll
            if (classification.op === 'getAll' && classification.action === 'query') {
                // Replace the existing getAll
                const idx = operations.findIndex(o => o.op === 'getAll');
                if (idx >= 0) operations[idx] = { ...classification, ep };
                continue;
            }
            continue;
        }
        seenOps.add(classification.op);
        operations.push({ ...classification, ep });
    }

    // Sort operations: standard CRUD first, then alphabetical
    const order = ['get', 'getAll', 'create', 'update', 'delete'];
    operations.sort((a, b) => {
        const ai = order.indexOf(a.op);
        const bi = order.indexOf(b.op);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
        return a.label.localeCompare(b.label);
    });

    // Build operations array code
    const opsCode = operations.map(o => {
        return `            { name: '${o.label}', value: '${o.op}', action: '${o.label.toLowerCase()} a ${displayName.toLowerCase()}', description: '${(o.ep.summary || o.label).replace(/'/g, "\\'")}' }`;
    }).join(',\n');

    // Build fields code
    let fieldsCode = '';
    for (const o of operations) {
        fieldsCode += generateFieldsForOperation(resource, displayName, o);
    }

    const code = `import { INodeProperties } from 'n8n-workflow';

export const ${resource}Operations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['${resource}'] } },
        options: [
${opsCode},
        ],
        default: '${operations[0]?.op || 'getAll'}',
    },
];

export const ${resource}Fields: INodeProperties[] = [${fieldsCode}
];
`;
    return { code, operations };
}

function generateFieldsForOperation(resource, displayName, o) {
    const { op, ep } = o;
    const pathParams = extractPathParams(ep.path);
    const schema = getSchemaFromBody(ep.operation);
    let code = `\n    // ── ${op} ──`;

    // Path params (excluding orgId, userId handled specially)
    const exposedParams = pathParams.filter(p => p !== 'orgId');

    // Standard ID parameter for get/update/delete/archive/restore
    if (['get', 'update', 'delete', 'archive', 'restore', 'getDashboard', 'getPreview',
         'book', 'cancel', 'markAsPaid', 'revertCommitted', 'send', 'createXInvoice',
         'createZugferd', 'validateXInvoice', 'convertToInvoice', 'duplicate', 'clone',
         'markAsCompleted', 'markAsIncomplete', 'moveToTrash', 'getDetails', 'getSize',
         'zip', 'getSubfolders', 'activate'].includes(op)) {
        // Find the main ID param
        const mainId = exposedParams.find(p => p === 'id' || p.endsWith('Id')) || exposedParams[0];
        if (mainId) {
            const idFieldName = mainId === 'id' ? `${resource}Id` : mainId;
            code += `
    {
        displayName: '${displayName} ID',
        name: '${idFieldName}',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: 'The ID of the ${displayName.toLowerCase()}',
    },`;
        }
    }

    // For operations with multiple path params (e.g., removeCompany needs id + companyId)
    if (exposedParams.length > 1 && !['get', 'update', 'delete'].includes(op)) {
        for (const param of exposedParams) {
            const paramName = param === 'id' ? `${resource}Id` : param;
            code += `
    {
        displayName: '${titleCase(paramName)}',
        name: '${paramName}',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: '${titleCase(paramName)}',
    },`;
        }
    }

    // Single path param for custom operations
    if (exposedParams.length === 1 && !['get', 'update', 'delete', 'archive', 'restore', 'getDashboard',
        'getPreview', 'book', 'cancel', 'markAsPaid', 'revertCommitted', 'send', 'createXInvoice',
        'createZugferd', 'validateXInvoice', 'convertToInvoice', 'duplicate', 'clone',
        'markAsCompleted', 'markAsIncomplete', 'moveToTrash', 'getDetails', 'getSize',
        'zip', 'getSubfolders', 'activate'].includes(op)) {
        const param = exposedParams[0];
        const paramName = param === 'id' ? `${resource}Id` : param;
        code += `
    {
        displayName: '${titleCase(paramName)}',
        name: '${paramName}',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: '${titleCase(paramName)}',
    },`;
    }

    // Pagination for getAll
    if (op === 'getAll') {
        code += `
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['${resource}'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['${resource}'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },`;
    }

    // Date range params
    if (ep.path.includes('/range/{start}/{end}') || ep.path.includes('/range/')) {
        if (!exposedParams.includes('start')) {
            code += `
    {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: 'Start date (YYYY-MM-DD format)',
    },
    {
        displayName: 'End Date',
        name: 'endDate',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: 'End date (YYYY-MM-DD format)',
    },`;
        }
    }

    // User ID param for user-scoped endpoints
    if (needsUserId(ep.path) && !['getAll'].includes(op)) {
        code += `
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: 'The ID of the user',
    },`;
    }

    // Body fields for create/update
    if (schema && schema.properties && ['create', 'update'].includes(op)) {
        const required = schema.required || [];
        const props = Object.entries(schema.properties);

        // Required fields as top-level for create
        if (op === 'create') {
            for (const [name, prop] of props) {
                if (!required.includes(name)) continue;
                if (name === 'organizationId') continue;
                if (prop.$ref) {
                    code += `
    {
        displayName: '${titleCase(name)}',
        name: '${name}',
        type: 'json',
        required: true,
        default: '{}',
        displayOptions: { show: { resource: ['${resource}'], operation: ['create'] } },
        description: '${titleCase(name)} (JSON object)',
    },`;
                } else {
                    const n8nType = mapType(prop);
                    code += `
    {
        displayName: '${titleCase(name)}',
        name: '${name}',
        type: '${n8nType}',
        required: true,
        default: ${n8nType === 'number' ? '0' : (n8nType === 'boolean' ? 'false' : "''")},
        displayOptions: { show: { resource: ['${resource}'], operation: ['create'] } },
        description: '${(prop.description || titleCase(name)).replace(/'/g, "\\'")}',
    },`;
                }
            }
        }

        // Optional fields as collection
        const optionalProps = props.filter(([name]) => {
            if (name === 'organizationId') return false;
            if (op === 'create' && required.includes(name)) return false;
            return true;
        });

        if (optionalProps.length > 0) {
            const collectionName = op === 'create' ? 'additionalFields' : 'updateFields';
            const collectionLabel = op === 'create' ? 'Additional Fields' : 'Update Fields';
            const optionFields = optionalProps.map(([name, prop]) => {
                const n8nType = prop.$ref ? 'json' : mapType(prop);
                const def = n8nType === 'number' ? '0' : (n8nType === 'boolean' ? 'false' : (n8nType === 'json' ? "'{}'" : "''"));
                const desc = (prop.description || titleCase(name)).replace(/'/g, "\\'");
                return `            { displayName: '${titleCase(name)}', name: '${name}', type: '${n8nType}', default: ${def}, description: '${desc}' }`;
            }).join(',\n');

            code += `
    {
        displayName: '${collectionLabel}',
        name: '${collectionName}',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        options: [
${optionFields},
        ],
    },`;
        }
    }

    // Body fields for other operations with body (send, addCompanies, etc.)
    if (schema && schema.properties && !['create', 'update', 'getAll'].includes(op)) {
        const props = Object.entries(schema.properties);
        if (props.length <= 5) {
            // Few fields: expose as top-level params
            for (const [name, prop] of props) {
                if (name === 'organizationId') continue;
                const n8nType = prop.$ref ? 'json' : mapType(prop);
                const def = n8nType === 'number' ? '0' : (n8nType === 'boolean' ? 'false' : (n8nType === 'json' ? "'{}'" : "''"));
                code += `
    {
        displayName: '${titleCase(name)}',
        name: '${name}',
        type: '${n8nType}',
        default: ${def},
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: '${(prop.description || titleCase(name)).replace(/'/g, "\\'")}',
    },`;
            }
        } else {
            // Many fields: use collection
            const optionFields = props
                .filter(([name]) => name !== 'organizationId')
                .map(([name, prop]) => {
                    const n8nType = prop.$ref ? 'json' : mapType(prop);
                    const def = n8nType === 'number' ? '0' : (n8nType === 'boolean' ? 'false' : (n8nType === 'json' ? "'{}'" : "''"));
                    return `            { displayName: '${titleCase(name)}', name: '${name}', type: '${n8nType}', default: ${def}, description: '${(prop.description || titleCase(name)).replace(/'/g, "\\'")}' }`;
                }).join(',\n');
            code += `
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        options: [
${optionFields},
        ],
    },`;
        }
    }

    // Filters for getAll
    if (op === 'getAll' && schema && schema.properties) {
        const filterProps = Object.entries(schema.properties)
            .filter(([name]) => name !== 'page' && name !== 'limit' && name !== 'organizationId');
        if (filterProps.length > 0) {
            const filterFields = filterProps.map(([name, prop]) => {
                const n8nType = prop.$ref ? 'json' : mapType(prop);
                const def = n8nType === 'number' ? '0' : (n8nType === 'boolean' ? 'false' : (n8nType === 'json' ? "'{}'" : "''"));
                return `            { displayName: '${titleCase(name)}', name: '${name}', type: '${n8nType}', default: ${def}, description: '${(prop.description || titleCase(name)).replace(/'/g, "\\'")}' }`;
            }).join(',\n');
            code += `
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: { show: { resource: ['${resource}'], operation: ['getAll'] } },
        options: [
${filterFields},
        ],
    },`;
        }
    }

    // Query params for GET endpoints
    const queryParams = ep.operation.parameters?.filter(p => p.in === 'query') || [];
    if (queryParams.length > 0 && !['getAll'].includes(op)) {
        for (const qp of queryParams) {
            if (qp.name === 'organizationId') continue;
            const n8nType = mapType(qp.schema);
            code += `
    {
        displayName: '${titleCase(qp.name)}',
        name: '${qp.name}',
        type: '${n8nType}',
        default: ${n8nType === 'number' ? '0' : (n8nType === 'boolean' ? 'false' : "''")},
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: '${(qp.description || titleCase(qp.name)).replace(/'/g, "\\'")}',
    },`;
        }
    }

    // deleteMany: IDs field
    if (['deleteMany', 'deleteBulk', 'archiveMany', 'restoreMany'].includes(op) && !schema) {
        code += `
    {
        displayName: 'IDs (JSON Array)',
        name: 'ids',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['${resource}'], operation: ['${op}'] } },
        description: 'JSON array of IDs',
    },`;
    }

    return code;
}

// ─── Generate Executor Code ─────────────────────────────────────────────

function generateExecutor(tagName, config, endpoints, operations) {
    const { resource, displayName } = config;
    const usesOrgId = endpoints.some(ep => needsOrgId(ep.path));

    let code = '';
    if (usesOrgId) {
        code += `    ${usesOrgId ? 'const orgId = await getOrganizationId.call(this);\n' : ''}\n`;
    }

    for (const o of operations) {
        const { op, ep } = o;
        code += generateExecutorOperation(resource, op, ep, usesOrgId);
    }

    return code;
}

function generateExecutorOperation(resource, op, ep, usesOrgId) {
    const { method, path } = ep;
    const pathParams = extractPathParams(path);
    const schema = getSchemaFromBody(ep.operation);
    const hasOrgId = needsOrgId(path);
    const hasUserId = needsUserId(path);

    // Build the API path with param substitution
    let apiPath = path;
    if (hasOrgId) apiPath = apiPath.replace('{orgId}', '${orgId}');

    // Determine params to read
    let code = `    if (operation === '${op}') {\n`;

    // Read path params
    const exposedParams = pathParams.filter(p => p !== 'orgId');
    for (const param of exposedParams) {
        const paramName = param === 'id' ? `${resource}Id` : param;
        if (param === 'userId' && !['getByDateRange', 'getByDate', 'startTracker', 'stopTracker',
            'pauseTracker', 'resumeTracker', 'getRunning', 'updateGps', 'getMeta',
            'getWorkingDays', 'getWeekStats', 'exportCsv', 'exportPdf'].includes(op)) {
            code += `        const ${param} = this.getNodeParameter('userId', i) as string;\n`;
        } else {
            code += `        const ${param} = this.getNodeParameter('${paramName}', i) as string;\n`;
        }
        apiPath = apiPath.replace(`{${param}}`, `\${${param}}`);
    }

    // Read date range params
    if (path.includes('/range/{start}/{end}')) {
        if (!exposedParams.includes('start')) {
            code += `        const start = this.getNodeParameter('startDate', i) as string;\n`;
            code += `        const end = this.getNodeParameter('endDate', i) as string;\n`;
            apiPath = apiPath.replace('{start}', '${start}').replace('{end}', '${end}');
        }
    }

    // Read date param
    if (path.includes('{date}') && !exposedParams.includes('date')) {
        code += `        const date = this.getNodeParameter('date', i) as string;\n`;
        apiPath = apiPath.replace('{date}', '${date}');
    }

    // Read year/month params
    if (path.includes('{year}') && path.includes('{month}')) {
        code += `        const year = this.getNodeParameter('year', i) as string;\n`;
        code += `        const month = this.getNodeParameter('month', i) as string;\n`;
        apiPath = apiPath.replace('{year}', '${year}').replace('{month}', '${month}');
    }

    // Read other path params
    for (const param of ['token', 'sessionId', 'calendarId', 'taskId', 'projectId',
        'pipelineId', 'stageId', 'boardId', 'columnId', 'trackerId', 'workTimeId',
        'branchId', 'sectorId', 'companyId', 'contactId', 'fileId', 'folderId',
        'driveId', 'accessId', 'tagId', 'offerId', 'invoiceId', 'dealId',
        'cancellationInvoiceId']) {
        if (path.includes(`{${param}}`) && !exposedParams.includes(param)) {
            apiPath = apiPath.replace(`{${param}}`, `\${${param}}`);
        }
    }

    // Handle body
    if (['create'].includes(op) && schema) {
        const required = schema.required || [];
        const reqFields = required.filter(f => f !== 'organizationId');
        if (reqFields.length > 0) {
            const reqAssignments = reqFields.map(f => {
                const propDef = schema.properties?.[f];
                const isJson = propDef?.$ref || propDef?.type === 'object' || propDef?.type === 'array';
                if (isJson) {
                    return `            ${f}: JSON.parse(this.getNodeParameter('${f}', i) as string)`;
                }
                return `            ${f}: this.getNodeParameter('${f}', i)`;
            }).join(',\n');
            code += `        const body: IDataObject = {\n${reqAssignments},\n            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),\n        };\n`;
        } else {
            code += `        const body: IDataObject = {\n            ...(this.getNodeParameter('additionalFields', i, {}) as IDataObject),\n        };\n`;
        }
    } else if (['update'].includes(op)) {
        code += `        const body = this.getNodeParameter('updateFields', i, {}) as IDataObject;\n`;
    } else if (op === 'getAll' && schema) {
        code += `        const returnAll = this.getNodeParameter('returnAll', i) as boolean;\n`;
        code += `        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);\n`;
        code += `        const filters = this.getNodeParameter('filters', i, {}) as IDataObject;\n`;
    } else if (op === 'getAll') {
        code += `        const returnAll = this.getNodeParameter('returnAll', i) as boolean;\n`;
        code += `        const limit = returnAll ? 0 : (this.getNodeParameter('limit', i) as number);\n`;
    } else if (['deleteMany', 'deleteBulk', 'archiveMany', 'restoreMany'].includes(op)) {
        if (schema) {
            code += `        const body = this.getNodeParameter('options', i, {}) as IDataObject;\n`;
        } else {
            code += `        const ids = JSON.parse(this.getNodeParameter('ids', i) as string);\n`;
            code += `        const body: IDataObject = { ids };\n`;
        }
    } else if (schema && schema.properties) {
        const props = Object.entries(schema.properties).filter(([n]) => n !== 'organizationId');
        if (props.length <= 5) {
            const assignments = props.map(([name, prop]) => {
                const isJson = prop.$ref || prop.type === 'object' || prop.type === 'array';
                if (isJson) return `            ${name}: JSON.parse(this.getNodeParameter('${name}', i, '{}') as string)`;
                return `            ${name}: this.getNodeParameter('${name}', i)`;
            }).join(',\n');
            code += `        const body: IDataObject = {\n${assignments},\n        };\n`;
        } else {
            code += `        const body = this.getNodeParameter('options', i, {}) as IDataObject;\n`;
        }
    }

    // Build the API call
    const httpMethod = method;
    const useBacktick = apiPath.includes('${');
    const pathStr = useBacktick ? `\`${apiPath}\`` : `'${apiPath}'`;

    if (op === 'getAll') {
        if (httpMethod === 'POST') {
            code += `        return cashwerkApiRequestAllItems.call(this, '${httpMethod}', ${pathStr}, { ...filters }, {}, limit);\n`;
        } else {
            code += `        return cashwerkApiRequestAllItems.call(this, '${httpMethod}', ${pathStr}, {}, ${schema ? '{ ...filters }' : '{}'}, limit);\n`;
        }
    } else if (schema || ['create', 'update', 'deleteMany', 'deleteBulk', 'archiveMany', 'restoreMany'].includes(op) ||
               (schema && !['get', 'delete', 'getAll'].includes(op))) {
        code += `        return cashwerkApiRequest.call(this, '${httpMethod}', ${pathStr}${schema || ['create', 'update', 'deleteMany', 'deleteBulk', 'archiveMany', 'restoreMany'].includes(op) ? ', body' : ''});\n`;
    } else {
        // Query params
        const queryParams = ep.operation.parameters?.filter(p => p.in === 'query') || [];
        if (queryParams.length > 0) {
            const qpNames = queryParams.filter(p => p.name !== 'organizationId').map(p => p.name);
            if (qpNames.length > 0) {
                code += `        const qs: IDataObject = {};\n`;
                for (const qp of qpNames) {
                    code += `        const ${qp}Val = this.getNodeParameter('${qp}', i, '') as string;\n`;
                    code += `        if (${qp}Val) qs['${qp}'] = ${qp}Val;\n`;
                }
                code += `        return cashwerkApiRequest.call(this, '${httpMethod}', ${pathStr}, {}, qs);\n`;
            } else {
                code += `        return cashwerkApiRequest.call(this, '${httpMethod}', ${pathStr});\n`;
            }
        } else {
            code += `        return cashwerkApiRequest.call(this, '${httpMethod}', ${pathStr});\n`;
        }
    }

    code += `    }\n\n`;
    return code;
}

// ─── Generate Executor File ─────────────────────────────────────────────

function generateExecutorFile(domain, resources) {
    let functions = '';
    const functionNames = [];

    for (const { tagName, config, endpoints, operations } of resources) {
        const fnName = `execute${pascalCase(config.resource)}`;
        functionNames.push({ fnName, resource: config.resource });
        const body = generateExecutor(tagName, config, endpoints, operations);

        functions += `
export async function ${fnName}(
    this: IExecuteFunctions,
    operation: string,
    i: number,
): Promise<any> {
${body}}
`;
    }

    const code = `import {
    IExecuteFunctions,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId } from '../GenericFunctions';

${functions}`;

    return { code, functionNames };
}

// ─── Generate Main Node File ────────────────────────────────────────────

function generateMainNode(allResources, domainExecutors) {
    // Build imports for descriptions
    const descImports = allResources.map(r =>
        `import { ${r.config.resource}Operations, ${r.config.resource}Fields } from './descriptions/${r.config.descFile}';`
    ).join('\n');

    // Build imports for executors
    const execImports = [];
    for (const [domain, execInfo] of Object.entries(domainExecutors)) {
        const fnNames = execInfo.functionNames.map(f => f.fnName).join(', ');
        execImports.push(`import { ${fnNames} } from './executors/${domain}';`);
    }

    // Build resource options
    const resourceOptions = allResources
        .sort((a, b) => a.config.displayName.localeCompare(b.config.displayName))
        .map(r => `                    { name: '${r.config.displayName}', value: '${r.config.resource}' }`)
        .join(',\n');

    // Build property spreads
    const propertySpreads = allResources.map(r =>
        `            ...${r.config.resource}Operations,\n            ...${r.config.resource}Fields,`
    ).join('\n');

    // Build executor dispatch
    const execDispatch = allResources.map(r => {
        const fnName = `execute${pascalCase(r.config.resource)}`;
        return `                } else if (resource === '${r.config.resource}') {\n                    responseData = await ${fnName}.call(this, operation, i);`;
    }).join('\n');

    const firstResource = allResources.sort((a, b) =>
        a.config.displayName.localeCompare(b.config.displayName)
    )[0];

    const code = `import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IDataObject,
} from 'n8n-workflow';

import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId } from './GenericFunctions';
${descImports}
${execImports.join('\n')}

export class Cashwerk implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'cashwerk',
        name: 'cashwerk',
        icon: { light: 'file:cashwerk.svg', dark: 'file:cashwerk.dark.svg' },
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Interact with the cashwerk API',
        defaults: { name: 'cashwerk' },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'cashwerkApi',
                required: true,
                displayOptions: { show: { authentication: ['apiKey'] } },
            },
            {
                name: 'cashwerkOAuth2Api',
                required: true,
                displayOptions: { show: { authentication: ['oAuth2'] } },
            },
        ],
        properties: [
            {
                displayName: 'Authentication',
                name: 'authentication',
                type: 'options',
                options: [
                    { name: 'API Key', value: 'apiKey' },
                    { name: 'OAuth2', value: 'oAuth2' },
                ],
                default: 'apiKey',
            },
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
${resourceOptions},
                ],
                default: '${firstResource.config.resource}',
            },
${propertySpreads}
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: IDataObject[] = [];
        const resource = this.getNodeParameter('resource', 0) as string;
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            try {
                let responseData: any;

                if (resource === '${firstResource.config.resource}') {
                    responseData = await execute${pascalCase(firstResource.config.resource)}.call(this, operation, i);
${execDispatch}
                }

                if (Array.isArray(responseData)) {
                    returnData.push(...responseData);
                } else if (responseData !== undefined) {
                    returnData.push(responseData as IDataObject);
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ error: (error as Error).message });
                    continue;
                }
                throw error;
            }
        }

        return [this.helpers.returnJsonArray(returnData)];
    }
}
`;
    return code;
}

// ─── Main ───────────────────────────────────────────────────────────────

function main() {
    const tagGroups = groupByTag();
    const allResources = [];
    const domainResources = {};

    // Process each tag
    for (const [tagName, endpoints] of Object.entries(tagGroups)) {
        const config = TAG_CONFIG[tagName];
        if (!config) {
            console.log(`Skipping unknown tag: ${tagName}`);
            continue;
        }

        console.log(`Processing: ${tagName} (${endpoints.length} endpoints) -> ${config.resource}`);

        const { code: descCode, operations } = generateDescription(tagName, config, endpoints);

        // Write description file
        const descPath = path.join(DESCRIPTIONS_DIR, `${config.descFile}.ts`);
        fs.writeFileSync(descPath, descCode);
        console.log(`  Written: ${descPath}`);

        // Collect for executor generation
        if (!domainResources[config.domain]) domainResources[config.domain] = [];
        domainResources[config.domain].push({ tagName, config, endpoints, operations });
        allResources.push({ tagName, config, endpoints, operations });
    }

    // Generate executor files
    const domainExecutors = {};
    for (const [domain, resources] of Object.entries(domainResources)) {
        const { code, functionNames } = generateExecutorFile(domain, resources);
        const execPath = path.join(EXECUTORS_DIR, `${domain}.ts`);
        fs.writeFileSync(execPath, code);
        console.log(`Written executor: ${execPath}`);
        domainExecutors[domain] = { functionNames };
    }

    // Generate main node file
    const mainCode = generateMainNode(allResources, domainExecutors);
    const mainPath = path.join(NODE_DIR, 'Cashwerk.node.ts');
    fs.writeFileSync(mainPath, mainCode);
    console.log(`Written main node: ${mainPath}`);

    console.log(`\nDone! Generated ${allResources.length} resources across ${Object.keys(domainResources).length} executor domains.`);
}

main();
