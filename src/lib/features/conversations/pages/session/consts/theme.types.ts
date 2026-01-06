import type { TabsSupportedTailwindColor } from '$lib/components/tabs/tabs.types';

export interface CardThemeColors {
	twColor: TabsSupportedTailwindColor;
	cardBg: string;
	cardBorder: string;
	text: string;
	iconColor: string;
	highlightedText: string;
}
