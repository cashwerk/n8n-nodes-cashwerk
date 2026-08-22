import { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['organization'] } },
		options: [
			{
				name: 'Create Branch',
				value: 'createBranch',
				action: 'Create an organization branch',
				description: 'Create organization branch',
			},
			{
				name: 'Create Sector',
				value: 'createSector',
				action: 'Create an organization sector',
				description: 'Create organization sector',
			},
			{
				name: 'Delete Branch',
				value: 'deleteBranch',
				action: 'Delete an organization branch',
				description: 'Delete organization branch',
			},
			{
				name: 'Get My Organization',
				value: 'get',
				action: 'Get my organization',
				description: 'Get your organization details (derived from API key)',
			},
			{
				name: 'Invite User',
				value: 'inviteUser',
				action: 'Invite a user to the organization',
				description: 'Invite user to organization',
			},
			{
				name: 'Set Sector Members',
				value: 'setSectorMembers',
				action: 'Set the member list of a sector',
				description: 'Set the full member list of an organization sector',
			},
			{
				name: 'Update Headquarters',
				value: 'updateHeadquarters',
				action: 'Update the organization headquarters',
				description: 'Update organization headquarters address',
			},
			{
				name: 'Update Sector',
				value: 'updateSector',
				action: 'Update an organization sector',
				description: 'Update organization sector',
			},
			{
				name: 'Upload Logo',
				value: 'uploadLogo',
				action: 'Upload the organization logo',
				description: 'Upload organization logo',
			},
		],
		default: 'get',
	},
];

export const organizationFields: INodeProperties[] = [
	// ── get ── (no params needed, orgId derived from API key)
	// ── create ──
	{
		displayName: 'Color',
		name: 'color',
		type: 'color',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['organization'], operation: ['create'] },
		},
		description: 'Color value',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['organization'], operation: ['create'] },
		},
		description: 'Name value',
	},
	// ── update ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['organization'], operation: ['update'] },
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
			show: { resource: ['organization'], operation: ['update'] },
		},
		options: [
			{
				displayName: 'Color',
				name: 'color',
				type: 'color',
				default: '',
				description: 'Color value',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name value',
			},
		],
	},
	// ── delete ──
	{
		displayName: 'BranchId',
		name: 'branchId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ['organization'], operation: ['delete'] },
		},
		description: 'BranchId value',
	},
	// ── branch ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['organization'], operation: ['branch'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'json',
				default: '',
				description: 'Address value',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name value',
			},
		],
	},
	// ── inviteUser ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['organization'], operation: ['inviteUser'] },
		},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'json',
				default: '',
				description: 'Address value',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email value',
			},
			{
				displayName: 'EmailRepeat',
				name: 'emailRepeat',
				type: 'string',
				default: '',
				description: 'EmailRepeat value',
			},
			{
				displayName: 'FirstName',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'FirstName value',
			},
			{
				displayName: 'LastName',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'LastName value',
			},
			{
				displayName: 'LicenseId',
				name: 'licenseId',
				type: 'number',
				default: 0,
				description: 'LicenseId value',
			},
			{
				displayName: 'RoleId',
				name: 'roleId',
				type: 'number',
				default: 0,
				description: 'RoleId value',
			},
		],
	},
	// ── updateHeadquarters ──
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { resource: ['organization'], operation: ['updateHeadquarters'] },
		},
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City value',
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: '',
				description: 'Country value',
			},
			{
				displayName: 'Extra',
				name: 'extra',
				type: 'string',
				default: '',
				description: 'Extra value',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State value',
			},
			{
				displayName: 'StateCode',
				name: 'stateCode',
				type: 'string',
				default: '',
				description: 'StateCode value',
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street value',
			},
			{
				displayName: 'StreetNumber',
				name: 'streetNumber',
				type: 'string',
				default: '',
				description: 'StreetNumber value',
			},
			{
				displayName: 'Zip',
				name: 'zip',
				type: 'string',
				default: '',
				description: 'Zip value',
			},
		],
	},
	// ── uploadLogo ──
	// ── members ──
	{
		displayName: 'ID',
		name: 'id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: ['organization'], operation: ['members'] } },
		description: 'ID value',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['organization'], operation: ['members'] } },
		options: [
			{
				displayName: 'UserIds',
				name: 'userIds',
				type: 'json',
				default: '',
				description:
					'Full set of user IDs that should belong to this sector. Users currently in the sector but absent from this list are unassigned.',
			},
		],
	},
];
