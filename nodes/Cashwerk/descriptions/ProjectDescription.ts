import { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['project'] } },
		options: [
			{
				name: 'Add Assignees',
				value: 'addAssignees',
				action: 'Add project assignees',
				description: 'Add assignees to a project',
			},
			{
				name: 'Add Contact',
				value: 'addContact',
				action: 'Add contact to project',
				description: 'Add contact to project',
			},
			{
				name: 'Add Contact Persons',
				value: 'addContactPersons',
				action: 'Add contact persons to project',
				description: 'Add contact persons (Ansprechpartner) to a project',
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a project',
				description: 'Archive a project',
			},
			{
				name: 'Archive Many',
				value: 'archiveMany',
				action: 'Archive many a project',
				description: 'Archive multiple projects',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project',
				description: 'Create a new project',
			},
			{
				name: 'Customer',
				value: 'customer',
				action: 'Set project customer',
				description: 'Update project customer',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a project',
				description: 'Delete a project by ID',
			},
			{
				name: 'Delete Many',
				value: 'deleteMany',
				action: 'Delete many a project',
				description: 'Delete multiple projects',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				action: 'Duplicate a project',
				description: 'Duplicate a project',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Get a single project by ID',
			},
			{
				name: 'Get Assignees',
				value: 'getAssignees',
				action: 'Get project assignees',
				description: 'Get project assignees',
			},
			{
				name: 'Get Dashboard',
				value: 'getDashboard',
				action: 'Get project dashboard',
				description: 'Get project dashboardtacts',
			},
			{
				name: 'Get Statuses',
				value: 'getStatuses',
				action: 'Get project statuses',
				description: 'Get project status options',
			},
			{
				name: 'Query',
				value: 'query',
				action: 'Query projects',
				description: 'List projects with pagination and filters',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore a project',
				description: 'Restore an archived project',
			},
			{
				name: 'Restore Many',
				value: 'restoreMany',
				action: 'Restore many a project',
				description: 'Restore multiple archived projects',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project',
				description: 'Update a project by ID',
			},
			{
				name: 'Update Address With Portfolio',
				value: 'updateAddressWithPortfolio',
				action: 'Update project address with portfolio',
				description: 'Update project address with portfolio sync',
			},
			{
				name: 'Update Assignees',
				value: 'updateAssignees',
				action: 'Update project assignees',
				description: 'Update project assignees',
			},
			{
				name: 'Update Default Task Board',
				value: 'updateDefaultTaskBoard',
				action: 'Update project default task board',
				description: 'Update default task board for a project',
			},
			{
				name: 'Upload Image',
				value: 'uploadImage',
				action: 'Upload project image',
				description: 'Upload project image',
			},
		],
		default: 'get',
	},
];

