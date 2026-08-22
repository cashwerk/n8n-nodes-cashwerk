import { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['invoice'] } },
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive an invoice',
				description: 'Archive an invoice by ID',
			},
			{
				name: 'Archive Many',
				value: 'archiveMany',
				action: 'Archive many a invoice',
				description: 'Archive multiple invoices',
			},
			{
				name: 'Book',
				value: 'book',
				action: 'Book an invoice',
				description: 'Book an invoice by ID',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel an invoice',
				description: 'Cancel an invoice by ID',
			},
			{
				name: 'Cancellation',
				value: 'cancellation',
				action: 'Create invoice cancellation',
				description: 'Create a cancellation invoice',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an invoice',
				description: 'Create a new invoice',
			},
			{
				name: 'Create X Invoice',
				value: 'createXInvoice',
				action: 'Create x invoice xml',
				description: 'Create XRechnung document for an invoice',
			},
			{
				name: 'Create Zugferd',
				value: 'createZugferd',
				action: 'Create zug fe rd invoice',
				description: 'Create ZUGFeRD document for an invoice',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a invoice',
				description: 'Delete an invoice by ID',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				action: 'Delete many a invoice',
				description: 'Delete multiple invoices',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an invoice',
				description: 'Get a single invoice by ID',
			},
			{
				name: 'Get Dashboard',
				value: 'getDashboard',
				action: 'Get invoice dashboard',
				description: 'Get invoice dashboard data by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many invoices',
				description: 'Query invoices with pagination and filters',
			},
			{
				name: 'Mark As Paid',
				value: 'markAsPaid',
				action: 'Mark invoice as paid',
				description: 'Mark an invoice as paid',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore an invoice',
				description: 'Restore an archived invoice by ID',
			},
			{
				name: 'Restore Many',
				value: 'restoreMany',
				action: 'Restore many a invoice',
				description: 'Restore multiple archived invoices',
			},
			{
				name: 'Revert Committed',
				value: 'revertCommitted',
				action: 'Revert committed invoice',
				description: 'Revert an invoice to committed state',
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send an invoice',
				description: 'Send an invoice by email',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an invoice',
				description: 'Update an invoice by ID',
			},
			{
				name: 'Validate X Invoice',
				value: 'validateXInvoice',
				action: 'Validate x invoice',
				description: 'Validate XInvoice document for an invoice',
			},
		],
		default: 'get',
	},
];

export const invoiceFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['get'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['invoice'], operation: ['getAll'] } },
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
				resource: ['invoice'],
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
		displayOptions: { show: { resource: ['invoice'], operation: ['getAll'] } },
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
		displayName: 'Invoice',
		name: 'invoice',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
		description: 'Invoice (JSON object)',
	},
	{
		displayName: 'Customer',
		name: 'customer',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
		description: 'Customer (JSON object)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
		options: [
			{
				displayName: 'InvoiceLines',
				name: 'invoiceLines',
				type: 'json',
				default: '',
				description: 'JSON array of invoice line items. Leave empty to skip.',
			},
			{
				displayName: 'LinkingOptions',
				name: 'linkingOptions',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'PaymentOptions',
				name: 'paymentOptions',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'PaymentTerms',
				name: 'paymentTerms',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'PdfOptions',
				name: 'pdfOptions',
				type: 'json',
				default: '{}',
			},
			{
				displayName: 'TotalDiscounts',
				name: 'totalDiscounts',
				type: 'json',
				default: '',
				description: 'JSON array of discount values. Leave empty to skip.',
			},
		],
	},
	// ── update ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
		options: [
			{
				displayName: 'Customer',
				name: 'customer',
				type: 'json',
				default: '{}',
				description: 'Customer details (clientType, clientId, billingAddress, etc.)',
			},
			{
				displayName: 'Invoice',
				name: 'invoice',
				type: 'json',
				default: '{}',
				description: 'Invoice details (title, invoiceDate, netGross, etc.)',
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
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['archive'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── book ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['book'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── cancel ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['cancel'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── cancellation ──
	{
		displayName: 'OriginalInvoiceId',
		name: 'originalInvoiceId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['invoice'], operation: ['cancellation'] },
		},
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['invoice'], operation: ['cancellation'] },
		},
	},
	{
		displayName: 'ReasonDescription',
		name: 'reasonDescription',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['invoice'], operation: ['cancellation'] },
		},
	},
	// ── createXInvoice ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: {
			show: { resource: ['invoice'], operation: ['createXInvoice'] },
		},
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── createZugferd ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: {
			show: { resource: ['invoice'], operation: ['createZugferd'] },
		},
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── getDashboard ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: {
			show: { resource: ['invoice'], operation: ['getDashboard'] },
		},
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── markAsPaid ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: {
			show: { resource: ['invoice'], operation: ['markAsPaid'] },
		},
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Payment Date',
		name: 'paymentDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['invoice'], operation: ['markAsPaid'] },
		},
		description: 'Date the invoice was paid',
	},
	// ── restore ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['restore'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── revertCommitted ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: {
			show: { resource: ['invoice'], operation: ['revertCommitted'] },
		},
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── send ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Recipient Email',
		name: 'recipientEmail',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		description: 'Email address of the recipient',
	},
	{
		displayName: 'Mail Connection Name or ID',
		name: 'connectionId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getMailConnections' },
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		description:
			'The mail connection to send from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Send Options',
		name: 'sendOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['invoice'], operation: ['send'] } },
		options: [
			{
				displayName: 'Bcc',
				name: 'bcc',
				type: 'json',
				default: '[]',
				description: 'BCC email addresses as JSON array',
			},
			{
				displayName: 'Cc',
				name: 'cc',
				type: 'json',
				default: '[]',
				description: 'CC email addresses as JSON array',
			},
			{
				displayName: 'Custom Message',
				name: 'customMessage',
				type: 'string',
				default: '',
				description: 'Custom message body',
			},
			{
				displayName: 'Recipient Name',
				name: 'recipientName',
				type: 'string',
				default: '',
				description: 'Name of the recipient',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Email subject line',
			},
		],
	},
	// ── validateXInvoice ──
	{
		displayName: 'Invoice Name or ID',
		name: 'invoiceId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getInvoices' },
		displayOptions: {
			show: { resource: ['invoice'], operation: ['validateXInvoice'] },
		},
		description:
			'The ID of the invoice. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── delete ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['invoice'], operation: ['delete'] } },
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
			show: { resource: ['invoice'], operation: ['archiveMany'] },
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
			show: { resource: ['invoice'], operation: ['deleteMany'] },
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
	// ── restoreMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['invoice'], operation: ['restoreMany'] },
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
