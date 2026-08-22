#!/usr/bin/env node
/**
 * n8n Description Generator
 *
 * Reads openapi-external.json and generates/updates Description files only.
 * These are declarative UI definitions (resource/operation matrices, field
 * definitions, enum options, displayOptions routing).
 *
 * What it generates per endpoint:
 * - type: 'options' field with enum values from spec
 * - displayOptions routing to correct resource + operation
 * - Path param fields (required)
 * - Query param fields (optional, in Filters collection)
 * - Request body fields (in Options / Update Fields collection)
 * - loadOptionsMethod references (preserved from existing file when present)
 *
 * What it NEVER touches:
 * - Executor files (executors/*.ts)
 * - Cashwerk.node.ts
 * - GenericFunctions.ts
 * - CashwerkTrigger.node.ts
 * - constants.ts
 *
 * Merge strategy:
 * - Reads existing description file as lines
 * - Replaces enum options arrays with fresh values from spec
 * - Adds new operations/fields that appear in spec but missing from descriptions
 * - Preserves loadOptionsMethod references, custom description strings, all displayOptions routing
 * - // @manual blocks skipped unconditionally
 *
 * Usage:
 *   npm run n8n:generate-descriptions              # Apply updates
 *   npm run n8n:generate-descriptions -- --dry-run  # Preview without writing
 *   npm run n8n:generate-descriptions -- --verbose  # Detailed output
 *   npm run n8n:generate-descriptions -- --skeleton # Also generate skeleton executors for new resources
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, basename } from 'path';
import type {
    OpenApiDocument,
    OpenApiPathItem,
    OpenApiOperation,
    OpenApiParameter,
    OpenApiRequestBody,
    OpenApiSchema,
    OpenApiSchemaProperty,
    HttpMethod,
    EnumFieldSpec,
    DescriptionTagConfig,
    DescriptionGenerationResult,
    DescriptionGenerationReport,
    DescriptionGeneratorCliArgs,
} from '../../../scripts/shared/openapi.interfaces';
import { HTTP_METHODS } from '../../../scripts/shared/openapi.interfaces';

// ─── Configuration ──────────────────────────────────────────────────

const SCRIPT_DIR = resolve(__dirname);
export const SPEC_PATH = resolve(SCRIPT_DIR, 'openapi-external.json');
const DESCRIPTIONS_DIR = resolve(SCRIPT_DIR, '..', 'nodes', 'Cashwerk', 'descriptions');
const EXECUTORS_DIR = resolve(SCRIPT_DIR, '..', 'nodes', 'Cashwerk', 'executors');
const MANUAL_MARKER = '// @manual';
export const API_PREFIX = '/api/v1';

const SKIP_FIELDS = new Set(['operation', 'resource', 'sortType']);
const SKIP_BODY_FIELDS = new Set(['organizationId', 'orgId']);

// ─── Tag Configuration ──────────────────────────────────────────────

export const TAG_CONFIG: Record<string, DescriptionTagConfig> = {
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
    'Bookings':               { resource: 'booking',             displayName: 'Booking',              descFile: 'BookingDescription',             domain: 'booking' },
    'Booking Pages':          { resource: 'bookingPage',         displayName: 'Booking Page',         descFile: 'BookingPageDescription',          domain: 'booking' },
    'Booking Event Types':    { resource: 'bookingEventType',    displayName: 'Booking Event Type',   descFile: 'BookingEventTypeDescription',     domain: 'booking' },
    'Booking Date Overrides': { resource: 'bookingDateOverride', displayName: 'Booking Date Override',descFile: 'BookingDateOverrideDescription',  domain: 'booking' },
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
    'Chat':                   { resource: 'chat',                displayName: 'Chat',                 descFile: 'ChatDescription',                domain: 'chat' },
    'Organization':           { resource: 'organization',        displayName: 'Organization',         descFile: 'OrganizationDescription',        domain: 'organization',     needsOrgId: true },
    'Drive':                  { resource: 'drive',               displayName: 'Drive',                descFile: 'DriveDescription',               domain: 'drive' },
    'Drive Files':            { resource: 'driveFile',           displayName: 'Drive File',           descFile: 'DriveFileDescription',           domain: 'drive' },
    'Drive Folders':          { resource: 'driveFolder',         displayName: 'Drive Folder',         descFile: 'DriveFolderDescription',         domain: 'drive' },
    'Drive Sharing':          { resource: 'driveSharing',        displayName: 'Drive Sharing',        descFile: 'DriveSharingDescription',        domain: 'drive' },
    'MailConnections':        { resource: 'mailConnection',      displayName: 'Mail Connection',      descFile: 'MailConnectionDescription',      domain: 'mailing' },
    'Mailing':                { resource: 'mailConnection',      displayName: 'Mail Connection',      descFile: 'MailConnectionDescription',      domain: 'mailing' },
};

export const SKIP_TAGS = new Set(['API Platform', 'Webhooks']);

/**
 * Spec-derived operations that must NOT be (re-)added to a description:
 * they duplicate a hand-written operation under a worse label.
 */
const OP_EXCLUSIONS: Record<string, Set<string>> = {
    company: new Set(['deals', 'invoices', 'offers', 'projects', 'tasks', 'delete', 'addCompanies']),
    contact: new Set(['deals', 'invoices', 'offers', 'projects', 'tasks', 'addCompanies', 'addContacts']),
    project: new Set(['getAll', 'addContacts']),
    workReport: new Set(['get', 'getAll', 'getByDateRange']),
    crmMetrics: new Set(['getAll']),
    incomingPayment: new Set(['get']),
};

/** Spec-derived operation value → the value the description actually uses. */
const OP_ALIASES: Record<string, Record<string, string>> = {
    company: { appointments: 'getAppointments' },
    contact: { appointments: 'getAppointments', byEmails: 'findByEmails' },
    project: { contact: 'addContact' },
    organization: { create: 'createSector', update: 'updateSector', delete: 'deleteBranch', branch: 'createBranch', members: 'setSectorMembers' },
    timeTracking: { getAll: 'getTaskTrackings', create: 'createBreak', delete: 'deleteBreak', deleteBulk: 'deleteBreaks' },
    chat: { messages: 'sendMessage' },
    drive: { create: 'createFolder' },
    calendarEvent: { attachments: 'uploadAttachment', link: 'linkAttachment', folder: 'ensureFolder', convert: 'convertGuest', occurrences: 'updateOccurrence', split: 'splitSeries', clear: 'clearAll' },
    deal: { tags: 'addTag' },
    pipeline: { assignedUsers: 'updateAssignedUsers', reorder: 'reorderStages' },
    bookingEventType: { get: 'getByPage' },
};

// ─── CLI ────────────────────────────────────────────────────────────

function parseArgs(): DescriptionGeneratorCliArgs {
    const args = process.argv.slice(2);
    return {
        dryRun: args.includes('--dry-run') || args.includes('--check'),
        verbose: args.includes('--verbose') || args.includes('-v'),
        skeleton: args.includes('--skeleton'),
    };
}

