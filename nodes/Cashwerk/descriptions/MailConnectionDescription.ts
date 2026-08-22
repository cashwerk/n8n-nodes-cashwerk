import { INodeProperties } from 'n8n-workflow';

export const mailConnectionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['mailConnection'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many mail connections',
				description: 'List many mail connections for the authenticated user',
			},
		],
		default: 'getAll',
	},
];

export const mailConnectionFields: INodeProperties[] = [];
