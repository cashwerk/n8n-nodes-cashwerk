import { INodeProperties } from 'n8n-workflow';

export const taskCommentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['taskComment'] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a task comment',
				description: 'Delete a comment',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a task comment',
				description: 'Update comment',
			},
		],
		default: 'update',
	},
];

export const taskCommentFields: INodeProperties[] = [
	// ── update ──
	{
		displayName: 'Task Comment ID',
		name: 'taskCommentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['taskComment'], operation: ['update'] },
		},
		description: 'The ID of the task comment',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['taskComment'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'Task Comment ID',
		name: 'taskCommentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['taskComment'], operation: ['delete'] },
		},
		description: 'The ID of the task comment',
	},
];
