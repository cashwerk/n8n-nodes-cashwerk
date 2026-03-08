/**
 * cashwerk n8n node constants.
 *
 * Centralized API base URLs for all environments.
 * The active URL is determined by the "Environment" field in the credential.
 */
export const CASHWERK_URLS = {
    production: 'https://production.cashwerk.io',
    staging: 'https://cloud-staging.cashwerk.io',
    local: 'http://localhost:3000',
    docker: 'http://host.docker.internal:3000',
} as const;

export const CASHWERK_API_PREFIX = '/api/v1';
