import { INodeProperties } from 'n8n-workflow';

export const driveFolderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['driveFolder'] } },
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a drive folder',
				description: 'Permanently delete a drive folder',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a drive folder',
				description: 'Get drive folder by ID',
			},
			{
				name: 'Get Details',
				value: 'getDetails',
				action: 'Get drive folder details',
				description: 'Get folder details with metadata',
			},
			{
				name: 'Get Size',
				value: 'getSize',
				action: 'Get drive folder size',
				description: 'Calculate folder size',
			},
			{
				name: 'Get Subfolders',
				value: 'getSubfolders',
				action: 'Get drive subfolders',
				description: 'Get child folders',
			},
			{
				name: 'Move',
				value: 'move',
				action: 'Move a drive folder',
				description: 'Move folder to another location or drive',
			},
			{
				name: 'Move to Trash',
				value: 'moveToTrash',
				action: 'Move drive folder to trash',
				description: 'Move folder to trash (soft delete)',
			},
			{
				name: 'Restore',
				value: 'restore',
				action: 'Restore a drive folder',
				description: 'Restore folder from trash',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a drive folder',
				description: 'Update folder name or color',
			},
			{
				name: 'Update Tags',
				value: 'updateTags',
				action: 'Update drive folder tags',
				description: 'Set tags on a folder',
			},
			{
				name: 'Zip',
				value: 'zip',
				action: 'Zip a drive folder',
				description: 'Create a ZIP archive of the folder',
			},
		],
		default: 'get',
	},
];

const folderIdField = (operations: string[]): INodeProperties => ({
	displayName: 'Folder ID',
	name: 'driveFolderId',
	type: 'string',
	required: true,
	default: '',
	displayOptions: {
		show: { resource: ['driveFolder'], operation: operations },
	},
	description: 'The ID of the drive folder',
});

export const driveFolderFields: INodeProperties[] = [
	folderIdField([
		'get',
		'update',
		'delete',
		'getDetails',
		'getSize',
		'getSubfolders',
		'move',
		'moveToTrash',
		'restore',
		'updateTags',
		'zip',
	]),

	// ── update ──
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['driveFolder'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Folder color (hex code)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Folder name',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
				description: 'Move to a different parent folder',
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
		displayOptions: {
			show: { resource: ['driveFolder'], operation: ['move'] },
		},
		description:
			'The drive the folder currently belongs to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Move Options',
		name: 'moveOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { resource: ['driveFolder'], operation: ['move'] },
		},
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
			show: { resource: ['driveFolder'], operation: ['updateTags'] },
		},
		description: 'Array of tag IDs to assign (e.g. [1, 2, 3])',
	},
];
