import { INodeProperties } from 'n8n-workflow';

export const taskBoardColumnOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['taskBoardColumn'] } },
        options: [
            { name: 'Delete', value: 'delete', action: 'Delete a Task Board Column', description: 'Delete a task board column' },
            { name: 'Create Task', value: 'createTask', action: 'Create Task in Column', description: 'Create a task in a board column' },
            { name: 'Update Name', value: 'updateName', action: 'Update Column Name', description: 'Update a task board column name' },
        ],
        default: 'delete',
    },
];

export const taskBoardColumnFields: INodeProperties[] = [
    // ── delete ──
    {
        displayName: 'Task Board Column ID',
        name: 'taskBoardColumnId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['delete'] } },
        description: 'The ID of the task board column',
    },
    // ── createTask ──
    {
        displayName: 'TaskBoardColumnId',
        name: 'taskBoardColumnId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['createTask'] } },
        description: 'TaskBoardColumnId',
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['createTask'] } },
        description: 'Title',
    },
    {
        displayName: 'ColumnId',
        name: 'columnId',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['createTask'] } },
        description: 'ColumnId',
    },
    {
        displayName: 'BoardName',
        name: 'boardName',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['createTask'] } },
        description: 'BoardName',
    },
    {
        displayName: 'ColumnName',
        name: 'columnName',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['createTask'] } },
        description: 'ColumnName',
    },
    {
        displayName: 'IsFirstPosition',
        name: 'isFirstPosition',
        type: 'boolean',
        default: false,
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['createTask'] } },
        description: 'IsFirstPosition',
    },
    // ── updateName ──
    {
        displayName: 'TaskBoardColumnId',
        name: 'taskBoardColumnId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['updateName'] } },
        description: 'TaskBoardColumnId',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['taskBoardColumn'], operation: ['updateName'] } },
        description: 'Name',
    },
];