// ─── String Helpers ─────────────────────────────────────────────────

export function titleCase(str: string): string {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function camelCase(str: string): string {
    return str.replace(/[-_](\w)/g, (_, c: string) => c.toUpperCase());
}

export function pascalCase(str: string): string {
    const cc = camelCase(str);
    return cc.charAt(0).toUpperCase() + cc.slice(1);
}

export function stripPrefix(p: string): string {
    return p.startsWith(API_PREFIX) ? p.slice(API_PREFIX.length) : p;
}

function enumValueToDisplayName(value: string): string {
    return value
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function escapeQuotes(str: string): string {
    return str.replace(/'/g, "\\'");
}

// ─── Spec Parsing ───────────────────────────────────────────────────

export interface SpecEndpoint {
    method: string;
    path: string;
    summary: string;
    operationId: string;
    parameters: OpenApiParameter[];
    requestBody?: OpenApiRequestBody;
}

export function groupEndpointsByTag(spec: OpenApiDocument): Map<string, SpecEndpoint[]> {
    const groups = new Map<string, SpecEndpoint[]>();

    for (const [rawPath, pathItem] of Object.entries(spec.paths)) {
        for (const method of HTTP_METHODS) {
            const operation = (pathItem as OpenApiPathItem)[method] as OpenApiOperation | undefined;
            if (!operation) continue;

            const tags = operation.tags ?? ['Untagged'];
            const strippedPath = stripPrefix(rawPath);

            for (const tag of tags) {
                if (SKIP_TAGS.has(tag)) continue;
                const existing = groups.get(tag) ?? [];
                existing.push({
                    method: method.toUpperCase(),
                    path: strippedPath,
                    summary: operation.summary ?? '',
                    operationId: operation.operationId ?? '',
                    parameters: (operation.parameters ?? []) as OpenApiParameter[],
                    requestBody: operation.requestBody as OpenApiRequestBody | undefined,
                });
                groups.set(tag, existing);
            }
        }
    }

    return groups;
}

// ─── Schema Resolution ──────────────────────────────────────────────

function resolveSchema(spec: OpenApiDocument, ref: string): OpenApiSchema {
    if (!ref) return {};
    const schemaName = ref.replace('#/components/schemas/', '');
    const schemas = spec.components?.schemas as Record<string, OpenApiSchema> | undefined;
    return schemas?.[schemaName] ?? {};
}

function getSchemaFromBody(spec: OpenApiDocument, requestBody?: OpenApiRequestBody): OpenApiSchema | null {
    const content = requestBody?.content?.['application/json'];
    if (!content?.schema) return null;
    if (content.schema.$ref) return resolveSchema(spec, content.schema.$ref);
    return content.schema as unknown as OpenApiSchema;
}

function mapSpecTypeToN8n(prop: OpenApiSchemaProperty | undefined): string {
    if (!prop) return 'string';
    if (prop.$ref) return 'json';
    if (prop.type === 'integer' || prop.type === 'number') return 'number';
    if (prop.type === 'boolean') return 'boolean';
    if (prop.type === 'array') return 'json';
    if (prop.type === 'object') return 'json';
    return 'string';
}

function getDefaultValue(n8nType: string): string | number | boolean {
    switch (n8nType) {
        case 'number': return 0;
        case 'boolean': return false;
        default: return '';
    }
}

// ─── Operation Classification ───────────────────────────────────────

export interface ClassifiedOp {
    value: string;
    label: string;
    action: string;
}

const OP_MAP: Record<string, string | ((method: string, summary: string) => string)> = {
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
    'start': 'startTracker', 'stop': 'stopTracker', 'pause': 'pauseTracker', 'resume': 'resumeTracker',
    'gps': 'updateGps',
    'invite-user': 'inviteUser', 'remove-user': 'removeUser',
    'update-project': 'updateProject', 'create-column': 'createColumn',
    'save-as-preset': 'saveAsPreset', 'create-by-preset': 'createFromPreset',
    'approve': 'approve', 'reject': 'reject',
    'import': 'import', 'import-update': 'importUpdate',
    'logo': 'uploadLogo', 'avatar': 'uploadAvatar', 'image': 'uploadImage', 'header': 'uploadHeader',
    'cancellation-invoices': 'getCancellationInvoices',
    'update-branch': 'updateBranch', 'update-sector': 'updateSector',
    'update-timezone': 'updateTimezone', 'update-birthdate': 'updateBirthdate',
    'update-birth-place': 'updateBirthPlace', 'update-nationality': 'updateNationality',
    'update-address': 'updateAddress', 'update-public-phone': 'updatePublicPhone',
    'update-social-media': 'updateSocialMedia', 'update-profile-data': 'updateProfileData',
    'update-default-task-board': 'updateDefaultTaskBoard',
    'address-with-portfolio': 'updateAddressWithPortfolio',
    'csv': 'exportCsv', 'pdf': 'exportPdf',
    'clear': 'clear', 'response': 'updateResponse',
    'busy': 'checkBusy', 'check-busy': 'checkBusy',
    'contents': 'getContents', 'folders': 'getFolders', 'subfolders': 'getSubfolders',
    'details': 'getDetails', 'size': 'getSize', 'zip': 'zip',
    'direct': 'uploadDirect', 'batch': 'uploadBatch',
    'items': 'getSharedItems', 'share': 'share', 'unshare': 'unshare',
    'move': 'move', 'create-folder': 'createFolder',
    'active': 'getActive', 'pending': 'getPending', 'running': 'getRunning',
    'memory': 'getMemory', 'presets': 'getPresets', 'statuses': 'getStatuses',
    'workingdays': 'getWorkingDays', 'weekstats': 'getWeekStats', 'meta': 'getMeta',
    'work-days': 'updateWorkDays', 'vacation-days': 'updateVacationDays',
    'headquarters': 'updateHeadquarters', 'invite': 'inviteUser',
    'single-search': 'search', 'calculate-working-days': 'calculateWorkingDays',
};

const METHOD_DEPENDENT_OPS: Record<string, Record<string, string>> = {
    'companies': { DELETE: 'removeCompany', POST: 'addCompanies', GET: 'getCompanies', PUT: 'addCompanies' },
    'contacts': { DELETE: 'removeContact', PUT: 'addContacts', POST: 'addContacts', GET: 'getContacts' },
    'invoices': { GET: 'getInvoices' },
    'offers': { GET: 'getOffers' },
    'deals': { GET: 'getDeals' },
    'projects': { GET: 'getProjects' },
    'tasks': { GET: 'getTasks' },
    'trash': { GET: 'getTrash', DELETE: 'clearTrash', POST: 'moveToTrash' },
    'view': { GET: 'getView' },
    'access': { DELETE: 'deleteAccess', PATCH: 'updateAccess', PUT: 'updateAccess' },
    'tags': { PATCH: 'updateTags', GET: 'getTags' },
    'assignees': { GET: 'getAssignees', POST: 'addAssignees', PATCH: 'updateAssignees', DELETE: 'removeAssignee' },
    'stages': { POST: 'addStage' },
};

const NON_LIST_SUFFIXES = new Set([
    'range', 'meta', 'dashboard', 'preview', 'weekstats', 'search', 'query',
    'presets', 'statuses', 'assignees', 'subfolders', 'details', 'size', 'trash',
    'contents', 'folders', 'items', 'check-busy', 'single-search', 'total',
    'memory', 'running', 'active', 'pending', 'avatar', 'view',
]);

function classifyEndpoint(ep: SpecEndpoint): ClassifiedOp | null {
    const { method, path, summary } = ep;
    const segments = path.split('/').filter(Boolean);
    const lastSeg = segments[segments.length - 1];
    const secondLast = segments.length > 1 ? segments[segments.length - 2] : '';
    const hasIdAtEnd = lastSeg.startsWith('{') && lastSeg.endsWith('}');
    const summaryLower = summary.toLowerCase();

    if (method === 'POST' && lastSeg === 'query') return { value: 'getAll', label: 'Get Many', action: 'query' };
    if (method === 'POST' && lastSeg === 'search') return { value: 'getAll', label: 'Get Many', action: 'search' };
    if (method === 'GET' && lastSeg === 'search') return { value: 'getAll', label: 'Get Many', action: 'search' };

    if (method === 'GET' && hasIdAtEnd && !path.includes('/range/')) return { value: 'get', label: 'Get', action: 'get' };

    if (method === 'GET' && !hasIdAtEnd && !NON_LIST_SUFFIXES.has(lastSeg)) {
        return { value: 'getAll', label: 'Get All', action: 'list' };
    }

    if (method === 'POST' && (lastSeg === 'new' || lastSeg === 'create')) return { value: 'create', label: 'Create', action: 'create' };
    if (method === 'POST' && !hasIdAtEnd && segments.length <= 3 && !summaryLower.includes('delete') && !summaryLower.includes('archive')) {
        if (summaryLower.includes('create') || summaryLower.includes('new')) {
            return { value: 'create', label: 'Create', action: 'create' };
        }
    }

    if ((method === 'PATCH' || method === 'PUT') && hasIdAtEnd) return { value: 'update', label: 'Update', action: 'update' };
    if (method === 'DELETE' && hasIdAtEnd) return { value: 'delete', label: 'Delete', action: 'delete' };

    if (lastSeg === 'delete-many') return { value: 'deleteMany', label: 'Delete Many', action: 'deleteMany' };
    if (lastSeg === 'delete-bulk') return { value: 'deleteBulk', label: 'Delete Bulk', action: 'deleteBulk' };

    if (lastSeg === 'archive' && method === 'POST') {
        return secondLast.startsWith('{')
            ? { value: 'archive', label: 'Archive', action: 'archive' }
            : { value: 'archiveMany', label: 'Archive Many', action: 'archiveMany' };
    }
    if (lastSeg === 'archive' && method === 'PATCH') return { value: 'archive', label: 'Archive', action: 'archive' };
    if (lastSeg === 'restore' && method === 'POST') {
        return secondLast.startsWith('{')
            ? { value: 'restore', label: 'Restore', action: 'restore' }
            : { value: 'restoreMany', label: 'Restore Many', action: 'restoreMany' };
    }
    if (lastSeg === 'restore' && method === 'PATCH') return { value: 'restore', label: 'Restore', action: 'restore' };
    if (lastSeg === 'archive-many') return { value: 'archiveMany', label: 'Archive Many', action: 'archiveMany' };
    if (lastSeg === 'restore-many') return { value: 'restoreMany', label: 'Restore Many', action: 'restoreMany' };
    if (lastSeg === 'activate') return { value: 'activate', label: 'Activate', action: 'activate' };

    const pathSuffix = hasIdAtEnd ? secondLast : lastSeg;

    if (METHOD_DEPENDENT_OPS[pathSuffix]) {
        const opName = METHOD_DEPENDENT_OPS[pathSuffix][method];
        if (opName) {
            const label = titleCase(opName.replace(/([A-Z])/g, ' $1').trim());
            return { value: opName, label, action: opName };
        }
    }

    let opName = OP_MAP[pathSuffix] as string | undefined;
    if (typeof opName === 'function') {
        opName = opName(method, summaryLower);
    }

    if (!opName) {
        if (path.includes('/export/csv')) opName = 'exportCsv';
        else if (path.includes('/export/pdf')) opName = 'exportPdf';
        else if (path.includes('/range/')) opName = 'getByDateRange';
        else if (path.includes('/date/')) opName = 'getByDate';
        else if (path.includes('/organization-possessed')) opName = 'getOrgPossessed';
        else if (path.includes('/request-deletion')) opName = 'requestDeletion';
        else if (path.includes('/bulk-positions')) opName = 'bulkUpdatePositions';
        else if (path.includes('/reasons')) opName = 'getReasons';
        else if (path.includes('/by-company/')) opName = 'getByCompany';
        else if (path.includes('/by-contact/')) opName = 'getByContact';
        else if (path.includes('/lines')) opName = 'updateLines';
        else opName = camelCase(pathSuffix.replace(/[{}]/g, ''));
    }

    if (!opName) return null;

    const label = titleCase(opName.replace(/([A-Z])/g, ' $1').trim());
    return { value: opName, label, action: opName };
}

// ─── Field Extraction from Spec ─────────────────────────────────────

export interface ExtractedField {
    displayName: string;
    name: string;
    n8nType: string;
    required: boolean;
    defaultValue: string | number | boolean;
    description: string;
    enumValues?: string[];
}

export function extractPathParams(ep: SpecEndpoint): ExtractedField[] {
    return (ep.parameters ?? [])
        .filter(p => p.in === 'path' && p.name !== 'orgId')
        .map(p => ({
            displayName: titleCase(p.name),
            name: p.name,
            n8nType: mapSpecTypeToN8n(p.schema),
            required: true,
            defaultValue: getDefaultValue(mapSpecTypeToN8n(p.schema)),
            description: p.description || `${titleCase(p.name)} value`,
        }));
}

export function extractQueryParams(ep: SpecEndpoint): ExtractedField[] {
    return (ep.parameters ?? [])
        .filter(p => p.in === 'query')
        .map(p => {
            const n8nType = p.schema?.enum ? 'options' : mapSpecTypeToN8n(p.schema);
            return {
                displayName: titleCase(p.name),
                name: p.name,
                n8nType,
                required: p.required ?? false,
                defaultValue: getDefaultValue(n8nType),
                description: p.description || `${titleCase(p.name)} filter`,
                enumValues: p.schema?.enum?.filter((v): v is string => typeof v === 'string'),
            };
        });
}

export function extractBodyFields(spec: OpenApiDocument, ep: SpecEndpoint): ExtractedField[] {
    const schema = getSchemaFromBody(spec, ep.requestBody);
    if (!schema?.properties) return [];

    const required = schema.required ?? [];
    const fields: ExtractedField[] = [];

    for (const [name, prop] of Object.entries(schema.properties)) {
        if (SKIP_BODY_FIELDS.has(name)) continue;
        const schemaProp = prop as OpenApiSchemaProperty;
        const n8nType = schemaProp.enum ? 'options' : mapSpecTypeToN8n(schemaProp);

        fields.push({
            displayName: titleCase(name),
            name,
            n8nType,
            required: required.includes(name),
            defaultValue: getDefaultValue(n8nType),
            description: (schemaProp.description as string) || `${titleCase(name)} value`,
            enumValues: schemaProp.enum?.filter((v): v is string => typeof v === 'string'),
        });
    }

    return fields;
}

// ─── Enum Sync (from regenerate-descriptions.ts) ────────────────────

const DTO_PREFIXES = ['Create', 'Update', 'Query', 'Bulk', 'Filter', 'List', 'Add'];
const DTO_SUFFIXES = ['Dto', 'DTO', 'Entity', 'Payload'];
const SECONDARY_SUFFIXES = ['Request', 'Response', 'Item', 'Entry', 'Meta'];

const RESOURCE_NAME_OVERRIDES: Record<string, string> = {
    AbsenceRequest: 'Absence', CalendarEventItem: 'CalendarEvent',
    TaskBoardColumnItem: 'TaskBoardColumn', ShiftPlanEntry: 'ShiftPlan',
    ShiftPlanRequest: 'ShiftPlan', TimeTrackingEntry: 'TimeTracking',
    WorkReportEntry: 'WorkReport', WorkTimeEntry: 'WorkTime',
    CompaniesToDeal: 'Deal', ContactsToDeal: 'Deal',
    CompaniesToTask: 'Task', ContactsToTask: 'Task',
    DealRequest: 'Deal', IncomingPayment: 'IncomingPayment',
    InvoiceLine: 'Invoice', PipelineRequest: 'Pipeline',
    Portfolio: 'Portfolio', Project: 'Project',
    ProjectCustomer: 'Project', SalesTaxRegulation: 'SalesTaxRegulation',
    CancellationInvoice: 'CancellationInvoice',
    TrackingRequest: 'TrackingCategory', TrackingMeta: 'TrackingCategory',
    Trackings: 'TrackingCategory', Event: 'CalendarEvent',
    EventResponse: 'CalendarEvent', Recurrence: 'CalendarEvent',
    ExportContacts: 'Contact', Contacts: 'Contact',
    ProfileData: 'User', WorkDay: 'WorkTime',
};

function extractResourceName(schemaName: string): string | null {
    let name = schemaName;

    for (const prefix of DTO_PREFIXES) {
        if (name.startsWith(prefix) && name.length > prefix.length) {
            name = name.slice(prefix.length);
            break;
        }
    }

    for (const suffix of DTO_SUFFIXES) {
        if (name.endsWith(suffix) && name.length > suffix.length) {
            name = name.slice(0, -suffix.length);
            break;
        }
    }

    if (name === schemaName || name.length < 2) return null;
    if (RESOURCE_NAME_OVERRIDES[name]) return RESOURCE_NAME_OVERRIDES[name];

    for (const suffix of SECONDARY_SUFFIXES) {
        if (name.endsWith(suffix) && name.length > suffix.length) {
            const stripped = name.slice(0, -suffix.length);
            if (RESOURCE_NAME_OVERRIDES[stripped]) return RESOURCE_NAME_OVERRIDES[stripped];
            return stripped;
        }
    }

    return name;
}

function extractEnumsByResource(spec: OpenApiDocument): Map<string, EnumFieldSpec[]> {
    const resourceEnums = new Map<string, EnumFieldSpec[]>();
    const schemas = spec.components?.schemas as Record<string, OpenApiSchema> | undefined;
    if (!schemas) return resourceEnums;

    for (const [schemaName, schema] of Object.entries(schemas)) {
        const resourceName = extractResourceName(schemaName);
        if (!resourceName) continue;

        const properties = schema.properties;
        if (!properties) continue;

        for (const [fieldName, fieldDef] of Object.entries(properties)) {
            const prop = fieldDef as OpenApiSchemaProperty;
            if (!prop.enum || !Array.isArray(prop.enum) || prop.enum.length === 0) continue;
            if (SKIP_FIELDS.has(fieldName)) continue;

            const enumValues = prop.enum.filter((v): v is string => typeof v === 'string');
            if (enumValues.length === 0) continue;

            const existing = resourceEnums.get(resourceName) ?? [];
            const existingField = existing.find(f => f.fieldName === fieldName);

            if (existingField) {
                const merged = new Set([...existingField.values, ...enumValues]);
                existingField.values = Array.from(merged);
            } else {
                existing.push({ fieldName, values: [...enumValues] });
                resourceEnums.set(resourceName, existing);
            }
        }
    }

    return resourceEnums;
}

// ─── Existing File Analysis ─────────────────────────────────────────

interface ExistingFileInfo {
    operationValues: Set<string>;
    operationsBlockEnd: number;
    fieldsArrayEnd: number;
    lines: string[];
}

function analyzeExistingFile(filePath: string): ExistingFileInfo | null {
    if (!existsSync(filePath)) return null;

    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const operationValues = new Set<string>();

    let foundOperationName = false;
    let inOptionsArray = false;
    let operationsBlockEnd = -1;
    let optionsDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("name: 'operation'")) {
            foundOperationName = true;
        }

        if (foundOperationName && !inOptionsArray && line.includes('options: [')) {
            inOptionsArray = true;
            optionsDepth = 0;
            for (let ci = line.indexOf('options: ['); ci < line.length; ci++) {
                if (line[ci] === '[') optionsDepth++;
                if (line[ci] === ']') {
                    optionsDepth--;
                    if (optionsDepth === 0) {
                        operationsBlockEnd = i;
                        inOptionsArray = false;
                        break;
                    }
                }
            }
            continue;
        }

        if (inOptionsArray) {
            const valueMatch = line.match(/value:\s*'([^']+)'/);
            if (valueMatch) {
                operationValues.add(valueMatch[1]);
            }

            for (const ch of line) {
                if (ch === '[') optionsDepth++;
                if (ch === ']') {
                    optionsDepth--;
                    if (optionsDepth === 0) {
                        operationsBlockEnd = i;
                        inOptionsArray = false;
                        break;
                    }
                }
            }
        }
    }

    let fieldsArrayEnd = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '];') {
            fieldsArrayEnd = i;
            break;
        }
    }

    return { operationValues, operationsBlockEnd, fieldsArrayEnd, lines };
}

