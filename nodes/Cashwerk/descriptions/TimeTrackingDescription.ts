import { INodeProperties } from 'n8n-workflow';

export const timeTrackingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['timeTracking'] } },
		options: [
			{
				name: 'Breaks',
				value: 'breaks',
				action: 'Get time tracking breaks',
				description: 'Create a new break entry',
			},
			{
				name: 'Create Break',
				value: 'createBreak',
				action: 'Create a time tracking break',
				description: 'Create a new break entry',
			},
			{
				name: 'Delete Break',
				value: 'deleteBreak',
				action: 'Delete a time tracking break',
				description: 'Delete a break entry',
			},
			{
				name: 'Delete Breaks',
				value: 'deleteBreaks',
				action: 'Delete many time tracking breaks',
				description: 'Bulk delete break entries',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a time tracking',
				description: 'Get time entries for a user on a specific date',
			},
			{
				name: 'Get By Date Range',
				value: 'getByDateRange',
				action: 'Get time trackings by date range',
				description: 'Get time entries for a user in a date range',
			},
			{
				name: 'Get Running',
				value: 'getRunning',
				action: 'Get running time tracker',
				description: 'Get the currently running tracker for a user',
			},
			{
				name: 'Get Task Trackings',
				value: 'getTaskTrackings',
				action: 'Get time trackings of a task',
				description: 'Get time entries for a task',
			},
			{
				name: 'Pause Tracker',
				value: 'pauseTracker',
				action: 'Pause time tracker',
				description: 'Pause the live tracker',
			},
			{
				name: 'Resume Tracker',
				value: 'resumeTracker',
				action: 'Resume time tracker',
				description: 'Resume the live tracker',
			},
			{
				name: 'Start Tracker',
				value: 'startTracker',
				action: 'Start time tracker',
				description: 'Start the live tracker',
			},
			{
				name: 'Stop Tracker',
				value: 'stopTracker',
				action: 'Stop time tracker',
				description: 'Stop the live tracker',
			},
			{
				name: 'Trackings',
				value: 'trackings',
				action: 'Get all time trackings',
				description: 'Create a new time tracking entry',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a time tracking',
				description: 'Update a time tracking entry',
			},
			{
				name: 'Update GPS',
				value: 'updateGps',
				action: 'Update the GPS position of a running tracker',
				description: 'Update GPS data for a tracking entry',
			},
		],
		default: 'get',
	},
];

