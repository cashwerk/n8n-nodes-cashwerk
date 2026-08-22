import { INodeProperties } from 'n8n-workflow';

export const driveOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['drive'] } },
		options: [
			{
				name: 'Clear Trash',
				value: 'clear',
				action: 'Clear drive trash',
				description: 'Permanently delete all trashed items',
			},
			{
				name: 'Create Folder',
				value: 'createFolder',
				action: 'Create a folder in a drive',
				description: 'Create folder in drive',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a drive',
				description: 'Get drive by ID',
			},
			{
				name: 'Get Contents',
				value: 'getContents',
				action: 'Get folder contents',
				description: 'Get paginated folder contents',
			},
			{
				name: 'Get Folders',
				value: 'getFolders',
				action: 'Get drive folders',
				description: 'Get root-level folders in drive',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many drives',
				description: 'List many drives for the organization',
			},
			{
				name: 'Get Trash',
				value: 'getTrash',
				action: 'Get trashed items',
				description: 'Get trashed items in drive',
			},
			{
				name: 'Get View',
				value: 'getView',
				action: 'Get drive view',
				description: 'Get unified drive view with folders and contents',
			},
			{
				name: 'Init Chunked Upload',
				value: 'init',
				action: 'Init chunked upload',
				description: 'Initialize a chunked upload session for large files',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search in drive',
				description: 'Search for files and folders within a drive',
			},
			{
				name: 'Upload Batch',
				value: 'uploadBatch',
				action: 'Upload batch a drive',
				description: 'Batch upload multiple files',
			},
			{
				name: 'Upload File',
				value: 'uploadDirect',
				action: 'Upload file to drive',
				description: 'Upload a file to a drive',
			},
		],
		default: 'get',
	},
];

const driveIdField = (operations: string[]): INodeProperties => ({
	displayName: 'Drive Name or ID',
	name: 'driveId',
	type: 'options',
	typeOptions: { loadOptionsMethod: 'getDrives' },
	required: true,
	default: '',
	displayOptions: { show: { resource: ['drive'], operation: operations } },
	description:
		'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
});

export const driveFields: INodeProperties[] = [
	// ── Drive ID (dropdown) for operations that target a specific drive ──
	driveIdField([
		'get',
		'search',
		'uploadDirect',
		'createFolder',
		'getContents',
		'getFolders',
		'getView',
		'getTrash',
		'clear',
		'init',
	]),

	// ── getAll (list all org drives) ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['drive'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['drive'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},

	// ── search ──
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['drive'], operation: ['search'] } },
		description: 'Search term to find files and folders in the drive',
	},

	// ── uploadDirect ──
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: { resource: ['drive'], operation: ['uploadDirect'] },
		},
		description: 'Name of the binary property containing the file data to upload',
	},
	{
		displayName: 'Parent Folder ID',
		name: 'parentFolderId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['drive'], operation: ['uploadDirect'] },
		},
		description: 'ID of the folder to upload into (leave 0 for root)',
	},

	// ── createFolder ──
	{
		displayName: 'Folder Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['drive'], operation: ['createFolder'] },
		},
		description: 'Name of the folder to create',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['drive'], operation: ['createFolder'] },
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
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
				description: 'Parent folder ID (0 for root)',
			},
		],
	},

	// ── getContents ──
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['drive'], operation: ['getContents'] },
		},
		description: 'Folder ID to list contents of (0 for root)',
	},
	{
		displayName: 'Limit',
		name: 'contentsLimit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: { resource: ['drive'], operation: ['getContents'] },
		},
		description: 'Max number of items to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: {
			show: { resource: ['drive'], operation: ['getContents'] },
		},
		description: 'Number of items to skip',
	},

	// ── getView ──
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: ['drive'], operation: ['getView'] } },
		description: 'Folder ID to view (0 for root)',
	},

	// ── init (chunked upload) ──
	{
		displayName: 'Filename',
		name: 'filename',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['drive'], operation: ['init'] } },
		description: 'Original filename of the file to upload',
	},
	{
		displayName: 'File Size',
		name: 'fileSize',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['drive'], operation: ['init'] } },
		description: 'Total file size in bytes',
	},
	{
		displayName: 'MIME Type',
		name: 'mimeType',
		type: 'string',
		required: true,
		default: 'application/octet-stream',
		displayOptions: { show: { resource: ['drive'], operation: ['init'] } },
		description: 'MIME type of the file (e.g., application/pdf, image/png)',
	},
	{
		displayName: 'Additional Fields',
		name: 'initOptions',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['drive'], operation: ['init'] } },
		options: [
			{
				displayName: 'Chunk Size',
				name: 'chunkSize',
				type: 'number',
				default: 0,
				description: 'Size of each chunk in bytes',
			},
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Relative Path',
				name: 'relativePath',
				type: 'string',
				default: '',
				description: 'Relative path from folder upload',
			},
			{
				displayName: 'Upload ID',
				name: 'uploadId',
				type: 'string',
				default: '',
				description: 'Client-side upload ID for tracking',
			},
		],
	},
	// ── create ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['drive'], operation: ['create'] } },
		description: 'ID value',
	},
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['drive'], operation: ['create'] } },
		description: 'Color value',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['drive'], operation: ['create'] } },
		description: 'Name value',
	},
	{
		displayName: 'ParentFolderId',
		name: 'parentFolderId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['drive'], operation: ['create'] } },
		description: 'ParentFolderId value',
	},
	// ── uploadBatch ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['drive'], operation: ['uploadBatch'] },
		},
		description: 'ID value',
	},
];
