import { INodeProperties } from 'n8n-workflow';

export const workTimeOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['workTime'] } },
        options: [
            { name: 'Get', value: 'get', action: 'Get Work Time', description: 'Get latest work time for a user' },
            { name: 'For User', value: 'forUser', action: 'Get Work Time for User', description: 'Create a work time period for a user' },
        ],
        default: 'get',
    },
];

export const workTimeFields: INodeProperties[] = [
    // ── get ──
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'number',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workTime'], operation: ['get'] } },
        description: 'The ID of the user to get the latest work time for',
    },
    // ── forUser ──
    {
        displayName: 'WorkTimeId',
        name: 'workTimeId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['workTime'], operation: ['forUser'] } },
        description: 'WorkTimeId',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['workTime'], operation: ['forUser'] } },
        options: [
            { displayName: 'Start', name: 'start', type: 'dateTime', default: '', description: 'Start' },
            { displayName: 'End', name: 'end', type: 'dateTime', default: '', description: 'End' },
            { displayName: 'VacationDays', name: 'vacationDays', type: 'number', default: 0, description: 'VacationDays' },
            { displayName: 'Overtime', name: 'overtime', type: 'number', default: 0, description: 'Overtime' },
            { displayName: 'WorkDays', name: 'workDays', type: 'json', default: '{}', description: 'WorkDays' },
            { displayName: 'CreateNew', name: 'createNew', type: 'boolean', default: false, description: 'CreateNew' },
        ],
    },
];
