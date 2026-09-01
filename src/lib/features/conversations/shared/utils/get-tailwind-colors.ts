import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';

export interface TailwindColorTheme {
	/** Base Tailwind color name used for theme identification */
	twColor: TabsSupportedTailwindColor;
	/** Resting surface for AiAdviceBase cards (before hover) */
	adviceCardBg: string;
	adviceCardBorder: string;
	/** Stronger surface when hovering an expandable AiAdviceBase card */
	adviceCardHover: string;
	/** Icons inside AiAdviceBase */
	adviceIconColor: string;
	/** Subtle tinted chip behind category-type icons (browse-all mode) */
	iconChipBg: string;
	/** Border color classes for larger chrome (e.g. highlight popovers) */
	cardBorder: string;
	/** Text color classes for standard text content */
	text: string;
	/** Color classes for icon elements */
	iconColor: string;
	/** Background and text color classes for highlighted/selected text elements */
	highlightedText: string;
	/** Small swatch matching the highlight color (e.g. a dot after a phrase) */
	highlightSwatch: string;
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
		adviceCardBg: 'bg-surface',
		adviceCardBorder: 'border-line',
		adviceCardHover: 'hover:bg-accent-soft',
		adviceIconColor: 'text-ink-muted',
		iconChipBg: 'bg-red-100/80 dark:bg-red-950/35',
		cardBorder: 'border-line',
		text: 'text-red-700 dark:text-red-400',
		iconColor: 'text-red-600 dark:text-red-400',
		highlightedText:
			'bg-red-50 text-ink hover:bg-red-100/80 dark:bg-red-950/35 dark:hover:bg-red-900/45',
		highlightSwatch: 'bg-red-200 dark:bg-red-800',
		chipBorder: 'border-red-200/70 dark:border-red-800/50'
	},

	green: {
		twColor: 'green',
		adviceCardBg: 'bg-surface',
		adviceCardBorder: 'border-line',
		adviceCardHover: 'hover:bg-accent-soft',
		adviceIconColor: 'text-ink-muted',
		iconChipBg: 'bg-emerald-100/80 dark:bg-emerald-950/35',
		cardBorder: 'border-line',
		text: 'text-emerald-700 dark:text-emerald-400',
		iconColor: 'text-emerald-600 dark:text-emerald-400',
		highlightedText:
			'bg-emerald-50 text-ink hover:bg-emerald-100/80 dark:bg-emerald-950/35 dark:hover:bg-emerald-900/45',
		highlightSwatch: 'bg-emerald-200 dark:bg-emerald-800',
		chipBorder: 'border-emerald-200/70 dark:border-emerald-800/50'
	},

	blue: {
		twColor: 'blue',
		adviceCardBg: 'bg-surface',
		adviceCardBorder: 'border-line',
		adviceCardHover: 'hover:bg-accent-soft',
		adviceIconColor: 'text-ink-muted',
		iconChipBg: 'bg-blue-100/80 dark:bg-blue-950/35',
		cardBorder: 'border-line',
		text: 'text-blue-700 dark:text-blue-400',
		iconColor: 'text-blue-600 dark:text-blue-400',
		highlightedText:
			'bg-blue-50 text-ink hover:bg-blue-100/80 dark:bg-blue-950/35 dark:hover:bg-blue-900/45',
		highlightSwatch: 'bg-blue-200 dark:bg-blue-800',
		chipBorder: 'border-blue-200/70 dark:border-blue-800/50'
	},

	purple: {
		twColor: 'purple',
		adviceCardBg: 'bg-surface',
		adviceCardBorder: 'border-line',
		adviceCardHover: 'hover:bg-accent-soft',
		adviceIconColor: 'text-ink-muted',
		iconChipBg: 'bg-violet-100/80 dark:bg-violet-950/35',
		cardBorder: 'border-line',
		text: 'text-violet-700 dark:text-violet-400',
		iconColor: 'text-violet-600 dark:text-violet-400',
		highlightedText:
			'bg-violet-50 text-ink hover:bg-violet-100/80 dark:bg-violet-950/35 dark:hover:bg-violet-900/45',
		highlightSwatch: 'bg-violet-200 dark:bg-violet-800',
		chipBorder: 'border-violet-200/70 dark:border-violet-800/50'
	}
};

export function getTailwindColorTheme(color: TailwindColor): TailwindColorTheme {
	const theme = TailwindColorThemeMap[color];

	if (!theme) {
		throw new Error(`Tailwind color theme not found for color: ${color}`);
	}

	return theme;
}
