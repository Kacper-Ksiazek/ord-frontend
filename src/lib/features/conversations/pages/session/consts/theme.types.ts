import type { TabsSupportedTailwindColor } from '$lib/components/tabs/tabs.types';

export interface CardThemeColors {
	twColor: TabsSupportedTailwindColor;
	bg: string;
	border: string;
	hover: string;
	active: string;
	cardBg: string;
	cardBorder: string;
	text: string;
}
