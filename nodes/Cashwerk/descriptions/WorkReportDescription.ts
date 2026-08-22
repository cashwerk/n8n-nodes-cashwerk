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
			{
				name: 'Export CSV',
				value: 'exportCsv',
				action: 'Export CSV',
				description: 'Generate and save a CSV report for a user',
			},
			{
				name: 'Export PDF',
				value: 'exportPdf',
				action: 'Export PDF',
				description: 'Generate and save a PDF report for a user',
			},
			{
				name: 'Get Organization Report',
				value: 'getOrgReport',
				action: 'Get organization report',
				description: 'Full organization report with all users for a date range',
			},
			// ── Organization-Level ──
			{
				name: 'Get Organization Summary',
				value: 'getOrgSummary',
				action: 'Get organization summary',
				description: 'Organization-level aggregated metadata for a date range',
			},
			{
				name: 'Get User Monthly Summary',
				value: 'getUserMonthly',
				action: 'Get user monthly summary',
				description: 'Monthly aggregated summary for a user by year and month',
			},
			// ── Exports ──
			{
				name: 'Get User Report',
				value: 'getUserReport',
				action: 'Get user report',
				description: 'Full user work report with tracking entries for a date range',
			},
			{
				name: 'Get User Summary',
				value: 'getUserSummary',
				action: 'Get user summary',
				description: 'Aggregated tracking metadata (hours, overtime, etc.) for a date range',
			},
			{
				name: 'Get User Weekly Stats',
				value: 'getWeekStats',
				action: 'Get user weekly stats',
				description: 'Weekly hour breakdown by year and month (for charts)',
			},
			{
				name: 'Get Working Days',
				value: 'getWorkingDays',
				action: 'Get working days',
				description: 'Working day and vacation day count for a date range',
			},
			{
				name: 'Query User Trackings',
				value: 'queryTrackings',
				action: 'Query user trackings',
				description: 'Search and filter individual tracking entries',
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start a work report',
				description: 'Get user working days in range for vacation calculation',
			},
		],
		default: 'getUserSummary',
	},
];

// ── Shared field helpers ──

const userIdField = (operations: string[]): INodeProperties => ({
	displayName: 'User Name or ID',
	name: 'userId',
	type: 'options',
	required: true,
	default: '',
	typeOptions: { loadOptionsMethod: 'getUsers' },
	displayOptions: { show: { resource: ['workReport'], operation: operations } },
	description:
		'The user to get the report for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		displayOptions: {
			show: { resource: ['workReport'], operation: ['queryTrackings'] },
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['workReport'],
				operation: ['queryTrackings'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['workReport'], operation: ['queryTrackings'] },
		},
		options: [
			{
				displayName: 'End Date',
				name: 'end',
				type: 'dateTime',
				default: '',
				description: 'Filter until this date',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'string',
				default: '',
				description: 'Sort field',
			},
			{
				displayName: 'Start Date',
				name: 'start',
				type: 'dateTime',
				default: '',
				description: 'Filter from this date',
			},
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
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getOrgReport'] },
		},
		options: [
			{
				displayName: 'User IDs',
				name: 'userIds',
				type: 'json',
				default: '[]',
				description: 'Filter by specific user IDs (e.g. [1, 2, 3])',
			},
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
		displayOptions: {
			show: { resource: ['workReport'], operation: ['exportCsv', 'exportPdf'] },
		},
		options: [
			{
				displayName: 'Drive Name or ID',
				name: 'driveId',
				type: 'options',
				default: '',
				typeOptions: { loadOptionsMethod: 'getDrives' },
				description:
					'Save the exported file to this drive (defaults to user\'s personal drive if not set). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Folder ID',
				name: 'folderId',
				type: 'number',
				default: 0,
				description: 'Save the exported file into this folder within the drive',
			},
		],
	},
	// ── get ──
	{
		displayName: 'Start',
		name: 'start',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['workReport'], operation: ['get'] } },
		description: 'Start value',
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['workReport'], operation: ['get'] } },
		description: 'End value',
	},
	// ── getAll ──
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getAll'] },
		},
		description: 'UserId value',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getAll'] },
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['workReport'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'End',
				name: 'end',
				type: 'string',
				default: '',
				description: 'End value',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'ASC',
				description: 'Sort value',
				options: [
					{ name: 'Asc', value: 'ASC' },
					{ name: 'Desc', value: 'DESC' },
				],
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'string',
				default: '',
				description: 'Start value',
			},
		],
	},
	// ── getByDateRange ──
	{
		displayName: 'Start',
		name: 'start',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getByDateRange'] },
		},
		description: 'Start value',
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getByDateRange'] },
		},
		description: 'End value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['workReport'], operation: ['getByDateRange'] },
		},
		options: [
			{
				displayName: 'End',
				name: 'end',
				type: 'string',
				default: '',
				description: 'End value',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'ASC',
				description: 'Sort value',
				options: [
					{ name: 'Asc', value: 'ASC' },
					{ name: 'Desc', value: 'DESC' },
				],
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'string',
				default: '',
				description: 'Start value',
			},
		],
	},
	// ── start ──
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['start'] },
		},
		description: 'UserId value',
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['start'] },
		},
		description: 'Start value',
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workReport'], operation: ['start'] },
		},
		description: 'End value',
	},
];
