import { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['pipeline'] } },
		options: [
			{
				name: 'Add Stage',
				value: 'addStage',
				action: 'Add a stage to a pipeline',
				description: 'Add a stage to a pipeline',
			},
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a pipeline',
				description: 'Archive (soft-delete) a sales pipeline',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a pipeline',
				description: 'Create a new sales pipeline',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a pipeline',
				description: 'Delete a sales pipeline',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a pipeline',
				description: 'Get a single pipeline by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many pipelines',
				description: 'List many pipelines',
			},
			{
				name: 'Reorder Stages',
				value: 'reorderStages',
				action: 'Reorder pipeline stages',
				description: 'Reorder pipeline stages',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore a pipeline',
				description: 'Restore an archived pipeline',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a pipeline',
				description: 'Update a sales pipeline',
			},
			{
				name: 'Update Assigned Users',
				value: 'updateAssignedUsers',
				action: 'Update pipeline assigned users',
				description: 'Update pipeline assigned users',
			},
		],
		default: 'getAll',
	},
];

export const pipelineFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Pipeline Name or ID',
		name: 'pipelineId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getPipelines' },
		displayOptions: { show: { resource: ['pipeline'], operation: ['get'] } },
		description:
			'The ID of the pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── update ──
	{
		displayName: 'Pipeline Name or ID',
		name: 'pipelineId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getPipelines' },
		displayOptions: { show: { resource: ['pipeline'], operation: ['update'] } },
		description:
			'The ID of the pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['pipeline'], operation: ['update'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Icon',
				name: 'icon',
				type: 'string',
				default: '',
			},
			{
				displayName: 'IsDefaultSalesPipeline',
				name: 'isDefaultSalesPipeline',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'PipelineType',
				name: 'pipelineType',
				type: 'options',
				default: 'SALES',
				options: [
					{ name: 'Custom', value: 'CUSTOM' },
					{ name: 'Customer Success', value: 'CUSTOMER_SUCCESS' },
					{ name: 'Partnership', value: 'PARTNERSHIP' },
					{ name: 'Sales', value: 'SALES' },
					{ name: 'Support', value: 'SUPPORT' },
				],
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
			},
		],
	},
	// ── archive ──
	{
		displayName: 'Pipeline Name or ID',
		name: 'pipelineId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getPipelines' },
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['archive'] },
		},
		description:
			'The pipeline to archive. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	// ── restore ──
	{
		displayName: 'Pipeline ID',
		name: 'pipelineId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['restore'] },
		},
		description: 'The ID of the archived pipeline to restore',
	},
	// ── create (required fields) ──
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['pipeline'], operation: ['create'] } },
		description: 'The title of the pipeline',
	},
	{
		displayName: 'Pipeline Type',
		name: 'pipelineType',
		type: 'options',
		required: true,
		default: 'SALES',
		displayOptions: { show: { resource: ['pipeline'], operation: ['create'] } },
		description: 'The type of pipeline',
		options: [
			{ name: 'Custom', value: 'CUSTOM' },
			{ name: 'Customer Success', value: 'CUSTOMER_SUCCESS' },
			{ name: 'Partnership', value: 'PARTNERSHIP' },
			{ name: 'Sales', value: 'SALES' },
			{ name: 'Support', value: 'SUPPORT' },
		],
	},
	// ── create (optional fields) ──
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['pipeline'], operation: ['create'] } },
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Pipeline description',
			},
			{
				displayName: 'Icon',
				name: 'icon',
				type: 'string',
				default: '',
				description: 'Pipeline icon identifier',
			},
			{
				displayName: 'Is Default Sales Pipeline',
				name: 'isDefaultSalesPipeline',
				type: 'boolean',
				default: false,
				description: 'Whether set as the default sales pipeline',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'PipelineId',
		name: 'pipelineId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['pipeline'], operation: ['delete'] } },
		description: 'PipelineId value',
	},
	// ── addStage ──
	{
		displayName: 'PipelineId',
		name: 'pipelineId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['addStage'] },
		},
		description: 'PipelineId value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['addStage'] },
		},
		options: [
			{
				displayName: 'CustomColor',
				name: 'customColor',
				type: 'color',
				default: '',
				description: 'CustomColor value',
			},
			{
				displayName: 'CustomName',
				name: 'customName',
				type: 'string',
				default: '',
				description: 'CustomName value',
			},
			{
				displayName: 'IsClosed',
				name: 'isClosed',
				type: 'boolean',
				default: false,
				description: 'Whether isClosed value',
			},
			{
				displayName: 'IsWon',
				name: 'isWon',
				type: 'boolean',
				default: false,
				description: 'Whether isWon value',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'number',
				default: 0,
				description: 'Position value',
			},
			{
				displayName: 'Progress',
				name: 'progress',
				type: 'number',
				default: 0,
				description: 'Progress value',
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
	// ── assignedUsers ──
	{
		displayName: 'PipelineId',
		name: 'pipelineId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['assignedUsers'] },
		},
		description: 'PipelineId value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['assignedUsers'] },
		},
		options: [
			{
				displayName: 'AssignedUserIds',
				name: 'assignedUserIds',
				type: 'json',
				default: '',
				description: 'Array of user IDs to assign to the pipeline',
			},
		],
	},
	// ── reorder ──
	{
		displayName: 'PipelineId',
		name: 'pipelineId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['reorder'] },
		},
		description: 'PipelineId value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['pipeline'], operation: ['reorder'] },
		},
		options: [
			{
				displayName: 'StageOrders',
				name: 'stageOrders',
				type: 'json',
				default: '',
				description: 'StageOrders value',
			},
		],
	},
];
