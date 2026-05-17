import { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['organization'] } },
        options: [
            { name: 'Get My Organization', value: 'get', action: 'Get My Organization', description: 'Get your organization details (derived from API key)' },
            { name: 'Create', value: 'create', action: 'Create a Organization', description: 'Create organization sector' },
            { name: 'Update', value: 'update', action: 'Update a Organization', description: 'Update organization sector' },
            { name: 'Delete', value: 'delete', action: 'Delete a Organization', description: 'Delete organization branch' },
            { name: 'Branch', value: 'branch', action: 'Branch a Organization', description: 'Create organization branch' },
            { name: 'Invite User', value: 'inviteUser', action: 'Invite User a Organization', description: 'Invite user to organization' },
            { name: 'Update Headquarters', value: 'updateHeadquarters', action: 'Update Headquarters a Organization', description: 'Update organization headquarters address' },
            { name: 'Upload Logo', value: 'uploadLogo', action: 'Upload Logo a Organization', description: 'Upload organization logo' },
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
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['organization'], operation: ['create'] } },
        description: 'Color value',
    },
    {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        required: true,
        default: "",
        displayOptions: { show: { resource: ['organization'], operation: ['create'] } },
        description: 'Name value',
    },
    // ── update ──
    {
        displayName: 'Id',
        name: 'id',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['organization'], operation: ['update'] } },
        description: 'Id value',
    },
    {
        displayName: 'Update Fields',
        name: 'updateFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['organization'], operation: ['update'] } },
        options: [
            { displayName: 'Color', name: 'color', type: 'string', default: "", description: 'Color value' },
            { displayName: 'Name', name: 'name', type: 'string', default: "", description: 'Name value' },
        ],
    },
    // ── delete ──
    {
        displayName: 'BranchId',
        name: 'branchId',
        type: 'number',
        required: true,
        default: 0,
        displayOptions: { show: { resource: ['organization'], operation: ['delete'] } },
        description: 'BranchId value',
    },
    // ── branch ──
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['organization'], operation: ['branch'] } },
        options: [
            { displayName: 'Address', name: 'address', type: 'json', default: "", description: 'Address value' },
            { displayName: 'Name', name: 'name', type: 'string', default: "", description: 'Name value' },
        ],
    },
    // ── inviteUser ──
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['organization'], operation: ['inviteUser'] } },
        options: [
            { displayName: 'Address', name: 'address', type: 'json', default: "", description: 'Address value' },
            { displayName: 'Email', name: 'email', type: 'string', default: "", description: 'Email value' },
            { displayName: 'EmailRepeat', name: 'emailRepeat', type: 'string', default: "", description: 'EmailRepeat value' },
            { displayName: 'FirstName', name: 'firstName', type: 'string', default: "", description: 'FirstName value' },
            { displayName: 'LastName', name: 'lastName', type: 'string', default: "", description: 'LastName value' },
            { displayName: 'LicenseId', name: 'licenseId', type: 'number', default: 0, description: 'LicenseId value' },
            { displayName: 'RoleId', name: 'roleId', type: 'number', default: 0, description: 'RoleId value' },
        ],
    },
    // ── updateHeadquarters ──
    {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { resource: ['organization'], operation: ['updateHeadquarters'] } },
        options: [
            { displayName: 'City', name: 'city', type: 'string', default: "", description: 'City value' },
            { displayName: 'Country', name: 'country', type: 'string', default: "", description: 'Country value' },
            { displayName: 'Extra', name: 'extra', type: 'string', default: "", description: 'Extra value' },
            { displayName: 'State', name: 'state', type: 'string', default: "", description: 'State value' },
            { displayName: 'StateCode', name: 'stateCode', type: 'string', default: "", description: 'StateCode value' },
            { displayName: 'Street', name: 'street', type: 'string', default: "", description: 'Street value' },
            { displayName: 'StreetNumber', name: 'streetNumber', type: 'string', default: "", description: 'StreetNumber value' },
            { displayName: 'Zip', name: 'zip', type: 'string', default: "", description: 'Zip value' },
        ],
    },
    // ── uploadLogo ──
];
