import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import { cn } from 'flowbite-svelte';
import type { CardThemeColors } from '../theme.types';

const sharedColors: CardThemeColors = {
	twColor: 'blue',
	cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
	cardBorder: 'border-blue-200 dark:border-blue-800',
	text: 'text-blue-500 dark:text-blue-400',
	iconColor: 'text-blue-600 dark:text-blue-400',
	highlightedText: cn(
		'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70',
		'dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600'
	)
};

export const AI_MESSAGE_LEARNING_TIP_COLORS_MAP: Record<LearningTipCategory, CardThemeColors> = {
	GRAMMAR: {
		...sharedColors
	},
	VOCABULARY: {
		...sharedColors
	},
	IDIOMS: {
		...sharedColors
	}
} as const;

export function getAiMessageLearningTipColors(category: LearningTipCategory): CardThemeColors {
	return AI_MESSAGE_LEARNING_TIP_COLORS_MAP[category];
}
