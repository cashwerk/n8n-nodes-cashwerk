import { INodeProperties } from 'n8n-workflow';

export const driveSharingOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['driveSharing'] } },
        options: [
            { name: 'Delete Access', value: 'deleteAccess', action: 'Delete Share Access', description: 'Remove a user\'s access entry from a share' },
            { name: 'Get Folder Contents', value: 'getFolderContents', action: 'Get Shared Folder Contents', description: 'List items inside a shared folder' },
            { name: 'Get Shared File', value: 'getSharedFile', action: 'Get Shared File', description: 'Get details of a shared file' },
            { name: 'Get Shared Folder', value: 'getSharedFolder', action: 'Get Shared Folder', description: 'Get details of a shared folder' },
            { name: 'Get Shared Items', value: 'getSharedItems', action: 'Get All Shared Items', description: 'List all shared drive items' },
            { name: 'Share File', value: 'shareFile', action: 'Share File with User', description: 'Share a file with a user' },
            { name: 'Share Folder', value: 'shareFolder', action: 'Share Folder with User', description: 'Share a folder with a user' },
            { name: 'Unshare File', value: 'unshareFile', action: 'Unshare File from User', description: 'Remove a user\'s access to a shared file' },
            { name: 'Unshare Folder', value: 'unshareFolder', action: 'Unshare Folder from User', description: 'Remove a user\'s access to a shared folder' },
            { name: 'Update Access', value: 'updateAccess', action: 'Update Share Access', description: 'Update a user\'s access level (e.g. readonly)' },
            { name: 'Update Share', value: 'updateShare', action: 'Update Share Settings', description: 'Update share visibility, password, expiry, or add users' },
        ],
        default: 'getSharedItems',
    },
];

const folderIdField = (operations: string[]): INodeProperties => ({
    displayName: 'Folder ID',
    name: 'folderId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: { show: { resource: ['driveSharing'], operation: operations } },
    description: 'The ID of the folder',
});

const fileIdField = (operations: string[]): INodeProperties => ({
    displayName: 'File ID',
    name: 'fileId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: { show: { resource: ['driveSharing'], operation: operations } },
    description: 'The ID of the file',
});

const userIdField = (operations: string[]): INodeProperties => ({
    displayName: 'User',
    name: 'userId',
    type: 'options',
    required: true,
    default: '',
    typeOptions: { loadOptionsMethod: 'getUsers' },
    displayOptions: { show: { resource: ['driveSharing'], operation: operations } },
    description: 'The user to share with or remove access from',
});

const shareIdField = (operations: string[]): INodeProperties => ({
    displayName: 'Share ID',
    name: 'shareId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: { show: { resource: ['driveSharing'], operation: operations } },
    description: 'The ID of the share record (from "Get Shared Items" output)',
});

const accessIdField = (operations: string[]): INodeProperties => ({
    displayName: 'Access Entry ID',
    name: 'accessId',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: { show: { resource: ['driveSharing'], operation: operations } },
    description: 'The ID of a specific user\'s access entry within the share',
});

export const driveSharingFields: INodeProperties[] = [
    // ── Shared fields ──
    folderIdField(['shareFolder', 'unshareFolder', 'getSharedFolder', 'getFolderContents']),
    fileIdField(['shareFile', 'unshareFile', 'getSharedFile']),
    userIdField(['shareFolder', 'shareFile', 'unshareFolder', 'unshareFile']),
    shareIdField(['updateAccess', 'deleteAccess', 'updateShare']),
    accessIdField(['updateAccess', 'deleteAccess']),

    // ── Share Folder / Share File: notify ──
    {
        displayName: 'Notify User',
        name: 'notify',
        type: 'boolean',
        required: true,
        default: true,
        displayOptions: { show: { resource: ['driveSharing'], operation: ['shareFolder', 'shareFile'] } },
        description: 'Whether to send a notification to the user about the share',
    },

    // ── Update Access: readonly ──
    {
        displayName: 'Readonly',
        name: 'readonly',
        type: 'boolean',
        required: true,
        default: false,
        displayOptions: { show: { resource: ['driveSharing'], operation: ['updateAccess'] } },
        description: 'Whether the user should have read-only access',
    },

    // ── Delete Access: recursive ──
    {
        displayName: 'Recursive',
        name: 'recursive',
        type: 'boolean',
        required: true,
        default: false,
        displayOptions: { show: { resource: ['driveSharing'], operation: ['deleteAccess'] } },
        description: 'Whether to recursively remove access from all nested items',
    },

    // ── Update Share: settings ──
    {
        displayName: 'Public',
        name: 'isPublic',
        type: 'boolean',
        required: true,
        default: false,
        displayOptions: { show: { resource: ['driveSharing'], operation: ['updateShare'] } },
        description: 'Whether the share should be publicly accessible',
    },
    {
        displayName: 'Share Options',
        name: 'shareOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: { show: { resource: ['driveSharing'], operation: ['updateShare'] } },
        options: [
            { displayName: 'Notify Users', name: 'notifyUsers', type: 'boolean', default: false, description: 'Whether to notify users about the share update' },
            { displayName: 'Password', name: 'password', type: 'string', typeOptions: { password: true }, default: '', description: 'Optional password to protect the share' },
            { displayName: 'Expiry Date', name: 'expiryDate', type: 'dateTime', default: '', description: 'Optional expiry date for the share' },
            { displayName: 'Add User IDs', name: 'addUserIds', type: 'json', default: '[]', description: 'Array of user IDs to add to the share (e.g. [1, 2, 3])' },
        ],
    },
];
