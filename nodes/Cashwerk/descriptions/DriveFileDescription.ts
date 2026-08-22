import { INodeProperties } from 'n8n-workflow';

export const driveFileOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['driveFile'] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a drive file',
				description: 'Permanently delete a drive file',
			},
			{
				name: 'Get Details',
				value: 'getDetails',
				action: 'Get drive file details',
				description: 'Get file details with metadata',
			},
			{
				name: 'Move',
				value: 'move',
				action: 'Move a drive file',
				description: 'Move file to another location or drive',
			},
			{
				name: 'Move to Trash',
				value: 'moveToTrash',
				action: 'Move drive file to trash',
				description: 'Move file to trash (soft delete)',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore a drive file',
				description: 'Restore file from trash',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a drive file',
				description: 'Update file name or expiry date',
			},
			{
				name: 'Update Tags',
				value: 'updateTags',
				action: 'Update drive file tags',
				description: 'Set tags on a file',
			},
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
		displayOptions: {
			show: { resource: ['driveFile'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Expiry Date',
				name: 'expiryDate',
				type: 'dateTime',
				default: '',
				description: 'Custom expiry date for the file',
			},
			{
				displayName: 'Filename',
				name: 'filename',
				type: 'string',
				default: '',
				description: 'New filename',
			},
		],
	},

	// ── move ──
	{
		displayName: 'Current Drive Name or ID',
		name: 'currentDriveId',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDrives' },
		required: true,
		default: '',
		displayOptions: { show: { resource: ['driveFile'], operation: ['move'] } },
		description:
			'The drive the file currently belongs to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
				displayName: 'Destination Drive Name or ID',
				name: 'destinationDriveId',
				type: 'options',
				typeOptions: { loadOptionsMethod: 'getDrives' },
				default: '',
				description:
					'Move to a different drive (leave empty to stay in current drive). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
				description: 'Target parent folder ID (0 for root)',
			},
		],
	},

	// ── updateTags ──
	{
		displayName: 'Tag IDs',
		name: 'tagIds',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: { resource: ['driveFile'], operation: ['updateTags'] },
		},
		description: 'Array of tag IDs to assign (e.g. [1, 2, 3])',
	},
];