// ─── Enum Option Block Update ───────────────────────────────────────

interface OptionsBlock {
    startLine: number;
    endLine: number;
    contentLines: string[];
    indent: string;
    fieldName: string;
    operationContext: string;
}

function findOptionsBlocks(lines: string[]): OptionsBlock[] {
    const blocks: OptionsBlock[] = [];
    let currentOperation = '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const opMatch = line.match(/operation:\s*\['(\w+)'\]/);
        if (opMatch) currentOperation = opMatch[1];

        if (line.includes("name: 'operation'") && line.includes("type: 'options'")) continue;

        const fieldMatch = line.match(/name:\s*'(\w+)',\s*type:\s*'options'/);
        if (!fieldMatch) continue;

        const fieldName = fieldMatch[1];
        if (SKIP_FIELDS.has(fieldName)) continue;

        const optionsIdx = line.indexOf('options: [');
        if (optionsIdx === -1) continue;

        let depth = 0;
        let foundStart = false;
        let endLine = i;
        const contentStartLine = i + 1;

        for (let j = i; j < lines.length; j++) {
            const scanLine = lines[j];
            const startPos = j === i ? optionsIdx : 0;

            for (let k = startPos; k < scanLine.length; k++) {
                if (scanLine[k] === '[') { depth++; foundStart = true; }
                if (scanLine[k] === ']') {
                    depth--;
                    if (foundStart && depth === 0) { endLine = j; break; }
                }
            }
            if (foundStart && depth === 0) break;
        }

        const contentLines = lines.slice(contentStartLine, endLine);
        const firstContentLine = contentLines.find(l => l.trim().length > 0);
        const indent = firstContentLine
            ? firstContentLine.match(/^(\s*)/)?.[1] ?? '                '
            : '                ';

        blocks.push({ startLine: contentStartLine, endLine, contentLines, indent, fieldName, operationContext: currentOperation });
    }

    return blocks;
}

