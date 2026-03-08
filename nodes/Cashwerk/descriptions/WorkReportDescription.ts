import { INodeProperties } from 'n8n-workflow';

const monthOptions = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 },
];

export const workReportOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['workReport'] } },
        options: [
            // ── User-Level ──
            { name: 'Get User Summary', value: 'getUserSummary', action: 'Get User Summary', description: 'Aggregated tracking metadata (hours, overtime, etc.) for a date range' },
            { name: 'Get User Report', value: 'getUserReport', action: 'Get User Report', description: 'Full user work report with tracking entries for a date range' },
            { name: 'Get User Monthly Summary', value: 'getUserMonthly', action: 'Get User Monthly Summary', description: 'Monthly aggregated summary for a user by year and month' },
            { name: 'Get User Weekly Stats', value: 'getWeekStats', action: 'Get User Weekly Stats', description: 'Weekly hour breakdown by year and month (for charts)' },
            { name: 'Get Working Days', value: 'getWorkingDays', action: 'Get Working Days', description: 'Working day and vacation day count for a date range' },
            { name: 'Query User Trackings', value: 'queryTrackings', action: 'Query User Trackings', description: 'Search and filter individual tracking entries' },
            // ── Organization-Level ──
            { name: 'Get Organization Summary', value: 'getOrgSummary', action: 'Get Organization Summary', description: 'Organization-level aggregated metadata for a date range' },
            { name: 'Get Organization Report', value: 'getOrgReport', action: 'Get Organization Report', description: 'Full organization report with all users for a date range' },
            // ── Exports ──
            { name: 'Export CSV', value: 'exportCsv', action: 'Export CSV', description: 'Generate and save a CSV report for a user' },
            { name: 'Export PDF', value: 'exportPdf', action: 'Export PDF', description: 'Generate and save a PDF report for a user' },
        ],
        default: 'getUserSummary',
    },
];

// ── Shared field helpers ──

const userIdField = (operations: string[]): INodeProperties => ({
    displayName: 'User ID',
    name: 'userId',
    type: 'options',
    required: true,
    default: '',
    typeOptions: { loadOptionsMethod: 'getUsers' },
    displayOptions: { show: { resource: ['workReport'], operation: operations } },
    description: 'The user to get the report for',
});

const startField = (operations: string[]): INodeProperties => ({
    displayName: 'Start Date',
    name: 'start',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['workReport'], operation: operations } },
    description: 'Start of the date range',
});

const endField = (operations: string[]): INodeProperties => ({
    displayName: 'End Date',
    name: 'end',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['workReport'], operation: operations } },
    description: 'End of the date range',
});

const yearField = (operations: string[]): INodeProperties => ({
    displayName: 'Year',
    name: 'year',
    type: 'number',
    required: true,
    default: new Date().getFullYear(),
    typeOptions: { minValue: 2020, maxValue: 2099 },
    displayOptions: { show: { resource: ['workReport'], operation: operations } },
    description: 'The year (e.g. 2026)',
});

const monthField = (operations: string[]): INodeProperties => ({
    displayName: 'Month',
    name: 'month',
    type: 'options',
    required: true,
    default: 1,
    options: monthOptions,
    displayOptions: { show: { resource: ['workReport'], operation: operations } },
    description: 'The month',
});

export const workReportFields: INodeProperties[] = [
    // ══════════════════════════════════════════
    // User-Level Operations
    // ══════════════════════════════════════════

    // ── getUserSummary / getUserReport / getWorkingDays: userId + start + end ──
    userIdField(['getUserSummary', 'getUserReport', 'getWorkingDays']),
    startField(['getUserSummary', 'getUserReport', 'getWorkingDays']),
    endField(['getUserSummary', 'getUserReport', 'getWorkingDays']),

    // ── getUserMonthly / getWeekStats: userId + year + month ──
    userIdField(['getUserMonthly', 'getWeekStats']),
    yearField(['getUserMonthly', 'getWeekStats']),
    monthField(['getUserMonthly', 'getWeekStats']),

    // ── queryTrackings: userId + pagination + filters ──
    userIdField(['queryTrackings']),
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['workReport'], operation: ['queryTrackings'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['workReport'], operation: ['queryTrackings'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: { show: { resource: ['workReport'], operation: ['queryTrackings'] } },
        options: [
            { displayName: 'Start Date', name: 'start', type: 'dateTime', default: '', description: 'Filter from this date' },
            { displayName: 'End Date', name: 'end', type: 'dateTime', default: '', description: 'Filter until this date' },
            { displayName: 'Sort', name: 'sort', type: 'string', default: '', description: 'Sort field' },
        ],
    },

    // ══════════════════════════════════════════
    // Organization-Level Operations
    // ══════════════════════════════════════════

    // ── getOrgSummary: start + end ──
    startField(['getOrgSummary']),
    endField(['getOrgSummary']),

    // ── getOrgReport: start + end + options ──
    startField(['getOrgReport']),
    endField(['getOrgReport']),
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['workReport'], operation: ['getOrgReport'] } },
        options: [
            { displayName: 'User IDs', name: 'userIds', type: 'json', default: '[]', description: 'Filter by specific user IDs (e.g. [1, 2, 3])' },
        ],
    },

    // ══════════════════════════════════════════
    // Export Operations
    // ══════════════════════════════════════════

    // ── exportCsv / exportPdf: userId + start + end + export options ──
    userIdField(['exportCsv', 'exportPdf']),
    startField(['exportCsv', 'exportPdf']),
    endField(['exportCsv', 'exportPdf']),
    {
        displayName: 'Export Options',
        name: 'exportOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['workReport'], operation: ['exportCsv', 'exportPdf'] } },
        options: [
            {
                displayName: 'Drive',
                name: 'driveId',
                type: 'options',
                default: '',
                typeOptions: { loadOptionsMethod: 'getDrives' },
                description: 'Save the exported file to this drive (defaults to user\'s personal drive if not set)',
            },
            { displayName: 'Folder ID', name: 'folderId', type: 'number', default: 0, description: 'Save the exported file into this folder within the drive' },
        ],
    },
];
