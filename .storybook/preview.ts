import type { Preview } from '@storybook/sveltekit';
import TooltipProviderDecorator from './tooltip-provider-decorator.svelte';
import '../src/app.css';

const preview: Preview = {
	decorators: [() => TooltipProviderDecorator as never],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		backgrounds: {
			options: {
				canvas: { name: 'Canvas', value: '#F6F4EF' },
				canvasDark: { name: 'Canvas dark', value: '#161513' }
			}
		}
	}
};

export default preview;
