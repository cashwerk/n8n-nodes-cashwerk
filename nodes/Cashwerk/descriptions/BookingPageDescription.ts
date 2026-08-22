import { INodeProperties } from 'n8n-workflow';

export const bookingPageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['bookingPage'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a booking page',
				description: 'Create a booking page',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a booking page',
				description: 'Delete booking page by ID',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a booking page',
				description: 'Get booking page by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many a booking page',
				description: 'List booking pages',
			},
			{
				name: 'Share Links',
				value: 'shareLinks',
				action: 'Share links a booking page',
				description: 'Create a share link for a booking page',
			},
			{
				name: 'Theme',
				value: 'theme',
				action: 'Theme a booking page',
				description: 'Update booking page theme',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a booking page',
				description: 'Update booking page by ID',
			},
		],
		default: 'get',
	},
];

export const bookingPageFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['bookingPage'], operation: ['get'] } },
		description: 'ID value',
	},
	// ── getAll ──
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['getAll'] },
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: {
			show: {
				resource: ['bookingPage'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	// ── create ──
	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['create'] },
		},
		description: 'Slug value',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['create'] },
		},
		description: 'Title value',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['create'] },
		},
		options: [
			{
				displayName: 'DefaultCalendarId',
				name: 'defaultCalendarId',
				type: 'number',
				default: 0,
				description: 'DefaultCalendarId value',
			},
			{
				displayName: 'DefaultLocale',
				name: 'defaultLocale',
				type: 'string',
				default: '',
				description: 'DefaultLocale value',
			},
			{
				displayName: 'DefaultTimezone',
				name: 'defaultTimezone',
				type: 'string',
				default: '',
				description: 'DefaultTimezone value',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description value',
			},
			{
				displayName: 'PageType',
				name: 'pageType',
				type: 'json',
				default: '',
				description: 'PageType value',
			},
		],
	},
	// ── update ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['update'] },
		},
		description: 'ID value',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'DefaultCalendarId',
				name: 'defaultCalendarId',
				type: 'number',
				default: 0,
				description: 'DefaultCalendarId value',
			},
			{
				displayName: 'DefaultLocale',
				name: 'defaultLocale',
				type: 'string',
				default: '',
				description: 'DefaultLocale value',
			},
			{
				displayName: 'DefaultTimezone',
				name: 'defaultTimezone',
				type: 'string',
				default: '',
				description: 'DefaultTimezone value',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description value',
			},
			{
				displayName: 'IsPublished',
				name: 'isPublished',
				type: 'boolean',
				default: false,
				description: 'Whether isPublished value',
			},
			{
				displayName: 'PageType',
				name: 'pageType',
				type: 'json',
				default: '',
				description: 'PageType value',
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				description: 'Slug value',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title value',
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
			show: { resource: ['bookingPage'], operation: ['delete'] },
		},
		description: 'ID value',
	},
	// ── shareLinks ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['shareLinks'] },
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
			show: { resource: ['bookingPage'], operation: ['shareLinks'] },
		},
		options: [
			{
				displayName: 'ExpiryDate',
				name: 'expiryDate',
				type: 'string',
				default: '',
				description: 'ExpiryDate value',
			},
			{
				displayName: 'IsPublic',
				name: 'isPublic',
				type: 'boolean',
				default: false,
				description: 'Whether isPublic value',
			},
			{
				displayName: 'MaxUsageCount',
				name: 'maxUsageCount',
				type: 'number',
				default: 0,
				description: 'MaxUsageCount value',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Note value',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'Password value',
			},
		],
	},
	// ── theme ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['bookingPage'], operation: ['theme'] },
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
			show: { resource: ['bookingPage'], operation: ['theme'] },
		},
		options: [
			{
				displayName: 'AccentColor',
				name: 'accentColor',
				type: 'color',
				default: '',
				description: 'AccentColor value',
			},
			{
				displayName: 'BackgroundColor',
				name: 'backgroundColor',
				type: 'color',
				default: '',
				description: 'BackgroundColor value',
			},
			{
				displayName: 'ButtonStyle',
				name: 'buttonStyle',
				type: 'json',
				default: '',
				description: 'ButtonStyle value',
			},
			{
				displayName: 'CoverFileId',
				name: 'coverFileId',
				type: 'number',
				default: 0,
				description: 'CoverFileId value',
			},
			{
				displayName: 'FontFamily',
				name: 'fontFamily',
				type: 'string',
				default: '',
				description: 'FontFamily value',
			},
			{
				displayName: 'HideBranding',
				name: 'hideBranding',
				type: 'boolean',
				default: false,
				description: 'Whether hideBranding value',
			},
			{
				displayName: 'LogoFileId',
				name: 'logoFileId',
				type: 'number',
				default: 0,
				description: 'LogoFileId value',
			},
			{
				displayName: 'PrimaryColor',
				name: 'primaryColor',
				type: 'color',
				default: '',
				description: 'PrimaryColor value',
			},
			{
				displayName: 'TextColor',
				name: 'textColor',
				type: 'color',
				default: '',
				description: 'TextColor value',
			},
		],
	},
];
