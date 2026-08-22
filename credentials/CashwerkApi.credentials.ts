import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class CashwerkApi implements ICredentialType {
	name = 'cashwerkApi';
	displayName = 'Cashwerk API';
	documentationUrl = 'https://docs.cashwerk.io/api';
	icon: Icon = {
		light: 'file:../nodes/Cashwerk/cashwerk.svg',
		dark: 'file:../nodes/Cashwerk/cashwerk.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your cashwerk API key (starts with cw_live_ or cw_test_)',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			default: 'production',
			options: [
				{
					name: 'Custom',
					value: 'custom',
					description: 'Enter a custom base URL',
				},
				{
					name: 'Local (Docker)',
					value: 'docker',
					description: 'host.docker.internal:3000 – use when n8n runs in Docker',
				},
				{
					name: 'Local Development',
					value: 'local',
					description: 'localhost:3000 – use when n8n runs natively (npx n8n)',
				},
				{
					name: 'Production (Live)',
					value: 'production',
					description: 'production.cashwerk.io',
				},
				{
					name: 'Staging (Sandbox)',
					value: 'staging',
					description: 'cloud-staging.cashwerk.io – test environment',
				},
			],
		},
		{
			displayName: 'Custom Base URL',
			name: 'customBaseUrl',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: { environment: ['custom'] },
			},
			placeholder: 'https://my-cashwerk.example.com',
			description: 'Full base URL including protocol (for self-hosted cashwerk instances)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{$credentials.environment === "custom" ? $credentials.customBaseUrl : ' +
				'($credentials.environment === "local" ? "http://localhost:3000" : ' +
				'($credentials.environment === "docker" ? "http://host.docker.internal:3000" : ' +
				'($credentials.environment === "staging" ? "https://cloud-staging.cashwerk.io" : ' +
				'"https://production.cashwerk.io")))}}',
			url: '/api/v1/api-platform/me',
			method: 'GET',
		},
	};
}
