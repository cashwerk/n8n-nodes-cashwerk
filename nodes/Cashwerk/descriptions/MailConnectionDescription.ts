import { INodeProperties } from 'n8n-workflow';

export const mailConnectionOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['mailConnection'] } },
        options: [
            { name: 'Get All', value: 'getAll', action: 'Get all mail connections', description: 'List all mail connections for the authenticated user' },
        ],
        default: 'getAll',
    },
];

export const mailConnectionFields: INodeProperties[] = [];
