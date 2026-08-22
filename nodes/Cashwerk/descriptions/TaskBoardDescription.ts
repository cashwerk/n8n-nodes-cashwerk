import { INodeProperties } from 'n8n-workflow';

export const taskBoardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['taskBoard'] } },
		options: [
			{
				name: 'Activate',
				value: 'activate',
				action: 'Activate a task board',
				description: 'Activate task board',
			},
			{
				name: 'Activate Many',
				value: 'activateMany',
				action: 'Activate many a task board',
				description: 'Activate multiple task boards',
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a task board',
				description: 'Archive task board',
			},
			{
				name: 'Archive Many',
				value: 'archiveMany',
				action: 'Archive many a task board',
				description: 'Archive multiple task boards',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a task board',
				description: 'Create a new task board',
			},
			{
				name: 'Create Column',
				value: 'createColumn',
				action: 'Create task board column',
				description: 'Create column in task board',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a task board',
				description: 'Delete task board',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a task board',
				description: 'Get task board by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many task boards',
				description: 'Search task boards with filters',
			},
			{
				name: 'Get Presets',
				value: 'getPresets',
				action: 'Get presets a task board',
				description: 'Get all task board presets',
			},
			{
				name: 'Invite User',
				value: 'inviteUser',
				action: 'Invite user to task board',
				description: 'Invite user to task board',
			},
			{
				name: 'Remove User',
				value: 'removeUser',
				action: 'Remove user from task board',
				description: 'Remove user from task board',
			},
			{
				name: 'Save As Preset',
				value: 'saveAsPreset',
				action: 'Save as preset a task board',
				description: 'Save task board as preset',
			},
			{
				name: 'Update Due Date',
				value: 'updateDueDate',
				action: 'Update task board due date',
				description: 'Update task board due date',
			},
			{
				name: 'Update Project',
				value: 'updateProject',
				action: 'Update task board project',
				description: 'Update task board default project',
			},
			{
				name: 'Update Title',
				value: 'updateTitle',
				action: 'Update task board title',
				description: 'Update task board title',
			},
		],
		default: 'get',
	},
];

export const taskBoardFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Task Board Name or ID',
		name: 'taskBoardId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
		description:
			'The ID of the task board. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'Completed',
		name: 'completed',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'DueDateStart',
		name: 'dueDateStart',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'DueDateEnd',
		name: 'dueDateEnd',
		type: 'dateTime',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'SortField',
		name: 'sortField',
		type: 'json',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'SortDirection',
		name: 'sortDirection',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'AssigneeIds',
		name: 'assigneeIds',
		type: 'json',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'CreatedByIds',
		name: 'createdByIds',
		type: 'json',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	{
		displayName: 'TagIds',
		name: 'tagIds',
		type: 'json',
		default: '',
		displayOptions: { show: { resource: ['taskBoard'], operation: ['get'] } },
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['getAll'] },
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
				resource: ['taskBoard'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// ── create ──
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['create'] },
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'DueDate',
				name: 'dueDate',
				type: 'dateTime',
				default: '',
			},
			{
				displayName: 'ProjectId',
				name: 'projectId',
				type: 'number',
				default: 0,
			},
		],
	},
	// ── activate ──
	{
		displayName: 'Task Board Name or ID',
		name: 'taskBoardId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['activate'] },
		},
		description:
			'The ID of the task board. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── archive ──
	{
		displayName: 'Task Board Name or ID',
		name: 'taskBoardId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['archive'] },
		},
		description:
			'The ID of the task board. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── createColumn ──
	{
		displayName: 'TaskBoardId Name or ID',
		name: 'taskBoardId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['createColumn'] },
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['createColumn'] },
		},
	},
	// ── inviteUser ──
	{
		displayName: 'TaskBoardId Name or ID',
		name: 'taskBoardId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['inviteUser'] },
		},
	},
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['inviteUser'] },
		},
	},
	// ── removeUser ──
	{
		displayName: 'TaskBoardId Name or ID',
		name: 'taskBoardId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['removeUser'] },
		},
	},
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['removeUser'] },
		},
	},
	// ── updateDueDate ──
	{
		displayName: 'TaskBoardId Name or ID',
		name: 'taskBoardId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['updateDueDate'] },
		},
	},
	{
		displayName: 'DueDate',
		name: 'dueDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['updateDueDate'] },
		},
	},
	// ── updateProject ──
	{
		displayName: 'TaskBoardId Name or ID',
		name: 'taskBoardId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['updateProject'] },
		},
	},
	{
		displayName: 'ProjectId',
		name: 'projectId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['updateProject'] },
		},
	},
	// ── updateTitle ──
	{
		displayName: 'TaskBoardId Name or ID',
		name: 'taskBoardId',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getTaskBoards' },
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['updateTitle'] },
		},
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['updateTitle'] },
		},
		description: 'The new title for the task board',
	},
	// ── delete ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['delete'] },
		},
		description: 'ID value',
	},
	// ── getPresets ──
	// ── saveAsPreset ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['taskBoard'], operation: ['saveAsPreset'] },
		},
		description: 'ID value',
	},
	// ── activateMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['taskBoard'], operation: ['activateMany'] } },
		options: [
			{
				displayName: 'BoardIds',
				name: 'boardIds',
				type: 'json',
				default: '',
				description: 'BoardIds value',
			},
		],
	},
	// ── archiveMany ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['taskBoard'], operation: ['archiveMany'] } },
		options: [
			{
				displayName: 'BoardIds',
				name: 'boardIds',
				type: 'json',
				default: '',
				description: 'BoardIds value',
			},
		],
	},
];
