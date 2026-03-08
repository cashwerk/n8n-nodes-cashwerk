import { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['user'] } },
        options: [
            { name: 'Get', value: 'get', action: 'Get a User', description: 'Get user by ID' },
            { name: 'Get Many', value: 'getAll', action: 'Get Many Users', description: 'Search users with filters' },
            { name: 'Get Active', value: 'getActive', action: 'Get Active Users', description: 'Get active users for organization' },
        ],
        default: 'get',
    },
];

export const userFields: INodeProperties[] = [
    // ── get ──
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'options',
        required: true,
        default: '',
        typeOptions: { loadOptionsMethod: 'getUsers' },
        displayOptions: { show: { resource: ['user'], operation: ['get'] } },
        description: 'The ID of the user',
    },
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['user'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['user'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    // ── getActive ── (no params needed, orgId resolved automatically)
];
