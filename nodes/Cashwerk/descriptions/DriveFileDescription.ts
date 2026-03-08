import { INodeProperties } from 'n8n-workflow';

export const driveFileOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['driveFile'] } },
        options: [
            { name: 'Delete', value: 'delete', action: 'Delete a Drive File', description: 'Permanently delete a drive file' },
            { name: 'Get Details', value: 'getDetails', action: 'Get Drive File Details', description: 'Get file details with metadata' },
            { name: 'Move', value: 'move', action: 'Move a Drive File', description: 'Move file to another location or drive' },
            { name: 'Move to Trash', value: 'moveToTrash', action: 'Move Drive File to Trash', description: 'Move file to trash (soft delete)' },
            { name: 'Restore', value: 'restore', action: 'Restore a Drive File', description: 'Restore file from trash' },
            { name: 'Update', value: 'update', action: 'Update a Drive File', description: 'Update file name or expiry date' },
            { name: 'Update Tags', value: 'updateTags', action: 'Update Drive File Tags', description: 'Set tags on a file' },
        ],
        default: 'getDetails',
    },
];

const fileIdField = (operations: string[]): INodeProperties => ({
    displayName: 'File ID',
    name: 'driveFileId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['driveFile'], operation: operations } },
    description: 'The ID of the drive file',
});

export const driveFileFields: INodeProperties[] = [
    fileIdField(['update', 'delete', 'getDetails', 'move', 'moveToTrash', 'restore', 'updateTags']),

    // ── update ──
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['driveFile'], operation: ['update'] } },
        options: [
            { displayName: 'Filename', name: 'filename', type: 'string', default: '', description: 'New filename' },
            { displayName: 'Expiry Date', name: 'expiryDate', type: 'dateTime', default: '', description: 'Custom expiry date for the file' },
        ],
    },

    // ── move ──
    {
        displayName: 'Current Drive',
        name: 'currentDriveId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getDrives' },
        required: true,
        default: '',
        displayOptions: { show: { resource: ['driveFile'], operation: ['move'] } },
        description: 'The drive the file currently belongs to',
    },
    {
        displayName: 'Move Options',
        name: 'moveOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['driveFile'], operation: ['move'] } },
        options: [
            {
                displayName: 'Destination Drive',
                name: 'destinationDriveId',
                type: 'options',
                typeOptions: { loadOptionsMethod: 'getDrives' },
                default: '',
                description: 'Move to a different drive (leave empty to stay in current drive)',
            },
            { displayName: 'Parent Folder ID', name: 'parentFolderId', type: 'number', default: 0, description: 'Target parent folder ID (0 for root)' },
        ],
    },

    // ── updateTags ──
    {
        displayName: 'Tag IDs',
        name: 'tagIds',
        type: 'json',
        required: true,
        default: '[]',
        displayOptions: { show: { resource: ['driveFile'], operation: ['updateTags'] } },
        description: 'Array of tag IDs to assign (e.g. [1, 2, 3])',
    },
];
