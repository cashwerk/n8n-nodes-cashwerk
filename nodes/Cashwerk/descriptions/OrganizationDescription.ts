import { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['organization'] } },
        options: [
            { name: 'Get My Organization', value: 'get', action: 'Get My Organization', description: 'Get your organization details (derived from API key)' },
        ],
        default: 'get',
    },
];

export const organizationFields: INodeProperties[] = [
    // ── get ── (no params needed, orgId derived from API key)
];
