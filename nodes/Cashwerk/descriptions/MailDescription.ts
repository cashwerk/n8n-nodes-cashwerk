import { INodeProperties } from 'n8n-workflow';

const show = (operation: string[]) => ({ show: { resource: ['mail'], operation } });

/** Shared by Send and Update: everything after recipients, subject and message. */
const envelopeOptions: INodeProperties[] = [
	{
		displayName: 'Bcc',
		name: 'bcc',
		type: 'string',
		default: '',
		description: 'Comma-separated BCC addresses',
	},
	{
		displayName: 'Cc',
		name: 'cc',
		type: 'string',
		default: '',
		description: 'Comma-separated CC addresses',
	},
	{
		displayName: 'Copy to Myself',
		name: 'copyToSelf',
		type: 'boolean',
		default: false,
		description: 'Whether to send a BCC copy to the sender',
	},
	{
		displayName: 'Drive File IDs',
		name: 'driveFileIds',
		type: 'string',
		default: '',
		description:
			'Comma-separated IDs of Drive files to attach. Through the API files travel only as attachments: a mail whose files are too large to attach is refused.',
	},
	{
		displayName: 'Send At',
		name: 'scheduledAt',
		type: 'dateTime',
		default: '',
		description: 'When to send the mail. Empty sends it right away.',
	},
];

export const mailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['mail'] } },
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				action: 'Cancel a scheduled mail',
				description: 'Cancel a scheduled mail of your own; it stays in the history as cancelled',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a mail',
				description: 'Get one mail with its status, recipients and files',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				action: 'Get the mails of a company or contact',
				description: 'The mails of a company or contact, scheduled ones first',
			},
			{
				name: 'Get Limits',
				value: 'getLimits',
				action: 'Get the mail limits',
				description: 'The limits every mail is held to: recipients, files and sizes',
			},
			{
				name: 'Resend',
				value: 'resend',
				action: 'Send an undelivered mail again',
				description: 'Send an undelivered mail once more',
			},
			{
				name: 'Send',
				value: 'send',
				action: 'Send a mail',
				description:
					'Send or schedule a personal mail from your own connected mailbox, on a company or contact or to any address. Not for newsletters: recipients per user and day are limited.',
			},
			{
				name: 'Send Now',
				value: 'sendNow',
				action: 'Send a scheduled mail now',
				description: 'Send a scheduled mail of your own right away',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a scheduled mail',
				description: 'Change a scheduled mail of your own; an empty send time sends it now',
			},
		],
		default: 'send',
	},
];

export const mailFields: INodeProperties[] = [
	{
		displayName: 'Mail ID',
		name: 'mailId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: show(['get', 'cancel', 'sendNow', 'resend', 'update']),
		description: 'ID of the mail',
	},
	{
		displayName: 'Mail Connection Name or ID',
		name: 'connectionId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: { loadOptionsMethod: 'getMailConnections' },
		displayOptions: show(['send']),
		description:
			'Your own mailbox to send from; the cashwerk system sender is refused. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['send', 'update']),
		description: 'Comma-separated recipient addresses',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		displayOptions: show(['send', 'update']),
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 6 },
		default: '',
		displayOptions: show(['send', 'update']),
		description: 'Message as HTML; formatting only, links and images are removed',
	},
	{
		displayName: 'Record Type',
		name: 'recordType',
		type: 'options',
		required: true,
		default: 'company',
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Contact', value: 'contact' },
		],
		displayOptions: show(['getHistory']),
	},
	{
		displayName: 'Record ID',
		name: 'recordId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: show(['getHistory']),
		description: 'ID of the company or contact',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show(['send']),
		options: [
			...envelopeOptions,
			{
				displayName: 'Record Type',
				name: 'recordType',
				type: 'options',
				default: 'company',
				options: [
					{ name: 'Company', value: 'company' },
					{ name: 'Contact', value: 'contact' },
				],
				description: 'File the mail under this kind of record; set together with Record ID',
			},
			{
				displayName: 'Record ID',
				name: 'recordId',
				type: 'number',
				default: 0,
				description: 'ID of the company or contact the mail is filed under',
			},
			{
				displayName: 'Reference Type',
				name: 'referenceType',
				type: 'options',
				default: 'project',
				options: [
					{ name: 'Deal', value: 'deal' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Offer', value: 'offer' },
					{ name: 'Project', value: 'project' },
				],
				description: 'What the mail is about; set together with Reference ID',
			},
			{
				displayName: 'Reference ID',
				name: 'referenceId',
				type: 'number',
				default: 0,
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: show(['update']),
		options: envelopeOptions,
	},
];
