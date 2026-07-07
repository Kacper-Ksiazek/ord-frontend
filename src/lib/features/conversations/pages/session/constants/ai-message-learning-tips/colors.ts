import type { IconCardVariant } from '$lib/components/cards/icon-card/icon-card.types';
import type { LearningTipCategory } from '$conversations/types/domain/learning-tip-category';
import {
	getTailwindColorTheme,
	type TailwindColorTheme
} from '$lib/utils/theme/get-tailwind-colors';

const AI_MESSAGE_LEARNING_TIP_COLORS_MAP: Record<LearningTipCategory, IconCardVariant> = {
	GRAMMAR: 'green',
	VOCABULARY: 'blue',
	PHRASES: 'purple'
} as const;

const AI_MESSAGE_LEARNING_TIP_THEMES_MAP: Record<LearningTipCategory, TailwindColorTheme> = {
	GRAMMAR: getTailwindColorTheme('green'),
	VOCABULARY: getTailwindColorTheme('blue'),
	PHRASES: getTailwindColorTheme('purple')
} as const;

export function getAiMessageLearningTipColors(category: LearningTipCategory): TailwindColorTheme {
	return AI_MESSAGE_LEARNING_TIP_THEMES_MAP[category];
}

export function getAiMessageLearningTipColorName(category: LearningTipCategory): IconCardVariant {
	return AI_MESSAGE_LEARNING_TIP_COLORS_MAP[category];
}
