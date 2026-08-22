import { INodeProperties } from 'n8n-workflow';

export const assetUnitOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['assetUnit'] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create an asset unit',
				description: 'Create a new asset unit',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an asset unit',
				description: 'Delete an asset unit',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an asset unit',
				description: 'Get an asset unit by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many asset units',
				description: 'Get many asset units for an organization',
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search asset units',
				description: 'Search for a unit by name within an organization',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an asset unit',
				description: 'Update an asset unit',
			},
		],
		default: 'getAll',
	},
];

export const assetUnitFields: INodeProperties[] = [
	// ── get (by ID) ──
	{
		displayName: 'Asset Unit ID',
		name: 'assetUnitId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['assetUnit'], operation: ['get'] } },
		description: 'The ID of the asset unit to retrieve',
	},
	// ── create ──
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['assetUnit'], operation: ['create'] },
		},
		description: 'Name of the asset unit',
	},
	{
		displayName: 'Short Code',
		name: 'shortCode',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['assetUnit'], operation: ['create'] },
		},
		description: 'Short code of the asset unit (e.g. pcs, kg, m)',
	},
	// ── search ──
	{
		displayName: 'Search Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['assetUnit'], operation: ['search'] },
		},
		description: 'Search term to filter units by name or short code',
	},
	// ── update ──
	{
		displayName: 'Asset Unit ID',
		name: 'assetUnitId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['assetUnit'], operation: ['update'] },
		},
		description: 'The ID of the asset unit to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['assetUnit'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the asset unit',
			},
			{
				displayName: 'Short Code',
				name: 'shortCode',
				type: 'string',
				default: '',
				description: 'Short code of the asset unit',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'Asset Unit ID',
		name: 'assetUnitId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['assetUnit'], operation: ['delete'] },
		},
		description: 'The ID of the asset unit to delete',
	},
];
