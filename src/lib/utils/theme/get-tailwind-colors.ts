import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';

export interface TailwindColorTheme {
	/** Base Tailwind color name used for theme identification */
	twColor: TabsSupportedTailwindColor;
	/** Resting surface for AiAdviceBase cards (before hover) */
	adviceCardBg: string;
	adviceCardBorder: string;
	/** Stronger surface when hovering an expandable AiAdviceBase card */
	adviceCardHover: string;
	/** Icons inside AiAdviceBase — muted until the card is hovered (`group/advice-card`) */
	adviceIconColor: string;
	/** Border color classes for larger chrome (e.g. highlight popovers) */
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
		adviceCardBg: 'bg-red-50/35 dark:bg-red-900/10',
		adviceCardBorder: 'border-red-100 dark:border-red-800',
		adviceCardHover:
			'hover:bg-red-50/90 dark:hover:bg-red-900/25 hover:border-red-300 dark:hover:border-red-700',
		adviceIconColor:
			'text-red-600/50 dark:text-red-400/50 group-hover/advice-card:text-red-600 dark:group-hover/advice-card:text-red-400',
		cardBorder: 'border-red-200 dark:border-red-800',
		text: 'text-red-500 dark:text-red-400',
		iconColor: 'text-red-500 dark:text-red-400',
		highlightedText:
			'bg-red-100/70 text-red-800 hover:bg-red-300/70 dark:bg-red-900/70 dark:text-red-100 dark:hover:bg-red-600',
		chipBorder: 'border-red-300 dark:border-red-700'
	},

	green: {
		twColor: 'green',
		adviceCardBg: 'bg-green-50/35 dark:bg-green-900/10',
		adviceCardBorder: 'border-green-100 dark:border-green-800',
		adviceCardHover:
			'hover:bg-green-50/90 dark:hover:bg-green-900/25 hover:border-green-300 dark:hover:border-green-700',
		adviceIconColor:
			'text-green-600/50 dark:text-green-400/50 group-hover/advice-card:text-green-600 dark:group-hover/advice-card:text-green-400',
		cardBorder: 'border-green-200 dark:border-green-800',
		text: 'text-green-500 dark:text-green-400',
		iconColor: 'text-green-500 dark:text-green-400',
		highlightedText:
			'bg-green-100/70 text-green-800 hover:bg-green-300/70 dark:bg-green-900/70 dark:text-green-100 dark:hover:bg-green-600',
		chipBorder: 'border-green-300 dark:border-green-700'
	},

	blue: {
		twColor: 'blue',
		adviceCardBg: 'bg-blue-50/35 dark:bg-blue-900/10',
		adviceCardBorder: 'border-blue-100 dark:border-blue-800',
		adviceCardHover:
			'hover:bg-blue-50/90 dark:hover:bg-blue-900/25 hover:border-blue-300 dark:hover:border-blue-700',
		adviceIconColor:
			'text-blue-600/50 dark:text-blue-400/50 group-hover/advice-card:text-blue-600 dark:group-hover/advice-card:text-blue-400',
		cardBorder: 'border-blue-200 dark:border-blue-800',
		text: 'text-blue-500 dark:text-blue-400',
		iconColor: 'text-blue-500 dark:text-blue-400',
		highlightedText:
			'bg-blue-100/70 text-blue-800 hover:bg-blue-300/70 dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600',
		chipBorder: 'border-blue-300 dark:border-blue-700'
	},

	purple: {
		twColor: 'purple',
		adviceCardBg: 'bg-purple-50/35 dark:bg-purple-900/10',
		adviceCardBorder: 'border-purple-100 dark:border-purple-800',
		adviceCardHover:
			'hover:bg-purple-50/90 dark:hover:bg-purple-900/25 hover:border-purple-300 dark:hover:border-purple-700',
		adviceIconColor:
			'text-purple-600/50 dark:text-purple-400/50 group-hover/advice-card:text-purple-600 dark:group-hover/advice-card:text-purple-400',
		cardBorder: 'border-purple-200 dark:border-purple-800',
		text: 'text-purple-500 dark:text-purple-400',
		iconColor: 'text-purple-500 dark:text-purple-400',
		highlightedText:
			'bg-purple-100/70 text-purple-800 hover:bg-purple-300/70 dark:bg-purple-900/70 dark:text-purple-100 dark:hover:bg-purple-600',
		chipBorder: 'border-purple-300 dark:border-purple-700'
	},

	orange: {
		twColor: 'orange',
		adviceCardBg: 'bg-orange-50/35 dark:bg-orange-900/10',
		adviceCardBorder: 'border-orange-100 dark:border-orange-800',
		adviceCardHover:
			'hover:bg-orange-50/90 dark:hover:bg-orange-900/25 hover:border-orange-300 dark:hover:border-orange-700',
		adviceIconColor:
			'text-orange-600/50 dark:text-orange-400/50 group-hover/advice-card:text-orange-600 dark:group-hover/advice-card:text-orange-400',
		cardBorder: 'border-orange-200 dark:border-orange-800',
		text: 'text-orange-500 dark:text-orange-400',
		iconColor: 'text-orange-500 dark:text-orange-400',
		highlightedText:
			'bg-orange-100/70 text-orange-800 hover:bg-orange-300/70 dark:bg-orange-900/70 dark:text-orange-100 dark:hover:bg-orange-600',
		chipBorder: 'border-orange-300 dark:border-orange-700'
	},

	yellow: {
		twColor: 'yellow',
		adviceCardBg: 'bg-yellow-50/35 dark:bg-yellow-900/10',
		adviceCardBorder: 'border-yellow-100 dark:border-yellow-800',
		adviceCardHover:
			'hover:bg-yellow-50/90 dark:hover:bg-yellow-900/25 hover:border-yellow-300 dark:hover:border-yellow-700',
		adviceIconColor:
			'text-yellow-600/50 dark:text-yellow-400/50 group-hover/advice-card:text-yellow-600 dark:group-hover/advice-card:text-yellow-400',
		cardBorder: 'border-yellow-200 dark:border-yellow-800',
		text: 'text-yellow-600 dark:text-yellow-400',
		iconColor: 'text-yellow-600 dark:text-yellow-400',
		highlightedText:
			'bg-yellow-100/70 text-yellow-900 hover:bg-yellow-300/70 dark:bg-yellow-900/70 dark:text-yellow-100 dark:hover:bg-yellow-600',
		chipBorder: 'border-yellow-300 dark:border-yellow-700'
	}
};

export function getTailwindColorTheme(color: TailwindColor): TailwindColorTheme {
	const theme = TailwindColorThemeMap[color];

	if (!theme) {
		throw new Error(`Tailwind color theme not found for color: ${color}`);
	}

	return theme;
}
