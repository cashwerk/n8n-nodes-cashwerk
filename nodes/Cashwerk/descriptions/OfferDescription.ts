import { INodeProperties } from 'n8n-workflow';

export const offerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['offer'] } },
		options: [
			{
				name: 'Accept',
				value: 'accept',
				action: 'Accept a offer',
				description: 'Mark a committed offer as accepted by the customer',
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive an offer',
				description: 'Archive an offer by ID',
			},
			{
				name: 'Archive Many',
				value: 'archiveMany',
				action: 'Archive many a offer',
				description: 'Archive multiple offers',
			},
			{
				name: 'Book',
				value: 'book',
				action: 'Book an offer',
				description: 'Book an offer by ID',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel an offer',
				description: 'Cancel an offer by ID',
			},
			{
				name: 'Convert To Invoice',
				value: 'convertToInvoice',
				action: 'Convert offer to invoice',
				description: 'Convert an offer to an invoice',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an offer',
				description: 'Create a new offer',
			},
			{
				name: 'Create From Deal',
				value: 'createFromDeal',
				action: 'Create offer from deal',
				description: 'Create an offer from a deal',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a offer',
				description: 'Delete an offer by ID',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				action: 'Delete many a offer',
				description: 'Delete multiple offers',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an offer',
				description: 'Get a single offer by ID',
			},
			{
				name: 'Get Dashboard',
				value: 'getDashboard',
				action: 'Get dashboard a offer',
				description: 'Get an offer dashboard by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many offers',
				description: 'Query offers with pagination and filters',
			},
			{
				name: 'Get Preview',
				value: 'getPreview',
				action: 'Get preview a offer',
				description: 'Get offer PDF preview',
			},
			{
				name: 'Preview From Data',
				value: 'previewFromDto',
				action: 'Preview an offer from draft data',
				description: 'Preview offer from DTO changes',
			},
			{
				name: 'Reject',
				value: 'reject',
				action: 'Reject a offer',
				description: 'Mark a committed offer as rejected by the customer',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore an offer',
				description: 'Restore an archived offer by ID',
			},
			{
				name: 'Restore Many',
				value: 'restoreMany',
				action: 'Restore many a offer',
				description: 'Restore multiple archived offers',
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send an offer',
				description: 'Send an offer by email',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an offer',
				description: 'Update an offer by ID',
			},
		],
		default: 'get',
	},
];

