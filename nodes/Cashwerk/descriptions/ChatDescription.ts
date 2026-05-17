import { INodeProperties } from 'n8n-workflow';

export const chatOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['chat'] } },
        options: [
            { name: 'Get All', value: 'getAll', action: 'Get All a Chat', description: 'List chat conversations' },
            { name: 'Create', value: 'create', action: 'Create a Chat', description: 'Create a direct (1:1) conversation' },
            { name: 'Update', value: 'update', action: 'Update a Chat', description: 'Update conversation (rename group)' },
            { name: 'Delete', value: 'delete', action: 'Delete a Chat', description: 'Delete a conversation' },
            { name: 'Archive', value: 'archive', action: 'Archive a Chat', description: 'Archive a conversation' },
            { name: 'Participants', value: 'participants', action: 'Participants a Chat', description: 'Add a participant to a group conversation' },
            { name: 'Read', value: 'read', action: 'Read a Chat', description: 'Mark messages in a conversation as read' },
        ],
        default: 'getAll',
    },
];

export const chatFields: INodeProperties[] = [
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['chat'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['chat'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: { show: { resource: ['chat'], operation: ['getAll'] } },
        options: [
            { displayName: 'Type', name: 'type', type: 'options', default: '', description: 'Type filter', options: [
                { name: 'Direct', value: 'DIRECT' },
                { name: 'Group', value: 'GROUP' },
                { name: 'Project', value: 'PROJECT' },
            ] },
            { displayName: 'Archived', name: 'archived', type: 'string', default: "", description: 'Archived filter' },
            { displayName: 'Cursor', name: 'cursor', type: 'string', default: "", description: 'Cursor filter' },
            { displayName: 'Limit', name: 'limit', type: 'number', default: 0, description: 'Limit filter' },
        ],
    },
    // ── create ──
    {
        displayName: 'TargetUserId',
        name: 'targetUserId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['chat'], operation: ['create'] } },
        description: 'TargetUserId value',
    },
    // ── update ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['chat'], operation: ['update'] } },
        description: 'Id value',
    },
    // ── delete ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['chat'], operation: ['delete'] } },
        description: 'Id value',
    },
    // ── archive ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['chat'], operation: ['archive'] } },
        description: 'Id value',
    },
    // ── participants ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['chat'], operation: ['participants'] } },
        description: 'Id value',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['chat'], operation: ['participants'] } },
        options: [
            { displayName: 'UserId', name: 'userId', type: 'number', default: 0, description: 'UserId value' },
        ],
    },
    // ── read ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['chat'], operation: ['read'] } },
        description: 'Id value',
    },
];
