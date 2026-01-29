import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import { cn } from 'flowbite-svelte';
import type { CardThemeColors } from '../theme.types';

export const AI_MESSAGE_LEARNING_TIP_COLORS_MAP: Record<LearningTipCategory, CardThemeColors> = {
	GRAMMAR: {
		twColor: 'green',
		cardBg: 'bg-green-50/50 dark:bg-green-900/10',
		cardBorder: 'border-green-200 dark:border-green-800',
		text: 'text-green-500 dark:text-green-400',
		iconColor: 'text-green-600 dark:text-green-400',
		chipBorder: 'border-green-300 dark:border-green-700',
		highlightedText: cn(
			'bg-green-200/50 text-green-900 hover:bg-green-300/70',
			'dark:bg-green-900/70 dark:text-green-100 dark:hover:bg-green-600'
		)
	},
	VOCABULARY: {
		twColor: 'blue',
		cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
		cardBorder: 'border-blue-200 dark:border-blue-800',
		text: 'text-blue-500 dark:text-blue-400',
		iconColor: 'text-blue-600 dark:text-blue-400',
		chipBorder: 'border-blue-300 dark:border-blue-700',
		highlightedText: cn(
			'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70',
			'dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600'
		)
	},
	PHRASES: {
		twColor: 'purple',
		cardBg: 'bg-purple-50/50 dark:bg-purple-900/10',
		cardBorder: 'border-purple-200 dark:border-purple-800',
		text: 'text-purple-500 dark:text-purple-400',
		iconColor: 'text-purple-600 dark:text-purple-400',
		chipBorder: 'border-purple-300 dark:border-purple-700',
		highlightedText: cn(
			'bg-purple-200/50 text-purple-900 hover:bg-purple-300/70',
			'dark:bg-purple-900/70 dark:text-purple-100 dark:hover:bg-purple-600'
		)
	}
} as const;

export function getAiMessageLearningTipColors(category: LearningTipCategory): CardThemeColors {
	return AI_MESSAGE_LEARNING_TIP_COLORS_MAP[category];
}
