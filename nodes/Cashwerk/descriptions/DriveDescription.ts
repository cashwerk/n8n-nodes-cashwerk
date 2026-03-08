import { INodeProperties } from 'n8n-workflow';

export const driveOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['drive'] } },
        options: [
            { name: 'Clear Trash', value: 'clear', action: 'Clear Drive Trash', description: 'Permanently delete all trashed items' },
            { name: 'Create Folder', value: 'createFolder', action: 'Create Folder in Drive', description: 'Create a folder in a drive' },
            { name: 'Get', value: 'get', action: 'Get a Drive', description: 'Get drive by ID' },
            { name: 'Get All', value: 'getAll', action: 'Get All Drives', description: 'List all drives for the organization' },
            { name: 'Get Contents', value: 'getContents', action: 'Get Folder Contents', description: 'Get paginated folder contents' },
            { name: 'Get Folders', value: 'getFolders', action: 'Get Drive Folders', description: 'Get root-level folders in drive' },
            { name: 'Get Trash', value: 'getTrash', action: 'Get Trashed Items', description: 'Get trashed items in drive' },
            { name: 'Get View', value: 'getView', action: 'Get Drive View', description: 'Get unified drive view with folders and contents' },
            { name: 'Init Chunked Upload', value: 'init', action: 'Init Chunked Upload', description: 'Initialize a chunked upload session for large files' },
            { name: 'Search', value: 'search', action: 'Search in Drive', description: 'Search for files and folders within a drive' },
            { name: 'Upload File', value: 'uploadDirect', action: 'Upload File to Drive', description: 'Upload a file to a drive' },
        ],
        default: 'get',
    },
];

const driveIdField = (operations: string[]): INodeProperties => ({
    displayName: 'Drive',
    name: 'driveId',
    type: 'options',
    typeOptions: { loadOptionsMethod: 'getDrives' },
    required: true,
    default: '',
    displayOptions: { show: { resource: ['drive'], operation: operations } },
    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
});

export const driveFields: INodeProperties[] = [
    // ── Drive ID (dropdown) for operations that target a specific drive ──
    driveIdField(['get', 'search', 'uploadDirect', 'createFolder', 'getContents', 'getFolders', 'getView', 'getTrash', 'clear', 'init']),

    // ── getAll (list all org drives) ──
    {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        default: true,
        displayOptions: { show: { resource: ['drive'], operation: ['getAll'] } },
        description: 'Whether to return all drives or only up to a given limit',
    },
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1 },
        displayOptions: { show: { resource: ['drive'], operation: ['getAll'], returnAll: [false] } },
        description: 'Max number of drives to return',
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
        displayOptions: { show: { resource: ['drive'], operation: ['uploadDirect'] } },
        description: 'Name of the binary property containing the file data to upload',
    },
    {
        displayName: 'Parent Folder ID',
        name: 'parentFolderId',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['drive'], operation: ['uploadDirect'] } },
        description: 'ID of the folder to upload into (leave 0 for root)',
    },

    // ── createFolder ──
    {
        displayName: 'Folder Name',
        name: 'name',
        type: 'string',
        required: true,
        default: '',
        displayOptions: { show: { resource: ['drive'], operation: ['createFolder'] } },
        description: 'Name of the folder to create',
    },
    {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['drive'], operation: ['createFolder'] } },
        options: [
            { displayName: 'Color', name: 'color', type: 'string', default: '', description: 'Folder color (hex code)' },
            { displayName: 'Parent Folder ID', name: 'parentFolderId', type: 'number', default: 0, description: 'Parent folder ID (0 for root)' },
        ],
    },

    // ── getContents ──
    {
        displayName: 'Folder ID',
        name: 'folderId',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['drive'], operation: ['getContents'] } },
        description: 'Folder ID to list contents of (0 for root)',
    },
    {
        displayName: 'Limit',
        name: 'contentsLimit',
        type: 'number',
        default: 50,
        displayOptions: { show: { resource: ['drive'], operation: ['getContents'] } },
        description: 'Max number of items to return',
    },
    {
        displayName: 'Offset',
        name: 'offset',
        type: 'number',
        default: 0,
        displayOptions: { show: { resource: ['drive'], operation: ['getContents'] } },
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
            { displayName: 'Chunk Size', name: 'chunkSize', type: 'number', default: 0, description: 'Size of each chunk in bytes' },
            { displayName: 'Upload ID', name: 'uploadId', type: 'string', default: '', description: 'Client-side upload ID for tracking' },
            { displayName: 'Parent Folder ID', name: 'parentFolderId', type: 'number', default: 0, description: 'Parent folder ID' },
            { displayName: 'Relative Path', name: 'relativePath', type: 'string', default: '', description: 'Relative path from folder upload' },
        ],
    },
];
