import { INodeProperties } from 'n8n-workflow';

export const pipelineOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['pipeline'] } },
        options: [
            { name: 'Archive', value: 'archive', action: 'Archive a Pipeline', description: 'Archive (soft-delete) a sales pipeline' },
            { name: 'Create', value: 'create', action: 'Create a Pipeline', description: 'Create a new sales pipeline' },
            { name: 'Get', value: 'get', action: 'Get a Pipeline', description: 'Get a single pipeline by ID' },
            { name: 'Get Many', value: 'getAll', action: 'Get All Pipelines', description: 'List all pipelines' },
            { name: 'Restore', value: 'restore', action: 'Restore a Pipeline', description: 'Restore an archived pipeline' },
            { name: 'Update', value: 'update', action: 'Update a Pipeline', description: 'Update a sales pipeline' },
        ],
        default: 'getAll',
    },
];

export const pipelineFields: INodeProperties[] = [
    // ── get ──
    {
        displayName: 'Pipeline ID',
        name: 'pipelineId',
        type: 'options',
        required: true,
        default: '',
        typeOptions: { loadOptionsMethod: 'getPipelines' },
        displayOptions: { show: { resource: ['pipeline'], operation: ['get'] } },
        description: 'The ID of the pipeline',
    },
    // ── update ──
    {
        displayName: 'Pipeline ID',
        name: 'pipelineId',
        type: 'options',
        required: true,
        default: '',
        typeOptions: { loadOptionsMethod: 'getPipelines' },
        displayOptions: { show: { resource: ['pipeline'], operation: ['update'] } },
        description: 'The ID of the pipeline',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['pipeline'], operation: ['update'] } },
        options: [
            { displayName: 'Title', name: 'title', type: 'string', default: '', description: 'Title' },
            { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description' },
            { displayName: 'PipelineType', name: 'pipelineType', type: 'options', default: '', description: 'PipelineType', options: [
                { name: 'Sales', value: 'SALES' },
                { name: 'Customer Success', value: 'CUSTOMER_SUCCESS' },
                { name: 'Partnership', value: 'PARTNERSHIP' },
                { name: 'Support', value: 'SUPPORT' },
                { name: 'Custom', value: 'CUSTOM' },
            ] },
            { displayName: 'IsDefaultSalesPipeline', name: 'isDefaultSalesPipeline', type: 'boolean', default: false, description: 'IsDefaultSalesPipeline' },
            { displayName: 'Icon', name: 'icon', type: 'string', default: '', description: 'Icon' },
        ],
    },
    // ── archive ──
    {
        displayName: 'Pipeline',
        name: 'pipelineId',
        type: 'options',
        required: true,
        default: '',
        typeOptions: { loadOptionsMethod: 'getPipelines' },
        displayOptions: { show: { resource: ['pipeline'], operation: ['archive'] } },
        description: 'The pipeline to archive',
    },
    // ── restore ──
    {
        displayName: 'Pipeline ID',
        name: 'pipelineId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['pipeline'], operation: ['restore'] } },
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
            { name: 'Sales', value: 'SALES' },
            { name: 'Customer Success', value: 'CUSTOMER_SUCCESS' },
            { name: 'Partnership', value: 'PARTNERSHIP' },
            { name: 'Support', value: 'SUPPORT' },
            { name: 'Custom', value: 'CUSTOM' },
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
            { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Pipeline description' },
            { displayName: 'Is Default Sales Pipeline', name: 'isDefaultSalesPipeline', type: 'boolean', default: false, description: 'Set as the default sales pipeline' },
            { displayName: 'Icon', name: 'icon', type: 'string', default: '', description: 'Pipeline icon identifier' },
        ],
    },
];
