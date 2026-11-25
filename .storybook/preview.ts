import type { Decorator, Preview } from '@storybook/sveltekit';
import { type Locale, locales, setLocale } from '$lib/paraglide/runtime';
import type { Theme } from '$lib/stores/theme.svelte';
import AppGlobalsDecorator from './decorators/app-globals-decorator.svelte';
import '../src/app.css';

const LOCALE_TITLES: Record<Locale, string> = {
	en: 'English',
	pl: 'Polski',
	de: 'Deutsch'
};

/** Applies the toolbar globals (theme, locale) before the story renders. */
const withAppGlobals: Decorator = (_story, { globals }) => {
	const theme = globals.theme as Theme;
	const locale = globals.locale as Locale;

	// Paraglide's locale is plain module state, so it can be set synchronously before render.
	setLocale(locale, { reload: false });

	return { Component: AppGlobalsDecorator, props: { theme, locale } };
};

const preview: Preview = {
	globalTypes: {
		theme: {
			description: 'Color theme',
			toolbar: {
				title: 'Theme',
				icon: 'mirror',
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' }
				],
				dynamicTitle: true
			}
		},
		locale: {
			description: 'UI language',
			toolbar: {
				title: 'Locale',
				icon: 'globe',
				items: locales.map((locale) => ({ value: locale, title: LOCALE_TITLES[locale] })),
				dynamicTitle: true
			}
		}
	},
	initialGlobals: {
		theme: 'light',
		locale: 'en'
	},
	decorators: [withAppGlobals],
	parameters: {
		layout: 'centered',
		// The canvas follows the app's own `bg-canvas` token through the theme global.
		backgrounds: { disable: true },
		a11y: { test: 'error' },
		controls: {
			expanded: true,
			sort: 'requiredFirst',
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
