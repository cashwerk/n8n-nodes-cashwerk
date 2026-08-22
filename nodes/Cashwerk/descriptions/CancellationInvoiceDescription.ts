import { INodeProperties } from 'n8n-workflow';

export const cancellationInvoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['cancellationInvoice'] } },
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a cancellation invoice',
				description: 'Archive a cancellation invoice by ID',
			},
			{
				name: 'Archive Many',
				value: 'archiveMany',
				action: 'Archive many a cancellation invoice',
				description: 'Archive multiple cancellation invoices',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a cancellation invoice',
				description: 'Create a new cancellation invoice',
			},
			{
				name: 'Create X Invoice',
				value: 'createXInvoice',
				action: 'Create cancellation x invoice xml',
				description: 'Create XRechnung document for a cancellation invoice',
			},
			{
				name: 'Create Zugferd',
				value: 'createZugferd',
				action: 'Create cancellation zug fe rd',
				description: 'Create ZUGFeRD document for a cancellation invoice',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				action: 'Delete many a cancellation invoice',
				description: 'Delete multiple cancellation invoices',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a cancellation invoice',
				description: 'Get a cancellation invoice by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many cancellation invoices',
				description: 'Query cancellation invoices with pagination and filters',
			},
			{
				name: 'Get Preview',
				value: 'getPreview',
				action: 'Get preview a cancellation invoice',
				description: 'Get cancellation invoice PDF preview',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore a cancellation invoice',
				description: 'Restore an archived cancellation invoice by ID',
			},
			{
				name: 'Restore Many',
				value: 'restoreMany',
				action: 'Restore many a cancellation invoice',
				description: 'Restore multiple archived cancellation invoices',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a cancellation invoice',
				description: 'Update a cancellation invoice by ID',
			},
		],
		default: 'get',
	},
];

export const cancellationInvoiceFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Cancellation Invoice ID',
		name: 'cancellationInvoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['get'] },
		},
		description: 'The ID of the cancellation invoice',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['getAll'] },
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
				resource: ['cancellationInvoice'],
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
			show: { resource: ['cancellationInvoice'], operation: ['getAll'] },
		},
		options: [
			{
				displayName: 'DateFrom',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Filter from date',
			},
			{
				displayName: 'DateTo',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Filter to date',
			},
			{
				displayName: 'IncludeArchived',
				name: 'includeArchived',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'ProjectIds',
				name: 'projectIds',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'ProviderFilter',
				name: 'providerFilter',
				type: 'string',
				default: '',
			},
			{
				displayName: 'RecipientFilter',
				name: 'recipientFilter',
				type: 'string',
				default: '',
			},
			{
				displayName: 'SearchQuery',
				name: 'searchQuery',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'SortBy',
				name: 'sortBy',
				type: 'string',
				default: '',
			},
			{
				displayName: 'SortType',
				name: 'sortType',
				type: 'string',
				default: '',
			},
			{
				displayName: 'StatusFilter',
				name: 'statusFilter',
				type: 'string',
				default: '',
			},
			{
				displayName: 'SubjectFilter',
				name: 'subjectFilter',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Take',
				name: 'take',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'UserIds',
				name: 'userIds',
				type: 'json',
				default: '{}',
			},
		],
	},
	// ── update ──
	{
		displayName: 'Cancellation Invoice ID',
		name: 'cancellationInvoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['update'] },
		},
		description: 'The ID of the cancellation invoice',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'AssigneeIds',
				name: 'assigneeIds',
				type: 'json',
				default: '{}',
			},
		],
	},
	// ── archive ──
	{
		displayName: 'Cancellation Invoice ID',
		name: 'cancellationInvoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['archive'] },
		},
		description: 'The ID of the cancellation invoice',
	},
	// ── createXInvoice ──
	{
		displayName: 'Cancellation Invoice ID',
		name: 'cancellationInvoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['cancellationInvoice'],
				operation: ['createXInvoice'],
			},
		},
		description: 'The ID of the cancellation invoice',
	},
	// ── createZugferd ──
	{
		displayName: 'Cancellation Invoice ID',
		name: 'cancellationInvoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['createZugferd'] },
		},
		description: 'The ID of the cancellation invoice',
	},
	// ── create ──
	{
		displayName: 'OriginalInvoiceId',
		name: 'originalInvoiceId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['create'] },
		},
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'options',
		default: 'CUSTOMER_REQUEST',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['create'] },
		},
		description: 'Reason for the cancellation',
		options: [
			{ name: 'Billing Error', value: 'BILLING_ERROR' },
			{ name: 'Customer Request', value: 'CUSTOMER_REQUEST' },
			{ name: 'Goods Returned', value: 'GOODS_RETURNED' },
			{ name: 'Other', value: 'OTHER' },
			{ name: 'Pricing Error', value: 'PRICING_ERROR' },
		],
	},
	{
		displayName: 'ReasonDescription',
		name: 'reasonDescription',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['create'] },
		},
	},
	// ── restore ──
	{
		displayName: 'Cancellation Invoice ID',
		name: 'cancellationInvoiceId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['restore'] },
		},
		description: 'The ID of the cancellation invoice',
	},
	// ── archiveMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['archiveMany'] },
		},
		options: [
			{
				displayName: 'IDs',
				name: 'Ids',
				type: 'json',
				default: '',
				description: 'IDs value',
			},
		],
	},
	// ── deleteMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['deleteMany'] },
		},
		options: [
			{
				displayName: 'IDs',
				name: 'Ids',
				type: 'json',
				default: '',
				description: 'IDs value',
			},
		],
	},
	// ── getPreview ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['getPreview'] },
		},
		description: 'ID value',
	},
	// ── restoreMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['cancellationInvoice'], operation: ['restoreMany'] },
		},
		options: [
			{
				displayName: 'IDs',
				name: 'Ids',
				type: 'json',
				default: '',
				description: 'IDs value',
			},
		],
	},
];