interface ExistingOption {
    displayName: string;
    value: string;
}

function parseExistingOptions(optionLines: string[]): ExistingOption[] {
    const options: ExistingOption[] = [];
    const optionRegex = /\{\s*name:\s*'([^']+)',\s*value:\s*'([^']+)'/;
    for (const line of optionLines) {
        const match = line.match(optionRegex);
        if (match) options.push({ displayName: match[1], value: match[2] });
    }
    return options;
}

function syncEnumOptions(
    lines: string[],
    enumFields: EnumFieldSpec[],
    verbose: boolean,
    fileName: string,
): { updatedLines: string[]; updateCount: number; skippedManual: number } {
    const result = [...lines];
    const enumMap = new Map(enumFields.map(f => [f.fieldName, f.values]));
    const blocks = findOptionsBlocks(result);
    let updateCount = 0;
    let skippedManual = 0;

    const sortedBlocks = [...blocks].sort((a, b) => b.startLine - a.startLine);

    for (const block of sortedBlocks) {
        const specValues = enumMap.get(block.fieldName);
        if (!specValues) continue;

        const blockText = block.contentLines.join('\n');
        if (blockText.includes(MANUAL_MARKER)) {
            skippedManual++;
            if (verbose) console.log(`  ⏭  ${fileName} → ${block.fieldName}: skipped (@manual)`);
            continue;
        }

        const existingOptions = parseExistingOptions(block.contentLines);
        const existingValues = existingOptions.map(o => o.value);
        const added = specValues.filter(v => !existingValues.includes(v));
        const removed = existingValues.filter(v => !specValues.includes(v));

        if (added.length === 0 && removed.length === 0) continue;

        const existingMap = new Map(existingOptions.map(o => [o.value, o.displayName]));
        const newLines = specValues.map(value => {
            const displayName = existingMap.get(value) ?? enumValueToDisplayName(value);
            return `${block.indent}{ name: '${displayName}', value: '${value}' },`;
        });

        result.splice(block.startLine, block.endLine - block.startLine, ...newLines);
        updateCount++;

        if (verbose) {
            console.log(`  📝 ${fileName} → ${block.fieldName} (${block.operationContext}): +${added.length} -${removed.length}`);
        }
    }

    return { updatedLines: result, updateCount, skippedManual };
}

// ─── Code Generation for New Operations ─────────────────────────────

function generateOperationOption(op: ClassifiedOp, displayName: string, summary: string): string {
    const desc = escapeQuotes(summary || op.label);
    const action = `${op.label} a ${displayName}`;
    return `            { name: '${op.label}', value: '${op.value}', action: '${escapeQuotes(action)}', description: '${desc}' },`;
}

function generateFieldsForOp(
    spec: OpenApiDocument,
    resource: string,
    op: ClassifiedOp,
    ep: SpecEndpoint,
): string[] {
    const lines: string[] = [];
    const indent = '    ';

    lines.push(`${indent}// ── ${op.value} ──`);

    const pathParams = extractPathParams(ep);
    for (const param of pathParams) {
        lines.push(`${indent}{`);
        lines.push(`${indent}    displayName: '${param.displayName}',`);
        lines.push(`${indent}    name: '${param.name}',`);
        lines.push(`${indent}    type: '${param.n8nType}',`);
        lines.push(`${indent}    required: true,`);
        lines.push(`${indent}    default: ${JSON.stringify(param.defaultValue)},`);
        lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['${op.value}'] } },`);
        lines.push(`${indent}    description: '${escapeQuotes(param.description)}',`);
        lines.push(`${indent}},`);
    }

    if (op.value === 'getAll') {
        lines.push(`${indent}{`);
        lines.push(`${indent}    displayName: 'Return All',`);
        lines.push(`${indent}    name: 'returnAll',`);
        lines.push(`${indent}    type: 'boolean',`);
        lines.push(`${indent}    default: false,`);
        lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['getAll'] } },`);
        lines.push(`${indent}    description: 'Whether to return all results or only up to a given limit',`);
        lines.push(`${indent}},`);

        lines.push(`${indent}{`);
        lines.push(`${indent}    displayName: 'Limit',`);
        lines.push(`${indent}    name: 'limit',`);
        lines.push(`${indent}    type: 'number',`);
        lines.push(`${indent}    default: 50,`);
        lines.push(`${indent}    typeOptions: { minValue: 1 },`);
        lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['getAll'], returnAll: [false] } },`);
        lines.push(`${indent}    description: 'Max number of results to return',`);
        lines.push(`${indent}},`);
    }

    const queryParams = extractQueryParams(ep);
    if (queryParams.length > 0) {
        lines.push(`${indent}{`);
        lines.push(`${indent}    displayName: 'Filters',`);
        lines.push(`${indent}    name: 'filters',`);
        lines.push(`${indent}    type: 'collection',`);
        lines.push(`${indent}    placeholder: 'Add Filter',`);
        lines.push(`${indent}    default: {},`);
        lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['${op.value}'] } },`);
        lines.push(`${indent}    options: [`);
        for (const qp of queryParams) {
            if (qp.enumValues && qp.enumValues.length > 0) {
                lines.push(`${indent}        { displayName: '${qp.displayName}', name: '${qp.name}', type: 'options', default: '', description: '${escapeQuotes(qp.description)}', options: [`);
                for (const ev of qp.enumValues) {
                    lines.push(`${indent}            { name: '${enumValueToDisplayName(ev)}', value: '${ev}' },`);
                }
                lines.push(`${indent}        ] },`);
            } else {
                lines.push(`${indent}        { displayName: '${qp.displayName}', name: '${qp.name}', type: '${qp.n8nType}', default: ${JSON.stringify(qp.defaultValue)}, description: '${escapeQuotes(qp.description)}' },`);
            }
        }
        lines.push(`${indent}    ],`);
        lines.push(`${indent}},`);
    }

    const bodyFields = extractBodyFields(spec, ep);
    if (bodyFields.length > 0) {
        const isCreate = op.value === 'create';
        const collectionName = isCreate ? 'additionalFields' : (op.value === 'update' ? 'updateFields' : 'options');
        const collectionLabel = isCreate ? 'Additional Fields' : (op.value === 'update' ? 'Update Fields' : 'Options');

        const requiredFields = bodyFields.filter(f => f.required && isCreate);
        for (const rf of requiredFields) {
            if (rf.enumValues && rf.enumValues.length > 0) {
                lines.push(`${indent}{`);
                lines.push(`${indent}    displayName: '${rf.displayName}',`);
                lines.push(`${indent}    name: '${rf.name}',`);
                lines.push(`${indent}    type: 'options',`);
                lines.push(`${indent}    required: true,`);
                lines.push(`${indent}    default: '${rf.enumValues[0]}',`);
                lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['${op.value}'] } },`);
                lines.push(`${indent}    description: '${escapeQuotes(rf.description)}',`);
                lines.push(`${indent}    options: [`);
                for (const ev of rf.enumValues) {
                    lines.push(`${indent}        { name: '${enumValueToDisplayName(ev)}', value: '${ev}' },`);
                }
                lines.push(`${indent}    ],`);
                lines.push(`${indent}},`);
            } else {
                lines.push(`${indent}{`);
                lines.push(`${indent}    displayName: '${rf.displayName}',`);
                lines.push(`${indent}    name: '${rf.name}',`);
                lines.push(`${indent}    type: '${rf.n8nType}',`);
                lines.push(`${indent}    required: true,`);
                lines.push(`${indent}    default: ${JSON.stringify(rf.defaultValue)},`);
                lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['${op.value}'] } },`);
                lines.push(`${indent}    description: '${escapeQuotes(rf.description)}',`);
                lines.push(`${indent}},`);
            }
        }

        const optionalFields = bodyFields.filter(f => !(f.required && isCreate));
        if (optionalFields.length > 0) {
            lines.push(`${indent}{`);
            lines.push(`${indent}    displayName: '${collectionLabel}',`);
            lines.push(`${indent}    name: '${collectionName}',`);
            lines.push(`${indent}    type: 'collection',`);
            lines.push(`${indent}    placeholder: 'Add Field',`);
            lines.push(`${indent}    default: {},`);
            lines.push(`${indent}    displayOptions: { show: { resource: ['${resource}'], operation: ['${op.value}'] } },`);
            lines.push(`${indent}    options: [`);
            for (const of_ of optionalFields) {
                if (of_.enumValues && of_.enumValues.length > 0) {
                    lines.push(`${indent}        { displayName: '${of_.displayName}', name: '${of_.name}', type: 'options', default: '', description: '${escapeQuotes(of_.description)}', options: [`);
                    for (const ev of of_.enumValues) {
                        lines.push(`${indent}            { name: '${enumValueToDisplayName(ev)}', value: '${ev}' },`);
                    }
                    lines.push(`${indent}        ] },`);
                } else {
                    lines.push(`${indent}        { displayName: '${of_.displayName}', name: '${of_.name}', type: '${of_.n8nType}', default: ${JSON.stringify(of_.defaultValue)}, description: '${escapeQuotes(of_.description)}' },`);
                }
            }
            lines.push(`${indent}    ],`);
            lines.push(`${indent}},`);
        }
    }

    return lines;
}

