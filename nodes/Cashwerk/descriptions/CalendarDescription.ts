import { INodeProperties } from 'n8n-workflow';

export const calendarOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['calendar'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a calendar',
				description: 'Create a new calendar',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a calendar',
				description: 'Delete a calendar by ID',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a calendar',
				description: 'Get a calendar by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many calendars',
				description: 'Get many calendars for the organization',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a calendar',
				description: 'Update a calendar by ID',
			},
		],
		default: 'getAll',
	},
];

export const calendarFields: INodeProperties[] = [
	// ── get ──
	{
		displayName: 'Calendar ID',
		name: 'calendarId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['calendar'], operation: ['get'] } },
		description: 'The ID of the calendar to retrieve',
	},
	// ── getAll ── (no fields, returns all for organization)
	// ── create ──
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['calendar'], operation: ['create'] } },
		description: 'Name of the calendar',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['calendar'], operation: ['create'] } },
		options: [
			{
				displayName: 'Assigned User IDs',
				name: 'assignedUserIds',
				type: 'string',
				default: '',
				description: 'Comma-separated user IDs to assign to this calendar',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Calendar color (hex code)',
			},
		],
	},
	// ── update ──
	{
		displayName: 'Calendar ID',
		name: 'calendarId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['calendar'], operation: ['update'] } },
		description: 'The ID of the calendar to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['calendar'], operation: ['update'] } },
		options: [
			{
				displayName: 'Assigned User IDs',
				name: 'assignedUserIds',
				type: 'string',
				default: '',
				description: 'Comma-separated user IDs to assign to this calendar',
			},
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Calendar color (hex code)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Calendar name',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'Calendar ID',
		name: 'calendarId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['calendar'], operation: ['delete'] } },
		description: 'The ID of the calendar to delete',
	},
];
