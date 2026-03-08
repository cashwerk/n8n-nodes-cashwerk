import { INodeProperties } from 'n8n-workflow';

export const taskCommentOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['taskComment'] } },
        options: [
            { name: 'Update', value: 'update', action: 'Update a Task Comment', description: 'Update comment' },
            { name: 'Delete', value: 'delete', action: 'Delete a Task Comment', description: 'Delete a comment' },
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
        displayOptions: { show: { resource: ['taskComment'], operation: ['update'] } },
        description: 'The ID of the task comment',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['taskComment'], operation: ['update'] } },
        options: [
            { displayName: 'Content', name: 'content', type: 'string', default: '', description: 'Content' },
        ],
    },
    // ── delete ──
    {
        displayName: 'Task Comment ID',
        name: 'taskCommentId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taskComment'], operation: ['delete'] } },
        description: 'The ID of the task comment',
    },
];
