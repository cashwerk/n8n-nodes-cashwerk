import { INodeProperties } from 'n8n-workflow';

export const salesTaxRegulationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['salesTaxRegulation'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a sales tax regulation',
				description: 'Create a new sales tax regulation',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a sales tax regulation',
				description: 'Delete a sales tax regulation by ID',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				action: 'Delete many sales tax regulations',
				description: 'Delete multiple sales tax regulations',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a sales tax regulation',
				description: 'Get a sales tax regulation by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many sales tax regulations',
				description: 'Get many sales tax regulations for the organization',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a sales tax regulation',
				description: 'Update a sales tax regulation by ID',
			},
		],
		default: 'get',
	},
];

export const salesTaxRegulationFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Sales Tax Regulation ID',
		name: 'salesTaxRegulationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['get'] },
		},
		description: 'The ID of the sales tax regulation',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['getAll'] },
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
				resource: ['salesTaxRegulation'],
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
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['create'] },
		},
	},
	{
		displayName: 'TransactionType',
		name: 'transactionType',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['create'] },
		},
	},
	{
		displayName: 'RegulationText',
		name: 'regulationText',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['create'] },
		},
	},
	{
		displayName: 'Rate',
		name: 'rate',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['create'] },
		},
	},
	// ── update ──
	{
		displayName: 'Sales Tax Regulation ID',
		name: 'salesTaxRegulationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['update'] },
		},
		description: 'The ID of the sales tax regulation',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['update'] },
		},
		options: [
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
			{
				displayName: 'RegulationText',
				name: 'regulationText',
				type: 'string',
				default: '',
			},
			{
				displayName: 'TransactionType',
				name: 'transactionType',
				type: 'string',
				default: '',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'Sales Tax Regulation ID',
		name: 'salesTaxRegulationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['delete'] },
		},
		description: 'The ID of the sales tax regulation',
	},
	// ── deleteMany ──
	{
		displayName: 'IDs',
		name: 'Ids',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: { resource: ['salesTaxRegulation'], operation: ['deleteMany'] },
		},
	},
];
