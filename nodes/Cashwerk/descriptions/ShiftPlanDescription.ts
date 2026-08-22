import { INodeProperties } from 'n8n-workflow';

const trackingTypeOptions = [
	{ name: 'Worktime', value: 'WORKTIME' },
	{ name: 'Project Work', value: 'PROJECTWORK' },
	{ name: 'Travel Time', value: 'TRAVELTIME' },
	{ name: 'Home Office', value: 'HOMEOFFICE' },
	{ name: 'Overtime Payout', value: 'OVERTIME_PAYOUT' },
	{ name: 'Overtime Vacation', value: 'OVERTIME_VACATION' },
];

export const shiftPlanOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['shiftPlan'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a shift plan',
				description: 'Create a new shift plan',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a shift plan',
				description: 'Delete a shift plan',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				action: 'Duplicate a shift plan',
				description: 'Duplicate a shift plan',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a shift plan',
				description: 'Get shift plan by ID',
			},
			{
				name: 'Get By Date Range',
				value: 'getByDateRange',
				action: 'Get shift plans by date range',
				description: 'Get shift plans by user with date range',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many shift plans',
				description: 'Get shift plans by user',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a shift plan',
				description: 'Update a shift plan',
			},
		],
		default: 'get',
	},
];

export const shiftPlanFields: INodeProperties[] = [
	// ── create ──
	{
		displayName: 'Start',
		name: 'start',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['create'] },
		},
		description: 'Start date (ISO format)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'json',
				default: '{}',
				description: 'Address (JSON object)',
			},
			{
				displayName: 'Assigned User IDs',
				name: 'assignedUserIds',
				type: 'json',
				default: '[]',
				description: 'Array of user IDs to assign (e.g. [1, 2, 3])',
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
				description: 'End date (ISO format)',
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
				description: 'Project name',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Tag IDs',
				name: 'tagIds',
				type: 'json',
				default: '[]',
				description: 'Array of tag IDs (e.g. [1, 2])',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'WORKTIME',
				options: trackingTypeOptions,
				description: 'Shift type',
			},
		],
	},
	// ── get ──
	{
		displayName: 'Shift Plan ID',
		name: 'shiftPlanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['shiftPlan'], operation: ['get'] } },
		description: 'The ID of the shift plan',
	},
	// ── getAll ──
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getUsers' },
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['getAll'] },
		},
		description:
			'The ID of the user. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['getAll'] },
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
				resource: ['shiftPlan'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// ── update ──
	{
		displayName: 'Shift Plan ID',
		name: 'shiftPlanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['update'] },
		},
		description: 'The ID of the shift plan',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'json',
				default: '{}',
				description: 'Address (JSON object)',
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
				description: 'End date',
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
				description: 'Project name',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'dateTime',
				default: '',
				description: 'Start date',
			},
			{
				displayName: 'Tag IDs',
				name: 'tagIds',
				type: 'json',
				default: '[]',
				description: 'Array of tag IDs (e.g. [1, 2])',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'WORKTIME',
				options: trackingTypeOptions,
				description: 'Shift type',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'number',
				default: 0,
				description: 'Reassign to a different user',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'Shift Plan ID',
		name: 'shiftPlanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['delete'] },
		},
		description: 'The ID of the shift plan',
	},
	// ── duplicate ──
	{
		displayName: 'Shift Plan ID',
		name: 'shiftPlanId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['duplicate'] },
		},
		description: 'The ID of the shift plan',
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
			show: { resource: ['shiftPlan'], operation: ['getByDateRange'] },
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
			show: { resource: ['shiftPlan'], operation: ['getByDateRange'] },
		},
		description: 'Start date (ISO format)',
	},
	{
		displayName: 'End',
		name: 'end',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['shiftPlan'], operation: ['getByDateRange'] },
		},
		description: 'End date (ISO format)',
	},
];
