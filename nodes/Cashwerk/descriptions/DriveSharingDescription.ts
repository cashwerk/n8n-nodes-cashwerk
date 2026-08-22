import { INodeProperties } from 'n8n-workflow';

export const driveSharingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['driveSharing'] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a drive sharing',
				description: 'Delete share access',
			},
			{
				name: 'Delete Access',
				value: 'deleteAccess',
				action: 'Delete share access',
				description: "Remove a user's access entry from a share",
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a drive sharing',
				description: 'Get shared file',
			},
			{
				name: 'Get Folder Contents',
				value: 'getFolderContents',
				action: 'Get shared folder contents',
				description: 'List items inside a shared folder',
			},
			{
				name: 'Get Shared File',
				value: 'getSharedFile',
				action: 'Get shared file',
				description: 'Get details of a shared file',
			},
			{
				name: 'Get Shared Folder',
				value: 'getSharedFolder',
				action: 'Get shared folder',
				description: 'Get details of a shared folder',
			},
			{
				name: 'Get Shared Items',
				value: 'getSharedItems',
				action: 'Get all shared items',
				description: 'List all shared drive items',
			},
			{
				name: 'Share',
				value: 'share',
				action: 'Share a drive sharing',
				description: 'Share file to user',
			},
			{
				name: 'Share File',
				value: 'shareFile',
				action: 'Share file with user',
				description: 'Share a file with a user',
			},
			{
				name: 'Share Folder',
				value: 'shareFolder',
				action: 'Share folder with user',
				description: 'Share a folder with a user',
			},
			{
				name: 'Unshare',
				value: 'unshare',
				action: 'Unshare a drive sharing',
				description: 'Unshare file from user',
			},
			{
				name: 'Unshare File',
				value: 'unshareFile',
				action: 'Unshare file from user',
				description: "Remove a user's access to a shared file",
			},
			{
				name: 'Unshare Folder',
				value: 'unshareFolder',
				action: 'Unshare folder from user',
				description: "Remove a user's access to a shared folder",
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a drive sharing',
				description: 'Update share access',
			},
			{
				name: 'Update Access',
				value: 'updateAccess',
				action: 'Update share access',
				description: "Update a user's access level (e.g. readonly)",
			},
			{
				name: 'Update Share',
				value: 'updateShare',
				action: 'Update share settings',
				description: 'Update share visibility, password, expiry, or add users',
			},
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
	displayOptions: {
		show: { resource: ['driveSharing'], operation: operations },
	},
	description: 'The ID of the folder',
});

const fileIdField = (operations: string[]): INodeProperties => ({
	displayName: 'File ID',
	name: 'fileId',
	type: 'number',
	required: true,
	default: 0,
	displayOptions: {
		show: { resource: ['driveSharing'], operation: operations },
	},
	description: 'The ID of the file',
});

const userIdField = (operations: string[]): INodeProperties => ({
	displayName: 'User Name or ID',
	name: 'userId',
	type: 'options',
	required: true,
	default: '',
	typeOptions: { loadOptionsMethod: 'getUsers' },
	displayOptions: {
		show: { resource: ['driveSharing'], operation: operations },
	},
	description:
		'The user to share with or remove access from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
});

const shareIdField = (operations: string[]): INodeProperties => ({
	displayName: 'Share ID',
	name: 'shareId',
	type: 'number',
	required: true,
	default: 0,
	displayOptions: {
		show: { resource: ['driveSharing'], operation: operations },
	},
	description: 'The ID of the share record (from "Get Shared Items" output)',
});

const accessIdField = (operations: string[]): INodeProperties => ({
	displayName: 'Access Entry ID',
	name: 'accessId',
	type: 'number',
	required: true,
	default: 0,
	displayOptions: {
		show: { resource: ['driveSharing'], operation: operations },
	},
	description: "The ID of a specific user's access entry within the share",
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
		displayOptions: {
			show: {
				resource: ['driveSharing'],
				operation: ['shareFolder', 'shareFile'],
			},
		},
		description: 'Whether to send a notification to the user about the share',
	},

	// ── Update Access: readonly ──
	{
		displayName: 'Readonly',
		name: 'readonly',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['updateAccess'] },
		},
		description: 'Whether the user should have read-only access',
	},

	// ── Delete Access: recursive ──
	{
		displayName: 'Recursive',
		name: 'recursive',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['deleteAccess'] },
		},
		description: 'Whether to recursively remove access from all nested items',
	},

	// ── Update Share: settings ──
	{
		displayName: 'Public',
		name: 'isPublic',
		type: 'boolean',
		required: true,
		default: false,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['updateShare'] },
		},
		description: 'Whether the share should be publicly accessible',
	},
	{
		displayName: 'Share Options',
		name: 'shareOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['updateShare'] },
		},
		options: [
			{
				displayName: 'Add User IDs',
				name: 'addUserIds',
				type: 'json',
				default: '[]',
				description: 'Array of user IDs to add to the share (e.g. [1, 2, 3])',
			},
			{
				displayName: 'Expiry Date',
				name: 'expiryDate',
				type: 'dateTime',
				default: '',
				description: 'Optional expiry date for the share',
			},
			{
				displayName: 'Notify Users',
				name: 'notifyUsers',
				type: 'boolean',
				default: false,
				description: 'Whether to notify users about the share update',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Optional password to protect the share',
			},
		],
	},
	// ── get ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['get'] },
		},
		description: 'ID value',
	},
	// ── update ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['update'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'AccessId',
		name: 'accessId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['update'] },
		},
		description: 'AccessId value',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Readonly',
				name: 'readonly',
				type: 'boolean',
				default: false,
				description: 'Whether readonly value',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['delete'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'AccessId',
		name: 'accessId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['delete'] },
		},
		description: 'AccessId value',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['delete'] },
		},
		options: [
			{
				displayName: 'Recursive',
				name: 'recursive',
				type: 'boolean',
				default: false,
				description: 'Whether recursive filter',
			},
		],
	},
	// ── share ──
	{
		displayName: 'FileId',
		name: 'fileId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['share'] },
		},
		description: 'FileId value',
	},
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['share'] },
		},
		description: 'UserId value',
	},
	// ── unshare ──
	{
		displayName: 'FileId',
		name: 'fileId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['unshare'] },
		},
		description: 'FileId value',
	},
	{
		displayName: 'UserId',
		name: 'userId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['driveSharing'], operation: ['unshare'] },
		},
		description: 'UserId value',
	},
];