// ─── Full File Generation ───────────────────────────────────────────

function generateFullDescriptionFile(
    spec: OpenApiDocument,
    config: DescriptionTagConfig,
    ops: Array<{ classified: ClassifiedOp; endpoint: SpecEndpoint }>,
): string {
    const { resource, displayName } = config;
    const lines: string[] = [];

    lines.push("import { INodeProperties } from 'n8n-workflow';");
    lines.push('');
    lines.push(`export const ${resource}Operations: INodeProperties[] = [`);
    lines.push('    {');
    lines.push("        displayName: 'Operation',");
    lines.push("        name: 'operation',");
    lines.push("        type: 'options',");
    lines.push('        noDataExpression: true,');
    lines.push(`        displayOptions: { show: { resource: ['${resource}'] } },`);
    lines.push('        options: [');

    for (const { classified, endpoint } of ops) {
        lines.push(generateOperationOption(classified, displayName, endpoint.summary));
    }

    lines.push('        ],');
    lines.push(`        default: '${ops[0]?.classified.value ?? 'get'}',`);
    lines.push('    },');
    lines.push('];');
    lines.push('');
    lines.push(`export const ${resource}Fields: INodeProperties[] = [`);

    for (const { classified, endpoint } of ops) {
        const fieldLines = generateFieldsForOp(spec, resource, classified, endpoint);
        lines.push(...fieldLines);
    }

    lines.push('];');
    lines.push('');

    return lines.join('\n');
}

