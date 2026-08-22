import { INodeProperties } from 'n8n-workflow';

export const taxRateOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['taxRate'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a tax rate',
				description: 'Create a new tax rate',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a tax rate',
				description: 'Delete a tax rate by ID',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				action: 'Delete many tax rates',
				description: 'Delete multiple tax rates',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a tax rate',
				description: 'Get a tax rate by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many tax rates',
				description: 'Get many tax rates for the organization',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a tax rate',
				description: 'Update a tax rate',
			},
		],
		default: 'get',
	},
];

export const taxRateFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Tax Rate ID',
		name: 'taxRateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['taxRate'], operation: ['get'] } },
		description: 'The ID of the tax rate',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['taxRate'], operation: ['getAll'] } },
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
				resource: ['taxRate'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// ── create ──
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
	},
	{
		displayName: 'CountryCode',
		name: 'countryCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
	},
	{
		displayName: 'IsDefault',
		name: 'isDefault',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
	},
	// ── update ──
	{
		displayName: 'Tax Rate ID',
		name: 'taxRateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['taxRate'], operation: ['update'] } },
		description: 'The ID of the tax rate',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['taxRate'], operation: ['update'] } },
		options: [
			{
				displayName: 'CountryCode',
				name: 'countryCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IsDefault',
				name: 'isDefault',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Rate',
				name: 'rate',
				type: 'number',
				default: 0,
			},
		],
	},
	// ── delete ──
	{
		displayName: 'Tax Rate ID',
		name: 'taxRateId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['taxRate'], operation: ['delete'] } },
		description: 'The ID of the tax rate',
	},
	// ── deleteMany ──
	{
		displayName: 'IDs',
		name: 'Ids',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { resource: ['taxRate'], operation: ['deleteMany'] },
		},
	},
];
