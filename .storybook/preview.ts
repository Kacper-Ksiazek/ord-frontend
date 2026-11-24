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
				canvas: { name: 'Canvas', value: '#FAFAFA' },
				canvasDark: { name: 'Canvas dark', value: '#0D0D0D' }
			}
		}
	}
};

export default preview;