// ─── Merge Logic ────────────────────────────────────────────────────

function processResource(
    spec: OpenApiDocument,
    tagName: string,
    config: DescriptionTagConfig,
    endpoints: SpecEndpoint[],
    resourceEnums: Map<string, EnumFieldSpec[]>,
    dryRun: boolean,
    verbose: boolean,
): DescriptionGenerationResult {
    const filePath = resolve(DESCRIPTIONS_DIR, `${config.descFile}.ts`);
    const fileName = `${config.descFile}.ts`;

    const classifiedOps = classifyOperations(endpoints);

    const existing = analyzeExistingFile(filePath);

    if (!existing) {
        if (classifiedOps.length === 0) {
            return { file: fileName, resource: config.resource, newOperations: [], newFieldCount: 0, enumUpdates: 0, skippedManual: 0, changed: false, isNewFile: false };
        }

        const content = generateFullDescriptionFile(spec, config, classifiedOps);
        if (!dryRun) {
            writeFileSync(filePath, content, 'utf-8');
        }

        const opNames = classifiedOps.map(o => o.classified.value);
        if (verbose) console.log(`  🆕 ${fileName}: Created with ${opNames.length} operations`);

        return {
            file: fileName,
            resource: config.resource,
            newOperations: opNames,
            newFieldCount: classifiedOps.length,
            enumUpdates: 0,
            skippedManual: 0,
            changed: true,
            isNewFile: true,
        };
    }

    let { lines } = existing;
    let totalEnumUpdates = 0;
    let totalSkippedManual = 0;

    const enumFields = resourceEnums.get(config.resource.charAt(0).toUpperCase() + config.resource.slice(1)) ?? [];
    const alternateKey = Object.values(TAG_CONFIG).find(tc => tc.resource === config.resource)?.displayName.replace(/\s+/g, '') ?? '';
    const altEnumFields = resourceEnums.get(alternateKey) ?? [];
    const allEnumFields = [...enumFields, ...altEnumFields];

    if (allEnumFields.length > 0) {
        const { updatedLines, updateCount, skippedManual } = syncEnumOptions(lines, allEnumFields, verbose, fileName);
        lines = updatedLines;
        totalEnumUpdates = updateCount;
        totalSkippedManual = skippedManual;
    }

    const excluded = OP_EXCLUSIONS[config.resource] ?? new Set<string>();
    const aliases = OP_ALIASES[config.resource] ?? {};
    const newOps = classifiedOps.filter(o => {
        const v = o.classified.value;
        if (excluded.has(v)) return false;
        return !existing.operationValues.has(aliases[v] ?? v);
    });

    if (newOps.length > 0) {
        const insertionPoint = findOperationsInsertionPoint(lines);
        if (insertionPoint >= 0) {
            const newOpLines: string[] = [];
            for (const { classified, endpoint } of newOps) {
                newOpLines.push(generateOperationOption(classified, config.displayName, endpoint.summary));
            }
            lines.splice(insertionPoint, 0, ...newOpLines);
        }

        let fieldsEnd = -1;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (lines[i].trim() === '];') {
                fieldsEnd = i;
                break;
            }
        }

        if (fieldsEnd >= 0) {
            const newFieldLines: string[] = [];
            for (const { classified, endpoint } of newOps) {
                const fieldCode = generateFieldsForOp(spec, config.resource, classified, endpoint);
                newFieldLines.push(...fieldCode);
            }
            lines.splice(fieldsEnd, 0, ...newFieldLines);
        }
    }

    const changed = totalEnumUpdates > 0 || newOps.length > 0;

    if (changed && !dryRun) {
        writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }

    const newOpNames = newOps.map(o => o.classified.value);
    if (verbose && newOpNames.length > 0) {
        console.log(`  ➕ ${fileName}: Added operations: ${newOpNames.join(', ')}`);
    }

    return {
        file: fileName,
        resource: config.resource,
        newOperations: newOpNames,
        newFieldCount: newOps.length,
        enumUpdates: totalEnumUpdates,
        skippedManual: totalSkippedManual,
        changed,
        isNewFile: false,
    };
}

