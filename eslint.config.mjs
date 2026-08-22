import { config } from '@n8n/node-cli/eslint';

export default [
	// build-time generators (Node scripts, never shipped in dist/)
	{ ignores: ['scripts/**'] },
	...config,
];
