import { INodeProperties } from 'n8n-workflow';

export const chatOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['chat'] } },
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive a chat',
				description: 'Archive a conversation',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a chat',
				description: 'Create a direct (1:1) conversation',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a chat',
				description: 'Delete a conversation',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many a chat',
				description: 'List chat conversations',
			},
			{
				name: 'Participants',
				value: 'participants',
				action: 'Participants a chat',
				description: 'Add a participant to a group conversation',
			},
			{
				name: 'Read',
				value: 'read',
				action: 'Read a chat',
				description: 'Mark messages in a conversation as read',
			},
			{
				name: 'Send Message',
				value: 'sendMessage',
				action: 'Send a message to a conversation',
				description: 'Send a message to a conversation',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a chat',
				description: 'Update conversation (rename group)',
			},
		],
		default: 'getAll',
	},
];

export const chatFields: INodeProperties[] = [
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['chat'], operation: ['getAll'] } },
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: { resource: ['chat'], operation: ['getAll'], returnAll: [false] },
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['chat'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'string',
				default: '',
				description: 'Archived filter',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'Cursor filter',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'DIRECT',
				description: 'Type filter',
				options: [
					{ name: 'Direct', value: 'DIRECT' },
					{ name: 'Group', value: 'GROUP' },
					{ name: 'Project', value: 'PROJECT' },
				],
			},
		],
	},
	// ── create ──
	{
		displayName: 'TargetUserId',
		name: 'targetUserId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['chat'], operation: ['create'] } },
		description: 'TargetUserId value',
	},
	// ── update ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['update'] } },
		description: 'ID value',
	},
	// ── delete ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['delete'] } },
		description: 'ID value',
	},
	// ── archive ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['archive'] } },
		description: 'ID value',
	},
	// ── participants ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['chat'], operation: ['participants'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['chat'], operation: ['participants'] },
		},
		options: [
			{
				displayName: 'UserId',
				name: 'userId',
				type: 'number',
				default: 0,
				description: 'UserId value',
			},
		],
	},
	// ── read ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['read'] } },
		description: 'ID value',
	},
	// ── messages ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['chat'], operation: ['messages'] } },
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['chat'], operation: ['messages'] } },
		options: [
			{
				displayName: 'AttachmentIds',
				name: 'attachmentIds',
				type: 'json',
				default: '',
				description: 'IDs of previously uploaded attachments to link to this message',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'Message content (text body)',
			},
			{
				displayName: 'IdempotencyKey',
				name: 'idempotencyKey',
				type: 'string',
				default: '',
				description: 'Client-generated idempotency key to prevent duplicate messages on retry',
			},
			{
				displayName: 'MentionedUserIds',
				name: 'mentionedUserIds',
				type: 'json',
				default: '',
				description: 'User IDs mentioned in the message',
			},
			{
				displayName: 'ReplyToId',
				name: 'replyToId',
				type: 'string',
				default: '',
				description: 'ID of the message being replied to',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'TEXT',
				description: 'Message type',
				options: [
					{ name: 'Document', value: 'DOCUMENT' },
					{ name: 'Drive File', value: 'DRIVE_FILE' },
					{ name: 'Drive Folder', value: 'DRIVE_FOLDER' },
					{ name: 'Gif', value: 'GIF' },
					{ name: 'Image', value: 'IMAGE' },
					{ name: 'System', value: 'SYSTEM' },
					{ name: 'Text', value: 'TEXT' },
					{ name: 'Video', value: 'VIDEO' },
					{ name: 'Voice', value: 'VOICE' },
				],
			},
		],
	},
];