export const projectFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: { show: { resource: ['project'], operation: ['get'] } },
		description:
			'The ID of the project. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── create ──
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['create'] } },
		description: 'Project name',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['create'] } },
		options: [
			{
				displayName: 'Assigned Employee IDs',
				name: 'assignedEmployeeIds',
				type: 'json',
				default: '[]',
				description: 'JSON array of employee IDs',
			},
			{
				displayName: 'Client Company ID',
				name: 'clientCompanyId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Client Contact ID',
				name: 'clientContactId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Client Type',
				name: 'clientType',
				type: 'options',
				default: 'NONE',
				options: [
					{ name: 'Company', value: 'COMPANY' },
					{ name: 'None', value: 'NONE' },
					{ name: 'Person', value: 'PERSON' },
				],
			},
			{
				displayName: 'Contact Person IDs',
				name: 'contactPersonIds',
				type: 'json',
				default: '[]',
				description: 'JSON array of contact person IDs',
			},
			{
				displayName: 'Custom Address',
				name: 'customAddress',
				type: 'json',
				default: '{}',
				description: 'Custom address as JSON',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Project description',
			},
			{
				displayName: 'Employee Notes',
				name: 'employeeNotes',
				type: 'string',
				default: '',
				description: 'Internal notes',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date (ISO 8601)',
			},
			{
				displayName: 'Portfolio ID',
				name: 'portfolioId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Project Number',
				name: 'projectNumber',
				type: 'string',
				default: '',
				description: 'Custom project number',
			},
			{
				displayName: 'Project Start',
				name: 'projectStart',
				type: 'dateTime',
				default: '',
				description: 'Project start date (ISO 8601)',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date (ISO 8601)',
			},
			{
				displayName: 'Status ID',
				name: 'statusId',
				type: 'number',
				default: 0,
				description: 'Dynamic status ID',
			},
		],
	},
	// ── addAssignees ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['addAssignees'] },
		},
		description:
			'The project to add assignees to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'User IDs (JSON Array)',
		name: 'userIds',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: { resource: ['project'], operation: ['addAssignees'] },
		},
		description: 'JSON array of user IDs to assign',
	},
	{
		displayName: 'Remove',
		name: 'remove',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['project'], operation: ['addAssignees'] },
		},
		description: 'Whether to remove the specified assignees instead of adding them',
	},
	// ── addContactPersons ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['addContactPersons'] },
		},
		description:
			'The project to add contact persons to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Contact IDs',
		name: 'contactIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['project'], operation: ['addContactPersons'] },
		},
		description: 'Comma-separated list of contact IDs to add as contact persons (Ansprechpartner)',
	},
	// ── archive ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: { show: { resource: ['project'], operation: ['archive'] } },
		description:
			'The project to archive. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── customer ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['customer'] },
		},
		description:
			'The project to set the customer for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		required: true,
		default: 'NONE',
		displayOptions: {
			show: { resource: ['project'], operation: ['customer'] },
		},
		description: 'Client type',
		options: [
			{ name: 'Company', value: 'COMPANY' },
			{ name: 'None', value: 'NONE' },
			{ name: 'Person', value: 'PERSON' },
		],
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['project'], operation: ['customer'] },
		},
		description: 'Company ID (when type is COMPANY)',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['project'], operation: ['customer'] },
		},
		description: 'Contact ID (when type is PERSON)',
	},
	// ── getAssignees ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['getAssignees'] },
		},
		description:
			'The project to get assignees for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── getDashboard ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['getDashboard'] },
		},
		description:
			'The project to get the dashboard for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── getStatuses ──
	// (no fields needed)
	// ── query ──
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		description: 'Number of records to skip',
	},
	{
		displayName: 'Take',
		name: 'take',
		type: 'number',
		default: 50,
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		description: 'Number of records to return',
	},
	{
		displayName: 'Sort By',
		name: 'sortBy',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		description: 'Field to sort by',
	},
	{
		displayName: 'Sort Direction',
		name: 'sortType',
		type: 'options',
		default: 'ASC',
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		options: [
			{ name: 'Ascending', value: 'ASC' },
			{ name: 'Descending', value: 'DESC' },
		],
	},
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		description: 'Free-text search',
	},
	{
		displayName: 'Include Archived',
		name: 'includeArchived',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		description: 'Whether to include archived projects',
	},
	{
		displayName: 'Status Filter',
		name: 'statusFilter',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['project'], operation: ['query'] } },
		description: 'Filter by status',
	},
	// ── restore ──
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['project'], operation: ['restore'] } },
		description: 'The ID of the archived project to restore',
	},
	// ── updateAddressWithPortfolio ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['updateAddressWithPortfolio'],
			},
		},
		description:
			'The project to update. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Fields',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['updateAddressWithPortfolio'],
			},
		},
		options: [
			{
				displayName: 'Client Company ID',
				name: 'clientCompanyId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Client Contact ID',
				name: 'clientContactId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Client Type',
				name: 'clientType',
				type: 'options',
				default: 'NONE',
				options: [
					{ name: 'Company', value: 'COMPANY' },
					{ name: 'None', value: 'NONE' },
					{ name: 'Person', value: 'PERSON' },
				],
			},
			{
				displayName: 'Contact Person IDs',
				name: 'contactPersonIds',
				type: 'json',
				default: '[]',
				description: 'JSON array of contact person IDs',
			},
			{
				displayName: 'Custom Address',
				name: 'customAddress',
				type: 'json',
				default: '{}',
				description: 'Custom address as JSON',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Employee Notes',
				name: 'employeeNotes',
				type: 'string',
				default: '',
				description: 'Internal notes',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date (ISO 8601)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Project name',
			},
			{
				displayName: 'Portfolio ID',
				name: 'portfolioId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date (ISO 8601)',
			},
			{
				displayName: 'Status ID',
				name: 'statusId',
				type: 'number',
				default: 0,
			},
		],
	},
	// ── updateAssignees ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['updateAssignees'] },
		},
		description:
			'The project to update assignees for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'User IDs (JSON Array)',
		name: 'userIds',
		type: 'json',
		default: '[]',
		displayOptions: {
			show: { resource: ['project'], operation: ['updateAssignees'] },
		},
		description: 'JSON array of user IDs to assign',
	},
	{
		displayName: 'Remove',
		name: 'remove',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['project'], operation: ['updateAssignees'] },
		},
		description: 'Whether to remove the specified assignees instead of adding them',
	},
	// ── updateDefaultTaskBoard ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['updateDefaultTaskBoard'] },
		},
		description:
			'The project to update the default task board for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Task Board Name or ID',
		name: 'boardId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['project'], operation: ['updateDefaultTaskBoard'] },
		},
		description:
			'The task board to set as default. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── uploadImage ──
	{
		displayName: 'Project Name or ID',
		name: 'projectId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getProjects' },
		displayOptions: {
			show: { resource: ['project'], operation: ['uploadImage'] },
		},
		description:
			'The project to upload an image for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: { resource: ['project'], operation: ['uploadImage'] },
		},
		description: 'Name of the binary property containing the project image to upload',
	},
	// ── getAll ──
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['project'], operation: ['getAll'] } },
		description: 'ProjectId value',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['project'], operation: ['getAll'] } },
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
				resource: ['project'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// ── update ──
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['project'], operation: ['update'] } },
		description: 'ProjectId value',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['update'] } },
		options: [
			{
				displayName: 'AssignedEmployeeIds',
				name: 'assignedEmployeeIds',
				type: 'json',
				default: '',
				description: 'AssignedEmployeeIds value',
			},
			{
				displayName: 'ClientCompanyId',
				name: 'clientCompanyId',
				type: 'number',
				default: 0,
				description: 'ClientCompanyId value',
			},
			{
				displayName: 'ClientContactId',
				name: 'clientContactId',
				type: 'number',
				default: 0,
				description: 'ClientContactId value',
			},
			{
				displayName: 'ClientType',
				name: 'clientType',
				type: 'options',
				default: 'NONE',
				description: 'ClientType value',
				options: [
					{ name: 'Company', value: 'COMPANY' },
					{ name: 'None', value: 'NONE' },
					{ name: 'Person', value: 'PERSON' },
				],
			},
			{
				displayName: 'ContactPersonIds',
				name: 'contactPersonIds',
				type: 'json',
				default: '',
				description: 'ContactPersonIds value',
			},
			{
				displayName: 'CustomAddress',
				name: 'customAddress',
				type: 'json',
				default: '',
				description: 'CustomAddress value',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description value',
			},
			{
				displayName: 'EmployeeNotes',
				name: 'employeeNotes',
				type: 'string',
				default: '',
				description: 'EmployeeNotes value',
			},
			{
				displayName: 'EndDate',
				name: 'endDate',
				type: 'string',
				default: '',
				description: 'EndDate value',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'number',
				default: 0,
				description: 'ID value',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name value',
			},
			{
				displayName: 'PortfolioId',
				name: 'portfolioId',
				type: 'number',
				default: 0,
				description: 'PortfolioId value',
			},
			{
				displayName: 'ProjectNumber',
				name: 'projectNumber',
				type: 'string',
				default: '',
				description: 'ProjectNumber value',
			},
			{
				displayName: 'ProjectStart',
				name: 'projectStart',
				type: 'string',
				default: '',
				description: 'ProjectStart value',
			},
			{
				displayName: 'StartDate',
				name: 'startDate',
				type: 'string',
				default: '',
				description: 'StartDate value',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'OPEN',
				description: 'Status value',
				options: [
					{ name: 'Archived', value: 'ARCHIVED' },
					{ name: 'Cancelled', value: 'CANCELLED' },
					{ name: 'Completed', value: 'COMPLETED' },
					{ name: 'Deleted', value: 'DELETED' },
					{ name: 'In Progress', value: 'IN_PROGRESS' },
					{ name: 'On Hold', value: 'ON_HOLD' },
					{ name: 'Open', value: 'OPEN' },
					{ name: 'Planning', value: 'PLANNING' },
					{ name: 'Work Completed', value: 'WORK_COMPLETED' },
					{ name: 'Work In Progress', value: 'WORK_IN_PROGRESS' },
				],
			},
			{
				displayName: 'StatusId',
				name: 'statusId',
				type: 'number',
				default: 0,
				description: 'StatusId value',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['project'], operation: ['delete'] } },
		description: 'ProjectId value',
	},
	// ── addContacts ──
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['project'], operation: ['addContacts'] },
		},
		description: 'ProjectId value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['project'], operation: ['addContacts'] },
		},
		options: [
			{
				displayName: 'ContactIds',
				name: 'contactIds',
				type: 'json',
				default: '',
				description: 'ContactIds value',
			},
		],
	},
	// ── archiveMany ──
	// ── contact ──
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['project'], operation: ['contact'] } },
		description: 'ProjectId value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['project'], operation: ['contact'] } },
		options: [
			{
				displayName: 'ContactId',
				name: 'contactId',
				type: 'number',
				default: 0,
				description: 'ContactId value',
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
			show: { resource: ['project'], operation: ['deleteMany'] },
		},
		options: [
			{
				displayName: 'ProjectIds',
				name: 'projectIds',
				type: 'json',
				default: '',
				description: 'ProjectIds value',
			},
		],
	},
	// ── duplicate ──
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['project'], operation: ['duplicate'] },
		},
		description: 'ProjectId value',
	},
	// ── restoreMany ──
];
