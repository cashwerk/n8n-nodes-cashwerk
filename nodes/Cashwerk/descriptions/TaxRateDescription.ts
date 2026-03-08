import { INodeProperties } from 'n8n-workflow';

export const taxRateOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['taxRate'] } },
        options: [
            { name: 'Get', value: 'get', action: 'Get a Tax Rate', description: 'Get a tax rate by ID' },
            { name: 'Get Many', value: 'getAll', action: 'Get Many Tax Rates', description: 'Get all tax rates for the organization' },
            { name: 'Create', value: 'create', action: 'Create a Tax Rate', description: 'Create a new tax rate' },
            { name: 'Update', value: 'update', action: 'Update a Tax Rate', description: 'Update a tax rate' },
            { name: 'Delete', value: 'delete', action: 'Delete a Tax Rate', description: 'Delete a tax rate by ID' },
            { name: 'Delete Many', value: 'deleteMany', action: 'Delete Many Tax Rates', description: 'Delete multiple tax rates' },
        ],
        default: 'get',
    },
];

export const taxRateFields: INodeProperties[] = [
    // ── get ──
    {
        displayName: 'Tax Rate ID',
        name: 'taxRateId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taxRate'], operation: ['get'] } },
        description: 'The ID of the tax rate',
    },
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['taxRate'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['taxRate'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    // ── create ──
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
        description: 'Name',
    },
    {
        displayName: 'Rate',
        name: 'rate',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
        description: 'Rate',
    },
    {
        displayName: 'CountryCode',
        name: 'countryCode',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
        description: 'CountryCode',
    },
    {
        displayName: 'IsDefault',
        name: 'isDefault',
        type: 'boolean',
        required: true,
        default: false,
        displayOptions: { show: { resource: ['taxRate'], operation: ['create'] } },
        description: 'IsDefault',
    },
    // ── update ──
    {
        displayName: 'Tax Rate ID',
        name: 'taxRateId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taxRate'], operation: ['update'] } },
        description: 'The ID of the tax rate',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['taxRate'], operation: ['update'] } },
        options: [
            { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'Name' },
            { displayName: 'Rate', name: 'rate', type: 'number', default: 0, description: 'Rate' },
            { displayName: 'CountryCode', name: 'countryCode', type: 'string', default: '', description: 'CountryCode' },
            { displayName: 'IsDefault', name: 'isDefault', type: 'boolean', default: false, description: 'IsDefault' },
        ],
    },
    // ── delete ──
    {
        displayName: 'Tax Rate ID',
        name: 'taxRateId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taxRate'], operation: ['delete'] } },
        description: 'The ID of the tax rate',
    },
    // ── deleteMany ──
    {
        displayName: 'Ids',
        name: 'Ids',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['taxRate'], operation: ['deleteMany'] } },
        description: 'Ids',
    },
];