export const offerFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['get'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['offer'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['offer'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['offer'], operation: ['getAll'] } },
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
				type: 'options',
				default: 'ASC',
				options: [
					{ name: 'Ascending', value: 'ASC' },
					{ name: 'Descending', value: 'DESC' },
				],
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
	// ── create ──
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['offer'], operation: ['create'] } },
		options: [
			{
				displayName: 'Customer',
				name: 'customer',
				type: 'json',
				default: '{}',
				description: 'Customer details (clientType, clientId, billingAddress, etc.)',
			},
			{
				displayName: 'Invoice Lines',
				name: 'invoiceLines',
				type: 'json',
				default: '',
				description:
					'JSON array of invoice line items. Leave empty to keep existing lines unchanged.',
			},
			{
				displayName: 'Linking Options',
				name: 'linkingOptions',
				type: 'json',
				default: '{}',
				description: 'Link to project, contact user, status',
			},
			{
				displayName: 'Offer',
				name: 'offer',
				type: 'json',
				default: '{}',
				description: 'Offer details (title, offerDate, netGross, type, etc.)',
			},
			{
				displayName: 'Payment Options',
				name: 'paymentOptions',
				type: 'json',
				default: '{}',
				description: 'Payment options (currencyCode, etc.)',
			},
			{
				displayName: 'Payment Terms',
				name: 'paymentTerms',
				type: 'json',
				default: '{}',
				description: 'Payment terms (dueDate, skonto, etc.)',
			},
			{
				displayName: 'PDF Options',
				name: 'pdfOptions',
				type: 'json',
				default: '{}',
				description: 'PDF generation options',
			},
			{
				displayName: 'Total Discounts',
				name: 'totalDiscounts',
				type: 'json',
				default: '',
				description:
					'JSON array of discount values. Leave empty to keep existing discounts unchanged.',
			},
		],
	},
	// ── update ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['update'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['offer'], operation: ['update'] } },
		options: [
			{
				displayName: 'Customer',
				name: 'customer',
				type: 'json',
				default: '{}',
				description: 'Customer details (clientType, clientId, billingAddress, etc.)',
			},
			{
				displayName: 'Invoice Lines',
				name: 'invoiceLines',
				type: 'json',
				default: '',
				description:
					'JSON array of invoice line items. Leave empty to keep existing lines unchanged.',
			},
			{
				displayName: 'Linking Options',
				name: 'linkingOptions',
				type: 'json',
				default: '{}',
				description: 'Link to project, contact user, status',
			},
			{
				displayName: 'Offer',
				name: 'offer',
				type: 'json',
				default: '{}',
				description: 'Offer details (title, offerDate, netGross, type, etc.)',
			},
			{
				displayName: 'Payment Options',
				name: 'paymentOptions',
				type: 'json',
				default: '{}',
				description: 'Payment options (currencyCode, etc.)',
			},
			{
				displayName: 'Payment Terms',
				name: 'paymentTerms',
				type: 'json',
				default: '{}',
				description: 'Payment terms (dueDate, skonto, etc.)',
			},
			{
				displayName: 'PDF Options',
				name: 'pdfOptions',
				type: 'json',
				default: '{}',
				description: 'PDF generation options',
			},
			{
				displayName: 'Total Discounts',
				name: 'totalDiscounts',
				type: 'json',
				default: '',
				description:
					'JSON array of discount values. Leave empty to keep existing discounts unchanged.',
			},
		],
	},
	// ── archive ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['archive'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── book ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['book'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── cancel ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['cancel'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── convertToInvoice ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: {
			show: { resource: ['offer'], operation: ['convertToInvoice'] },
		},
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── createFromDeal ──
	{
		displayName: 'DealId Name or ID',
		name: 'dealId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getDeals' },
		displayOptions: {
			show: { resource: ['offer'], operation: ['createFromDeal'] },
		},
	},
	// ── restore ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['restore'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── send ──
	{
		displayName: 'Offer Name or ID',
		name: 'offerId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getOffers' },
		displayOptions: { show: { resource: ['offer'], operation: ['send'] } },
		description:
			'The ID of the offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'RecipientEmail',
		name: 'recipientEmail',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['offer'], operation: ['send'] } },
	},
	{
		displayName: 'Mail Connection Name or ID',
		name: 'connectionId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getMailConnections' },
		displayOptions: { show: { resource: ['offer'], operation: ['send'] } },
		description:
			'The mail connection to send from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['offer'], operation: ['send'] } },
	},
	{
		displayName: 'CustomMessage',
		name: 'customMessage',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['offer'], operation: ['send'] } },
	},
	// ── delete ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['offer'], operation: ['delete'] } },
		description: 'ID value',
	},
	// ── accept ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['offer'], operation: ['accept'] } },
		description: 'ID value',
	},
	// ── archiveMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['offer'], operation: ['archiveMany'] },
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
			show: { resource: ['offer'], operation: ['deleteMany'] },
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
	// ── getDashboard ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['offer'], operation: ['getDashboard'] },
		},
		description: 'ID value',
	},
	// ── getPreview ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['offer'], operation: ['getPreview'] },
		},
		description: 'ID value',
	},
	// ── previewFromDto ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['offer'], operation: ['previewFromDto'] },
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
			show: { resource: ['offer'], operation: ['previewFromDto'] },
		},
		options: [
			{
				displayName: 'Customer',
				name: 'customer',
				type: 'json',
				default: '',
				description: 'Customer value',
			},
			{
				displayName: 'InvoiceLines',
				name: 'invoiceLines',
				type: 'json',
				default: '',
				description: 'InvoiceLines value',
			},
			{
				displayName: 'LinkingOptions',
				name: 'linkingOptions',
				type: 'json',
				default: '',
				description: 'LinkingOptions value',
			},
			{
				displayName: 'Offer',
				name: 'offer',
				type: 'json',
				default: '',
				description: 'Offer value',
			},
			{
				displayName: 'PaymentOptions',
				name: 'paymentOptions',
				type: 'json',
				default: '',
				description: 'PaymentOptions value',
			},
			{
				displayName: 'PaymentTerms',
				name: 'paymentTerms',
				type: 'json',
				default: '',
				description: 'PaymentTerms value',
			},
			{
				displayName: 'PdfOptions',
				name: 'pdfOptions',
				type: 'json',
				default: '',
				description: 'PdfOptions value',
			},
			{
				displayName: 'TotalDiscounts',
				name: 'totalDiscounts',
				type: 'json',
				default: '',
				description: 'TotalDiscounts value',
			},
		],
	},
	// ── reject ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['offer'], operation: ['reject'] } },
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
			show: { resource: ['offer'], operation: ['restoreMany'] },
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