export function classifyOperations(endpoints: SpecEndpoint[]): Array<{ classified: ClassifiedOp; endpoint: SpecEndpoint }> {
    const result: Array<{ classified: ClassifiedOp; endpoint: SpecEndpoint }> = [];
    const seenOps = new Set<string>();

    for (const ep of endpoints) {
        const classified = classifyEndpoint(ep);
        if (!classified) continue;

        if (seenOps.has(classified.value)) {
            if (classified.value === 'getAll' && classified.action === 'query') {
                const idx = result.findIndex(o => o.classified.value === 'getAll');
                if (idx >= 0) result[idx] = { classified, endpoint: ep };
            }
            continue;
        }

        seenOps.add(classified.value);
        result.push({ classified, endpoint: ep });
    }

    const order = ['get', 'getAll', 'create', 'update', 'delete'];
    result.sort((a, b) => {
        const ai = order.indexOf(a.classified.value);
        const bi = order.indexOf(b.classified.value);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
        return a.classified.label.localeCompare(b.classified.label);
    });

    return result;
}

function findOperationsInsertionPoint(lines: string[]): number {
    let foundOperationName = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.includes("name: 'operation'")) {
            foundOperationName = true;
        }

        if (foundOperationName && line.includes('options: [')) {
            let depth = 0;
            for (let j = i; j < lines.length; j++) {
                for (const ch of lines[j]) {
                    if (ch === '[') depth++;
                    if (ch === ']') {
                        depth--;
                        if (depth === 0) {
                            return j;
                        }
                    }
                }
            }
        }
    }

    return -1;
}

// ─── Skeleton Executor Generation ───────────────────────────────────

function generateSkeletonExecutor(config: DescriptionTagConfig, ops: Array<{ classified: ClassifiedOp }>): string {
    const funcName = `execute${pascalCase(config.resource)}`;
    const lines: string[] = [];

    lines.push("import {");
    lines.push("    IExecuteFunctions,");
    lines.push("    IDataObject,");
    lines.push("} from 'n8n-workflow';");
    lines.push('');
    lines.push("import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId } from '../GenericFunctions';");
    lines.push('');
    lines.push('');
    lines.push(`export async function ${funcName}(`);
    lines.push('    this: IExecuteFunctions,');
    lines.push('    operation: string,');
    lines.push('    i: number,');
    lines.push('): Promise<IDataObject | IDataObject[]> {');

    if (config.needsOrgId) {
        lines.push('    const orgId = await getOrganizationId.call(this);');
        lines.push('');
    }

    for (const { classified } of ops) {
        lines.push(`    if (operation === '${classified.value}') {`);
        lines.push(`        // TODO: Implement ${classified.label} operation`);
        lines.push(`        throw new Error('Operation ${classified.value} not yet implemented');`);
        lines.push('    }');
        lines.push('');
    }

    lines.push(`    throw new Error(\`Unknown operation: \${operation}\`);`);
    lines.push('}');
    lines.push('');

    return lines.join('\n');
}

function writeSkeletonExecutors(
    newResources: Map<string, { config: DescriptionTagConfig; ops: Array<{ classified: ClassifiedOp }> }>,
    dryRun: boolean,
    verbose: boolean,
): string[] {
    const created: string[] = [];

    const domainGroups = new Map<string, Array<{ config: DescriptionTagConfig; ops: Array<{ classified: ClassifiedOp }> }>>();
    for (const [, { config, ops }] of newResources) {
        const existing = domainGroups.get(config.domain) ?? [];
        existing.push({ config, ops });
        domainGroups.set(config.domain, existing);
    }

    for (const [domain, resources] of domainGroups) {
        const filePath = resolve(EXECUTORS_DIR, `${domain}.ts`);

        if (existsSync(filePath)) {
            if (verbose) console.log(`  ⏭  Executor ${domain}.ts already exists — skipping skeleton`);
            continue;
        }

        const parts: string[] = [];
        parts.push("import {");
        parts.push("    IExecuteFunctions,");
        parts.push("    IDataObject,");
        parts.push("} from 'n8n-workflow';");
        parts.push('');
        parts.push("import { cashwerkApiRequest, cashwerkApiRequestAllItems, getOrganizationId } from '../GenericFunctions';");
        parts.push('');

        for (const { config, ops } of resources) {
            parts.push('');
            parts.push(generateSkeletonExecutor(config, ops).split('\n').slice(6).join('\n'));
        }

        if (!dryRun) {
            writeFileSync(filePath, parts.join('\n'), 'utf-8');
        }

        created.push(`${domain}.ts`);
        if (verbose) console.log(`  🆕 Skeleton executor: ${domain}.ts`);
    }

    return created;
}

// ─── Report ─────────────────────────────────────────────────────────

