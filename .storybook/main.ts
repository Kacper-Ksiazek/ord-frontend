import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
	framework: {
		name: '@storybook/sveltekit',
		options: {}
	},
	stories: ['../src/**/*.stories.svelte'],
	addons: [
		'@storybook/addon-svelte-csf',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest'
	]
};

export default config;
