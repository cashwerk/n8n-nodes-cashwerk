import { INodeProperties } from 'n8n-workflow';

export const salesTaxRegulationOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['salesTaxRegulation'] } },
        options: [
            { name: 'Get', value: 'get', action: 'Get a Sales Tax Regulation', description: 'Get a sales tax regulation by ID' },
            { name: 'Get Many', value: 'getAll', action: 'Get Many Sales Tax Regulations', description: 'Get all sales tax regulations for the organization' },
            { name: 'Create', value: 'create', action: 'Create a Sales Tax Regulation', description: 'Create a new sales tax regulation' },
            { name: 'Update', value: 'update', action: 'Update a Sales Tax Regulation', description: 'Update a sales tax regulation by ID' },
            { name: 'Delete', value: 'delete', action: 'Delete a Sales Tax Regulation', description: 'Delete a sales tax regulation by ID' },
            { name: 'Delete Many', value: 'deleteMany', action: 'Delete Many Sales Tax Regulations', description: 'Delete multiple sales tax regulations' },
        ],
        default: 'get',
    },
];

export const salesTaxRegulationFields: INodeProperties[] = [
    // ── get ──
    {
        displayName: 'Sales Tax Regulation ID',
        name: 'salesTaxRegulationId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['get'] } },
        description: 'The ID of the sales tax regulation',
    },
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    // ── create ──
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['create'] } },
        description: 'Name',
    },
    {
        displayName: 'TransactionType',
        name: 'transactionType',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['create'] } },
        description: 'TransactionType',
    },
    {
        displayName: 'RegulationText',
        name: 'regulationText',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['create'] } },
        description: 'RegulationText',
    },
    {
        displayName: 'Rate',
        name: 'rate',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['create'] } },
        description: 'Rate',
    },
    // ── update ──
    {
        displayName: 'Sales Tax Regulation ID',
        name: 'salesTaxRegulationId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['update'] } },
        description: 'The ID of the sales tax regulation',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['update'] } },
        options: [
            { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'Name' },
            { displayName: 'TransactionType', name: 'transactionType', type: 'string', default: '', description: 'TransactionType' },
            { displayName: 'RegulationText', name: 'regulationText', type: 'string', default: '', description: 'RegulationText' },
            { displayName: 'Rate', name: 'rate', type: 'number', default: 0, description: 'Rate' },
        ],
    },
    // ── delete ──
    {
        displayName: 'Sales Tax Regulation ID',
        name: 'salesTaxRegulationId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['delete'] } },
        description: 'The ID of the sales tax regulation',
    },
    // ── deleteMany ──
    {
        displayName: 'Ids',
        name: 'Ids',
        type: 'json',
        default: '{}',
        displayOptions: { show: { resource: ['salesTaxRegulation'], operation: ['deleteMany'] } },
        description: 'Ids',
    },
];
