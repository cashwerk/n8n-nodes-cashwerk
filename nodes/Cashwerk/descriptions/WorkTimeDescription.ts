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
            { name: 'Delete', value: 'delete', action: 'Delete a Work Time', description: 'Delete a work time period' },
            { name: 'Update Vacation Days', value: 'updateVacationDays', action: 'Update Vacation Days a Work Time', description: 'Update vacation days for a user' },
            { name: 'Update Work Days', value: 'updateWorkDays', action: 'Update Work Days a Work Time', description: 'Update work days for a user' },
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
    // ── delete ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['workTime'], operation: ['delete'] } },
        description: 'Id value',
    },
    {
        displayName: 'WorkTimeId',
        name: 'workTimeId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['workTime'], operation: ['delete'] } },
        description: 'WorkTimeId value',
    },
    // ── updateVacationDays ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['workTime'], operation: ['updateVacationDays'] } },
        description: 'Id value',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['workTime'], operation: ['updateVacationDays'] } },
        options: [
            { displayName: 'CreateNew', name: 'createNew', type: 'boolean', default: false, description: 'CreateNew value' },
            { displayName: 'VacationDays', name: 'vacationDays', type: 'number', default: 0, description: 'VacationDays value' },
            { displayName: 'WorkDays', name: 'workDays', type: 'json', default: "", description: 'WorkDays value' },
        ],
    },
    // ── updateWorkDays ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['workTime'], operation: ['updateWorkDays'] } },
        description: 'Id value',
    },
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['workTime'], operation: ['updateWorkDays'] } },
        options: [
            { displayName: 'CreateNew', name: 'createNew', type: 'boolean', default: false, description: 'CreateNew value' },
            { displayName: 'VacationDays', name: 'vacationDays', type: 'number', default: 0, description: 'VacationDays value' },
            { displayName: 'WorkDays', name: 'workDays', type: 'json', default: "", description: 'WorkDays value' },
        ],
    },
];
