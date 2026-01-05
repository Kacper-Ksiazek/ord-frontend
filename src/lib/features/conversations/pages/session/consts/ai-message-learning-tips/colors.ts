import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import type { CardThemeColors } from '../theme.types';

const sharedColors: CardThemeColors = {
	twColor: 'blue',
	bg: 'bg-blue-50/50 dark:bg-blue-900/10',
	border: 'border-blue-200 dark:border-blue-800',
	hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
	active: 'bg-blue-100 dark:bg-blue-900/30',
	cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
	cardBorder: 'border-blue-200 dark:border-blue-800',
	text: 'text-blue-500 dark:text-blue-400'
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
