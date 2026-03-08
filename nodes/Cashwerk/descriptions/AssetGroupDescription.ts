import { INodeProperties } from 'n8n-workflow';

export const assetGroupOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['assetGroup'] } },
        options: [
            { name: 'Create', value: 'create', action: 'Create an asset group', description: 'Create a new asset group' },
            { name: 'Delete', value: 'delete', action: 'Delete an asset group', description: 'Delete an asset group' },
            { name: 'Get', value: 'get', action: 'Get an asset group', description: 'Get an asset group by ID' },
            { name: 'Get All', value: 'getAll', action: 'Get all asset groups', description: 'Get all asset groups for an organization' },
            { name: 'Update', value: 'update', action: 'Update an asset group', description: 'Update an asset group' },
        ],
        default: 'getAll',
    },
];

export const assetGroupFields: INodeProperties[] = [
    // ── get (by ID) ──
    {
        displayName: 'Asset Group ID',
        name: 'assetGroupId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['assetGroup'], operation: ['get'] } },
        description: 'The ID of the asset group to retrieve',
    },
    // ── create ──
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['assetGroup'], operation: ['create'] } },
        description: 'Name of the asset group',
    },
    {
        displayName: 'Color',
        name: 'color',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['assetGroup'], operation: ['create'] } },
        description: 'Color of the asset group (e.g. #FF5733)',
    },
    // ── update ──
    {
        displayName: 'Asset Group ID',
        name: 'assetGroupId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['assetGroup'], operation: ['update'] } },
        description: 'The ID of the asset group to update',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['assetGroup'], operation: ['update'] } },
        options: [
            { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'Name of the asset group' },
            { displayName: 'Color', name: 'color', type: 'string', default: '', description: 'Color of the asset group' },
        ],
    },
    // ── delete ──
    {
        displayName: 'Asset Group ID',
        name: 'assetGroupId',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['assetGroup'], operation: ['delete'] } },
        description: 'The ID of the asset group to delete',
    },
];
