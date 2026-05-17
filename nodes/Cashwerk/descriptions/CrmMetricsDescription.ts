import { INodeProperties } from 'n8n-workflow';

export const crmMetricsOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['crmMetrics'] } },
        options: [
            { name: 'Get Contact Metrics', value: 'getContactMetrics', action: 'Get Contact Metrics', description: 'Get contact metrics for the organization' },
            { name: 'Get Company Metrics', value: 'getCompanyMetrics', action: 'Get Company Metrics', description: 'Get company metrics for the organization' },
            { name: 'Get All', value: 'getAll', action: 'Get All a CRM Metrics', description: 'Get company metrics for the organization' },
        ],
        default: 'getContactMetrics',
    },
];

export const crmMetricsFields: INodeProperties[] = [
    // ── getContactMetrics ──
    {
        displayName: 'Date',
        name: 'date',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['crmMetrics'], operation: ['getContactMetrics'] } },
        description: 'Optional date for metrics snapshot (ISO format, e.g. 2026-01-01). Defaults to today if not set.',
    },
    // ── getCompanyMetrics ──
    {
        displayName: 'Date',
        name: 'date',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['crmMetrics'], operation: ['getCompanyMetrics'] } },
        description: 'Optional date for metrics snapshot (ISO format, e.g. 2026-01-01). Defaults to today if not set.',
    },
    // ── getAll ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['crmMetrics'], operation: ['getAll'] } },
        description: 'Whether to return all results or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['crmMetrics'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of results to return',
    },
    {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: { show: { resource: ['crmMetrics'], operation: ['getAll'] } },
        options: [
            { displayName: 'Date', name: 'date', type: 'string', default: "", description: 'Date filter' },
        ],
    },
];
