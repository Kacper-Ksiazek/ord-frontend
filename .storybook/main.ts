import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  framework: {
    name: "@storybook/sveltekit",
    options: {
    }
  },
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|ts|svelte)"
  ],
  "addons": [
    {
      name: "@storybook/addon-svelte-csf",
      options: {
        legacyTemplate: true
      }
    },
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
};
export default config;