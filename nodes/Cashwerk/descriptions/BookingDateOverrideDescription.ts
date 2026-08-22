import { INodeProperties } from 'n8n-workflow';

export const bookingDateOverrideOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bookingDateOverride'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a booking date override',
				description: 'Create a date override for availability',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a booking date override',
				description: 'Delete a date override by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many a booking date override',
				description: 'List date overrides for availability',
			},
			{
				name: 'Upload Batch',
				value: 'uploadBatch',
				action: 'Upload batch a booking date override',
				description: 'Batch save date overrides for availability',
			},
		],
		default: 'getAll',
	},
];

export const bookingDateOverrideFields: INodeProperties[] = [
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['bookingDateOverride'], operation: ['getAll'] },
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
				resource: ['bookingDateOverride'],
				operation: ['getAll'],
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
			show: { resource: ['bookingDateOverride'], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'EventTypeId',
				name: 'eventTypeId',
				type: 'string',
				default: '',
				description: 'EventTypeId filter',
			},
			{
				displayName: 'From',
				name: 'from',
				type: 'string',
				default: '',
				description: 'From filter',
			},
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				default: '',
				description: 'To filter',
			},
		],
	},
	// ── create ──
	{
		displayName: 'Date',
		name: 'date',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bookingDateOverride'], operation: ['create'] },
		},
		description: 'Date value',
	},
	{
		displayName: 'IsUnavailable',
		name: 'isUnavailable',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: {
			show: { resource: ['bookingDateOverride'], operation: ['create'] },
		},
		description: 'Whether isUnavailable value',
	},
	{
		displayName: 'Timezone',
		name: 'timezone',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bookingDateOverride'], operation: ['create'] },
		},
		description: 'Timezone value',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['bookingDateOverride'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'EndTime',
				name: 'endTime',
				type: 'string',
				default: '',
				description: 'EndTime value',
			},
			{
				displayName: 'EventTypeId',
				name: 'eventTypeId',
				type: 'number',
				default: 0,
				description: 'EventTypeId value',
			},
			{
				displayName: 'StartTime',
				name: 'startTime',
				type: 'string',
				default: '',
				description: 'StartTime value',
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
			show: { resource: ['bookingDateOverride'], operation: ['delete'] },
		},
		description: 'ID value',
	},
	// ── uploadBatch ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['bookingDateOverride'], operation: ['uploadBatch'] },
		},
		options: [
			{
				displayName: 'EventTypeId',
				name: 'eventTypeId',
				type: 'number',
				default: 0,
				description: 'EventTypeId value',
			},
			{
				displayName: 'Overrides',
				name: 'overrides',
				type: 'json',
				default: '',
				description: 'Overrides value',
			},
		],
	},
];
