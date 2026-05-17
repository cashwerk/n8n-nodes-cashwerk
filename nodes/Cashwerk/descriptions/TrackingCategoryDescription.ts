import { INodeProperties } from 'n8n-workflow';

export const trackingCategoryOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['trackingCategory'] } },
        options: [
            { name: 'Create', value: 'create', action: 'Create a Tracking Category', description: 'Create a new tracking category' },
            { name: 'Get', value: 'get', action: 'Get a Tracking Category', description: 'Get a tracking category by ID' },
            { name: 'Get Many', value: 'getAll', action: 'Get Many Tracking Categories', description: 'Get all tracking categories for organization' },
            { name: 'Update', value: 'update', action: 'Update a Tracking Category', description: 'Update a tracking category' },
            { name: 'Delete', value: 'delete', action: 'Delete a Tracking Category', description: 'Delete a tracking category' },
        ],
        default: 'get',
    },
];

export const trackingCategoryFields: INodeProperties[] = [
    // ── create ──
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['create'] } },
        description: 'The name of the tracking category',
    },
    // ── get ──
    {
        displayName: 'Tracking Category ID',
        name: 'trackingCategoryId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['get'] } },
        description: 'The ID of the tracking category',
    },
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    // ── update ──
    {
        displayName: 'Tracking Category ID',
        name: 'trackingCategoryId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['update'] } },
        description: 'The ID of the tracking category',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['update'] } },
        options: [
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                default: '',
                description: 'New name of the tracking category',
            },
        ],
    },
    // ── delete ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['trackingCategory'], operation: ['delete'] } },
        description: 'Id value',
    },
];
