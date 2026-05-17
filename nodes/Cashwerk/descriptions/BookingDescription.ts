import { INodeProperties } from 'n8n-workflow';

export const bookingOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['booking'] } },
        options: [
            { name: 'Get', value: 'get', action: 'Get a Booking', description: 'Get booking by ID' },
            { name: 'Get All', value: 'getAll', action: 'Get All a Booking', description: 'List bookings with optional filters' },
            { name: 'Create', value: 'create', action: 'Create a Booking', description: 'Create a staff booking (internal booking on behalf of invitee)' },
            { name: 'Cancel', value: 'cancel', action: 'Cancel a Booking', description: 'Cancel a booking by host' },
        ],
        default: 'get',
    },
];

export const bookingFields: INodeProperties[] = [
    // ── get ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['booking'], operation: ['get'] } },
        description: 'Id value',
    },
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['booking'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['booking'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: { show: { resource: ['booking'], operation: ['getAll'] } },
        options: [
            { displayName: 'PageId', name: 'pageId', type: 'string', default: "", description: 'PageId filter' },
            { displayName: 'Status', name: 'status', type: 'string', default: "", description: 'Status filter' },
            { displayName: 'Limit', name: 'limit', type: 'string', default: "", description: 'Limit filter' },
            { displayName: 'Offset', name: 'offset', type: 'string', default: "", description: 'Offset filter' },
        ],
    },
    // ── create ──
    {
        displayName: 'EventTypeId',
        name: 'eventTypeId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['booking'], operation: ['create'] } },
        description: 'EventTypeId value',
    },
    {
        displayName: 'InviteeEmail',
        name: 'inviteeEmail',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['booking'], operation: ['create'] } },
        description: 'InviteeEmail value',
    },
    {
        displayName: 'InviteeName',
        name: 'inviteeName',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['booking'], operation: ['create'] } },
        description: 'InviteeName value',
    },
    {
        displayName: 'StartAt',
        name: 'startAt',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['booking'], operation: ['create'] } },
        description: 'StartAt value',
    },
    {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['booking'], operation: ['create'] } },
        description: 'Timezone value',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['booking'], operation: ['create'] } },
        options: [
            { displayName: 'AssignedHostId', name: 'assignedHostId', type: 'number', default: 0, description: 'AssignedHostId value' },
            { displayName: 'FormResponses', name: 'formResponses', type: 'json', default: "", description: 'FormResponses value' },
            { displayName: 'InviteeLocale', name: 'inviteeLocale', type: 'string', default: "", description: 'InviteeLocale value' },
            { displayName: 'InviteePhone', name: 'inviteePhone', type: 'string', default: "", description: 'InviteePhone value' },
        ],
    },
    // ── cancel ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['booking'], operation: ['cancel'] } },
        description: 'Id value',
    },
];