export const timeTrackingFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['get'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['get'] },
		},
		description: 'Date to get time entries for (ISO 8601, e.g. 2026-02-20)',
	},
	// ── update ──
	{
		displayName: 'Time Tracking ID',
		name: 'timeTrackingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['update'] },
		},
		description: 'The ID of the time tracking',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'AssignedUserIds',
				name: 'assignedUserIds',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'CategoryId',
				name: 'categoryId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'End',
				name: 'end',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Negative',
				name: 'negative',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
			},
			{
				displayName: 'ProjectId',
				name: 'projectId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'ACTIVE',
				options: [
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Done', value: 'DONE' },
					{ name: 'Inactive', value: 'INACTIVE' },
					{ name: 'Paused', value: 'PAUSED' },
				],
			},
			{
				displayName: 'TagIds',
				name: 'tagIds',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'WORKTIME',
				options: [
					{ name: 'Home Office', value: 'HOMEOFFICE' },
					{ name: 'Overtime Payout', value: 'OVERTIME_PAYOUT' },
					{ name: 'Overtime Vacation', value: 'OVERTIME_VACATION' },
					{ name: 'Project Work', value: 'PROJECTWORK' },
					{ name: 'Travel Time', value: 'TRAVELTIME' },
					{ name: 'Work Time', value: 'WORKTIME' },
				],
			},
		],
	},
	// ── breaks ──
	{
		displayName: 'Start',
		name: 'start',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['breaks'] },
		},
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['breaks'] },
		},
	},
	{
		displayName: 'TrackingId',
		name: 'trackingId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['breaks'] },
		},
	},
	{
		displayName: 'AssignedUserIds',
		name: 'assignedUserIds',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['breaks'] },
		},
	},
	// ── getByDateRange ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getByDateRange'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getByDateRange'] },
		},
		description: 'Start date (ISO 8601)',
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getByDateRange'] },
		},
		description: 'End date (ISO 8601)',
	},
	{
		displayName: 'Additional Filters',
		name: 'additionalFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getByDateRange'] },
		},
		options: [
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'number',
				default: 0,
				description: 'Filter results by a specific task ID',
			},
		],
	},
	// ── getRunning ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getRunning'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── pauseTracker ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['pauseTracker'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Tracker ID',
		name: 'trackerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['pauseTracker'] },
		},
		description: 'The ID of the tracker',
	},
	// ── resumeTracker ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['resumeTracker'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Tracker ID',
		name: 'trackerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['resumeTracker'] },
		},
		description: 'The ID of the tracker',
	},
	// ── startTracker ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['startTracker'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'FromTrackingId',
		name: 'fromTrackingId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['startTracker'] },
		},
	},
	{
		displayName: 'TaskId',
		name: 'taskId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['startTracker'] },
		},
	},
	// ── stopTracker ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['stopTracker'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Tracker ID',
		name: 'trackerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['stopTracker'] },
		},
		description: 'The ID of the tracker',
	},
	// ── trackings ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['trackings'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'AssignedUserIds',
				name: 'assignedUserIds',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'Billable',
				name: 'billable',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'CategoryId',
				name: 'categoryId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'End',
				name: 'end',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Negative',
				name: 'negative',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'ACTIVE',
				options: [
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'Done', value: 'DONE' },
					{ name: 'Inactive', value: 'INACTIVE' },
					{ name: 'Paused', value: 'PAUSED' },
				],
			},
			{
				displayName: 'TagIds',
				name: 'tagIds',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'WORKTIME',
				options: [
					{ name: 'Home Office', value: 'HOMEOFFICE' },
					{ name: 'Overtime Payout', value: 'OVERTIME_PAYOUT' },
					{ name: 'Overtime Vacation', value: 'OVERTIME_VACATION' },
					{ name: 'Project Work', value: 'PROJECTWORK' },
					{ name: 'Travel Time', value: 'TRAVELTIME' },
					{ name: 'Work Time', value: 'WORKTIME' },
				],
			},
		],
	},
	// ── getAll ──
	{
		displayName: 'TaskId',
		name: 'taskId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getAll'] },
		},
		description: 'TaskId value',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['getAll'] },
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
				resource: ['timeTracking'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// ── create ──
	{
		displayName: 'Start',
		name: 'start',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['create'] },
		},
		description: 'Start value',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'AssignedUserIds',
				name: 'assignedUserIds',
				type: 'json',
				default: '',
				description: 'AssignedUserIds value',
			},
			{
				displayName: 'End',
				name: 'end',
				type: 'string',
				default: '',
				description: 'End value',
			},
			{
				displayName: 'TrackingId',
				name: 'trackingId',
				type: 'number',
				default: 0,
				description: 'TrackingId value',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['delete'] },
		},
		description: 'ID value',
	},
	// ── deleteBulk ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['deleteBulk'] },
		},
		options: [
			{
				displayName: 'BreakIds',
				name: 'breakIds',
				type: 'json',
				default: '',
				description: 'BreakIds value',
			},
		],
	},
	// ── updateGps ──
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['updateGps'] },
		},
		description: 'UserId value',
	},
	{
		displayName: 'TrackerId',
		name: 'trackerId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['updateGps'] },
		},
		description: 'TrackerId value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['timeTracking'], operation: ['updateGps'] },
		},
		options: [
			{
				displayName: 'Accuracy',
				name: 'accuracy',
				type: 'number',
				default: 0,
				description: 'Accuracy value',
			},
			{
				displayName: 'Altitude',
				name: 'altitude',
				type: 'number',
				default: 0,
				description: 'Altitude value',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 0,
				description: 'Latitude value',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: 0,
				description: 'Longitude value',
			},
			{
				displayName: 'Speed',
				name: 'speed',
				type: 'number',
				default: 0,
				description: 'Speed value',
			},
			{
				displayName: 'Timestamp',
				name: 'timestamp',
				type: 'string',
				default: '',
				description: 'Timestamp value',
			},
		],
	},
];