function printReport(report: DescriptionGenerationReport, verbose: boolean): void {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  n8n Description Generation Report');
    console.log(`  Mode: ${report.mode === 'dry-run' ? 'DRY RUN (no files written)' : 'APPLY'}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log(`  Files scanned:         ${report.filesScanned}`);
    console.log(`  Files changed:         ${report.filesChanged}`);
    console.log(`  New files created:     ${report.newFilesCreated}`);
    console.log(`  New operations added:  ${report.totalNewOperations}`);
    console.log(`  Enum options synced:   ${report.totalEnumUpdates}`);
    if (report.skeletonExecutors.length > 0) {
        console.log(`  Skeleton executors:    ${report.skeletonExecutors.join(', ')}`);
    }
    console.log('');

    const changedResults = report.results.filter(r => r.changed);
    if (changedResults.length === 0) {
        console.log('  All description files are up to date.\n');
        return;
    }

    for (const result of changedResults) {
        const icon = result.isNewFile ? '🆕' : '📝';
        console.log(`  ${icon} ${result.file}:`);
        if (result.newOperations.length > 0) {
            console.log(`     + Operations: ${result.newOperations.join(', ')}`);
        }
        if (result.enumUpdates > 0) {
            console.log(`     ↻ Enum syncs: ${result.enumUpdates}`);
        }
        if (result.skippedManual > 0) {
            console.log(`     ⏭ Skipped (@manual): ${result.skippedManual}`);
        }
        console.log('');
    }

    if (verbose) {
        console.log('───────────────────────────────────────────────────────────────');
        console.log('  Unchanged files:');
        for (const result of report.results.filter(r => !r.changed)) {
            console.log(`    ✅ ${result.file}`);
        }
        console.log('');
    }
}

// ─── Main ───────────────────────────────────────────────────────────

function main(): void {
    const { dryRun, verbose, skeleton } = parseArgs();

    console.log('\n🔄 n8n Description Generator');
    console.log(`   Spec:         ${SPEC_PATH}`);
    console.log(`   Descriptions: ${DESCRIPTIONS_DIR}`);
    console.log(`   Mode:         ${dryRun ? 'DRY RUN' : 'APPLY'}`);
    console.log(`   Skeleton:     ${skeleton ? 'YES' : 'NO'}\n`);

    if (!existsSync(SPEC_PATH)) {
        console.error(`❌ OpenAPI spec not found at ${SPEC_PATH}`);
        console.error('   Run first: npm run api:export-spec\n');
        process.exit(1);
    }

    if (!existsSync(DESCRIPTIONS_DIR)) {
        console.error(`❌ Descriptions directory not found at ${DESCRIPTIONS_DIR}`);
        process.exit(1);
    }

    const specRaw = readFileSync(SPEC_PATH, 'utf-8');
    const spec: OpenApiDocument = JSON.parse(specRaw);

    const endpointsByTag = groupEndpointsByTag(spec);
    const resourceEnums = extractEnumsByResource(spec);

    if (verbose) {
        console.log(`   Tags in spec: ${endpointsByTag.size}`);
        console.log(`   Configured tags: ${Object.keys(TAG_CONFIG).length}`);
        console.log(`   Enum resources: ${resourceEnums.size}\n`);
    }

    const results: DescriptionGenerationResult[] = [];
    const newResourcesForSkeleton = new Map<string, { config: DescriptionTagConfig; ops: Array<{ classified: ClassifiedOp }> }>();
    const processedResources = new Set<string>();

    for (const [tagName, endpoints] of endpointsByTag) {
        const config = TAG_CONFIG[tagName];
        if (!config) {
            if (verbose) console.log(`  ⏭  Tag "${tagName}": no config — skipping`);
            continue;
        }

        if (processedResources.has(config.resource)) continue;
        processedResources.add(config.resource);

        let allEndpoints = endpoints;
        for (const [otherTag, otherEndpoints] of endpointsByTag) {
            if (otherTag !== tagName && TAG_CONFIG[otherTag]?.resource === config.resource) {
                allEndpoints = [...allEndpoints, ...otherEndpoints];
            }
        }

        const result = processResource(spec, tagName, config, allEndpoints, resourceEnums, dryRun, verbose);
        results.push(result);

        if (result.isNewFile && skeleton) {
            const ops = classifyOperations(allEndpoints);
            newResourcesForSkeleton.set(config.resource, { config, ops });
        }
    }

    const existingDescFiles = readdirSync(DESCRIPTIONS_DIR).filter(f => f.endsWith('Description.ts'));
    for (const descFile of existingDescFiles) {
        const resourceName = descFile.replace('Description.ts', '');
        const configEntry = Object.values(TAG_CONFIG).find(tc => tc.descFile === resourceName + 'Description' || tc.descFile + '.ts' === descFile);
        if (!configEntry) continue;

        if (!results.some(r => r.file === descFile)) {
            const enumFields = resourceEnums.get(resourceName) ?? [];
            if (enumFields.length > 0) {
                const filePath = resolve(DESCRIPTIONS_DIR, descFile);
                const content = readFileSync(filePath, 'utf-8');
                const fileLines = content.split('\n');
                const { updatedLines, updateCount, skippedManual } = syncEnumOptions(fileLines, enumFields, verbose, descFile);

                if (updateCount > 0 && !dryRun) {
                    writeFileSync(filePath, updatedLines.join('\n'), 'utf-8');
                }

                results.push({
                    file: descFile,
                    resource: configEntry.resource,
                    newOperations: [],
                    newFieldCount: 0,
                    enumUpdates: updateCount,
                    skippedManual,
                    changed: updateCount > 0,
                    isNewFile: false,
                });
            }
        }
    }

    let skeletonExecutors: string[] = [];
    if (skeleton && newResourcesForSkeleton.size > 0) {
        skeletonExecutors = writeSkeletonExecutors(newResourcesForSkeleton, dryRun, verbose);
    }

    const report: DescriptionGenerationReport = {
        generatedAt: new Date().toISOString(),
        specPath: SPEC_PATH,
        mode: dryRun ? 'dry-run' : 'apply',
        filesScanned: results.length,
        filesChanged: results.filter(r => r.changed).length,
        newFilesCreated: results.filter(r => r.isNewFile).length,
        totalNewOperations: results.reduce((sum, r) => sum + r.newOperations.length, 0),
        totalEnumUpdates: results.reduce((sum, r) => sum + r.enumUpdates, 0),
        skeletonExecutors,
        results,
    };

    printReport(report, verbose);

    if (dryRun && report.filesChanged > 0) {
        console.log(`🔴 ${report.filesChanged} file(s) would be updated. Run without --dry-run to apply.\n`);
        process.exit(1);
    }

    if (!dryRun && report.filesChanged > 0) {
        console.log(`✅ ${report.filesChanged} file(s) updated successfully.\n`);
    }

    if (!dryRun && report.filesChanged === 0) {
        console.log('✅ All description files are already up to date.\n');
    }
}

if (require.main === module) {
    main();
}
