import type { IconCardVariant } from '$lib/components/data-display/icon-card/icon-card.types';
import type { MessageAnalysisCriteria } from '$lib/types/conversation/domain/message-analysis-criteria';
import {
	getTailwindColorTheme,
	type TailwindColorTheme
} from '$lib/utils/theme/get-tailwind-colors';

const USER_MESSAGE_ANALYSIS_COLORS_MAP: Record<MessageAnalysisCriteria, IconCardVariant> = {
	MISTAKES: 'red',
	STRENGTHS: 'green',
	SUGGESTIONS: 'blue'
} as const;

const USER_MESSAGE_ANALYSIS_THEMES_MAP: Record<MessageAnalysisCriteria, TailwindColorTheme> = {
	MISTAKES: getTailwindColorTheme('red'),
	STRENGTHS: getTailwindColorTheme('green'),
	SUGGESTIONS: getTailwindColorTheme('blue')
} as const;

export function getUserMessageAnalysisColors(
	criteria: MessageAnalysisCriteria
): TailwindColorTheme {
	return USER_MESSAGE_ANALYSIS_THEMES_MAP[criteria];
}

export function getUserMessageAnalysisColorName(
	criteria: MessageAnalysisCriteria
): IconCardVariant {
	return USER_MESSAGE_ANALYSIS_COLORS_MAP[criteria];
}
