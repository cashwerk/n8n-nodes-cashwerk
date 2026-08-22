import { INodeProperties } from 'n8n-workflow';

export const workTimeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['workTime'] } },
		options: [
			{
				name: 'Bulk Assign',
				value: 'bulkAssign',
				action: 'Bulk assign a work time',
				description: 'Assign one time model to multiple users',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a work time',
				description: 'Delete a work time period',
			},
			{
				name: 'For User',
				value: 'forUser',
				action: 'Get work time for user',
				description: 'Create a work time period for a user',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get work time',
				description: 'Get latest work time for a user',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a work time',
				description: 'Edit an existing work time period (contract history entry)',
			},
			{
				name: 'Update Vacation Days',
				value: 'updateVacationDays',
				action: 'Update vacation days a work time',
				description: 'Update vacation days for a user',
			},
			{
				name: 'Update Work Days',
				value: 'updateWorkDays',
				action: 'Update work days a work time',
				description: 'Update work days for a user',
			},
		],
		default: 'get',
	},
];

export const workTimeFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'number',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['workTime'], operation: ['get'] } },
		description: 'The ID of the user to get the latest work time for',
	},
	// ── forUser ──
	{
		displayName: 'WorkTimeId',
		name: 'workTimeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['workTime'], operation: ['forUser'] },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { resource: ['workTime'], operation: ['forUser'] },
		},
		options: [
			{
				displayName: 'CreateNew',
				name: 'createNew',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'End',
				name: 'end',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'Overtime',
				name: 'overtime',
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
				displayName: 'VacationDays',
				name: 'vacationDays',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'WorkDays',
				name: 'workDays',
				type: 'json',
				default: '{}',
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
		displayOptions: { show: { resource: ['workTime'], operation: ['delete'] } },
		description: 'ID value',
	},
	{
		displayName: 'WorkTimeId',
		name: 'workTimeId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['workTime'], operation: ['delete'] } },
		description: 'WorkTimeId value',
	},
	// ── updateVacationDays ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workTime'], operation: ['updateVacationDays'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['workTime'], operation: ['updateVacationDays'] },
		},
		options: [
			{
				displayName: 'CreateNew',
				name: 'createNew',
				type: 'boolean',
				default: false,
				description: 'Whether createNew value',
			},
			{
				displayName: 'VacationDays',
				name: 'vacationDays',
				type: 'number',
				default: 0,
				description: 'VacationDays value',
			},
			{
				displayName: 'WorkDays',
				name: 'workDays',
				type: 'json',
				default: '',
				description: 'WorkDays value',
			},
		],
	},
	// ── updateWorkDays ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['workTime'], operation: ['updateWorkDays'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['workTime'], operation: ['updateWorkDays'] },
		},
		options: [
			{
				displayName: 'CreateNew',
				name: 'createNew',
				type: 'boolean',
				default: false,
				description: 'Whether createNew value',
			},
			{
				displayName: 'VacationDays',
				name: 'vacationDays',
				type: 'number',
				default: 0,
				description: 'VacationDays value',
			},
			{
				displayName: 'WorkDays',
				name: 'workDays',
				type: 'json',
				default: '',
				description: 'WorkDays value',
			},
		],
	},
	// ── update ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['workTime'], operation: ['update'] } },
		description: 'ID value',
	},
	{
		displayName: 'WorkTimeId',
		name: 'workTimeId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['workTime'], operation: ['update'] } },
		description: 'WorkTimeId value',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['workTime'], operation: ['update'] } },
		options: [
			{
				displayName: 'End',
				name: 'end',
				type: 'string',
				default: '',
				description: 'End of the contract period (null = current/open period)',
			},
			{
				displayName: 'Overtime',
				name: 'overtime',
				type: 'number',
				default: 0,
				description: 'Opening overtime of the period',
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'string',
				default: '',
				description: 'Start of the contract period',
			},
			{
				displayName: 'VacationDays',
				name: 'vacationDays',
				type: 'number',
				default: 0,
				description: 'Vacation days for the period',
			},
			{
				displayName: 'WorkDays',
				name: 'workDays',
				type: 'json',
				default: '',
				description: 'Weekly schedule of the time model',
			},
		],
	},
	// ── bulkAssign ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['workTime'], operation: ['bulkAssign'] } },
		options: [
			{
				displayName: 'Overtime',
				name: 'overtime',
				type: 'number',
				default: 0,
				description: 'Opening overtime for the new period',
			},
			{
				displayName: 'Start',
				name: 'start',
				type: 'string',
				default: '',
				description: 'Start of the new contract period',
			},
			{
				displayName: 'UserIds',
				name: 'userIds',
				type: 'json',
				default: '',
				description: 'Users to assign the time model to',
			},
			{
				displayName: 'VacationDays',
				name: 'vacationDays',
				type: 'number',
				default: 0,
				description: 'Vacation days for the new period',
			},
			{
				displayName: 'WorkDays',
				name: 'workDays',
				type: 'json',
				default: '',
				description: 'Weekly schedule of the time model',
			},
		],
	},
];
