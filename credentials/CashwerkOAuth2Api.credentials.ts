import { ICredentialType, INodeProperties, Icon } from 'n8n-workflow';

// Server-to-server URL (used by n8n backend for token exchange)
const SERVER_URL_EXPR =
	'={{$self.environment === "custom" ? $self.customBaseUrl : ' +
	'($self.environment === "local" ? "http://localhost:3000" : ' +
	'($self.environment === "docker" ? "http://host.docker.internal:3000" : ' +
	'($self.environment === "staging" ? "https://cloud-staging.cashwerk.io" : ' +
	'"https://production.cashwerk.io")))}}';

// Browser URL (opened in user's browser for OAuth authorization -- Docker maps to localhost since the browser runs on the host)
const BROWSER_URL_EXPR =
	'={{$self.environment === "custom" ? $self.customBaseUrl : ' +
	'($self.environment === "local" ? "http://localhost:3000" : ' +
	'($self.environment === "docker" ? "http://localhost:3000" : ' +
	'($self.environment === "staging" ? "https://cloud-staging.cashwerk.io" : ' +
	'"https://production.cashwerk.io")))}}';

export class CashwerkOAuth2Api implements ICredentialType {
	name = 'cashwerkOAuth2Api';
	displayName = 'Cashwerk OAuth2 API';
	documentationUrl = 'https://docs.cashwerk.io/api/oauth2';
	icon: Icon = {
		light: 'file:../nodes/Cashwerk/cashwerk.svg',
		dark: 'file:../nodes/Cashwerk/cashwerk.dark.svg',
	};
	extends = ['oAuth2Api'];

	properties: INodeProperties[] = [
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
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: `${BROWSER_URL_EXPR}/api/v1/api-platform/oauth/authorize`,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: `${SERVER_URL_EXPR}/api/v1/api-platform/oauth/token`,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: '',
			description:
				'Space-separated list of scopes (e.g. contacts:read invoices:read). Leave empty for all scopes granted to the OAuth application.',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
