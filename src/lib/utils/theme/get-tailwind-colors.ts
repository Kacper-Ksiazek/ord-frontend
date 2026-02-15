import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';

export interface TailwindColorTheme {
	/** Base Tailwind color name used for theme identification */
	twColor: TabsSupportedTailwindColor;
	/** Background color classes for card components */
	cardBg: string;
	/** Border color classes for card components */
	cardBorder: string;
	/** Text color classes for standard text content */
	text: string;
	/** Color classes for icon elements */
	iconColor: string;
	/** Background and text color classes for highlighted/selected text elements */
	highlightedText: string;
	/** Border color classes for chip/badge components */
	chipBorder: string;
	/** Optional hover state color classes */
	hover?: string;
	/** Optional active state color classes */
	active?: string;
}

const TailwindColorThemeMap: Partial<Record<TailwindColor, TailwindColorTheme>> = {
	red: {
		twColor: 'red',
		cardBg: 'bg-red-50/50 dark:bg-red-900/10',
		cardBorder: 'border-red-200 dark:border-red-800',
		text: 'text-red-500 dark:text-red-400',
		iconColor: 'text-red-500 dark:text-red-400',
		highlightedText:
			'bg-red-200/50 text-red-900 hover:bg-red-300/70 dark:bg-red-900/70 dark:text-red-100 dark:hover:bg-red-600',
		chipBorder: 'border-red-300 dark:border-red-700'
	},

	green: {
		twColor: 'green',
		cardBg: 'bg-green-50/50 dark:bg-green-900/10',
		cardBorder: 'border-green-200 dark:border-green-800',
		text: 'text-green-500 dark:text-green-400',
		iconColor: 'text-green-500 dark:text-green-400',
		highlightedText:
			'bg-green-200/50 text-green-900 hover:bg-green-300/70 dark:bg-green-900/70 dark:text-green-100 dark:hover:bg-green-600',
		chipBorder: 'border-green-300 dark:border-green-700'
	},

	blue: {
		twColor: 'blue',
		cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
		cardBorder: 'border-blue-200 dark:border-blue-800',
		text: 'text-blue-500 dark:text-blue-400',
		iconColor: 'text-blue-500 dark:text-blue-400',
		highlightedText:
			'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70 dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600',
		chipBorder: 'border-blue-300 dark:border-blue-700'
	},

	purple: {
		twColor: 'purple',
		cardBg: 'bg-purple-50/50 dark:bg-purple-900/10',
		cardBorder: 'border-purple-200 dark:border-purple-800',
		text: 'text-purple-500 dark:text-purple-400',
		iconColor: 'text-purple-500 dark:text-purple-400',
		highlightedText:
			'bg-purple-200/50 text-purple-900 hover:bg-purple-300/70 dark:bg-purple-900/70 dark:text-purple-100 dark:hover:bg-purple-600',
		chipBorder: 'border-purple-300 dark:border-purple-700'
	}
};

export function getTailwindColorTheme(color: TailwindColor): TailwindColorTheme {
	const theme = TailwindColorThemeMap[color];

	if (!theme) {
		throw new Error(`Tailwind color theme not found for color: ${color}`);
	}

	return theme;
}
