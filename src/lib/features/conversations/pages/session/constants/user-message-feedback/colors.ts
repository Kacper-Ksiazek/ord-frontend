import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import {
	getTailwindColorTheme,
	type TailwindColorTheme
} from '$lib/utils/theme/get-tailwind-colors';

const USER_MESSAGE_FEEDBACK_COLORS_MAP: Record<MessageFeedbackCriteria, TailwindColor> = {
	MISTAKES: 'red',
	STRENGTHS: 'green',
	SUGGESTIONS: 'blue'
} as const;

const USER_MESSAGE_FEEDBACK_THEMES_MAP: Record<MessageFeedbackCriteria, TailwindColorTheme> = {
	MISTAKES: getTailwindColorTheme('red'),
	STRENGTHS: getTailwindColorTheme('green'),
	SUGGESTIONS: getTailwindColorTheme('blue')
} as const;

export function getUserMessageFeedbackColors(
	criteria: MessageFeedbackCriteria
): TailwindColorTheme {
	return USER_MESSAGE_FEEDBACK_THEMES_MAP[criteria];
}

export function getUserMessageFeedbackColorName(criteria: MessageFeedbackCriteria): TailwindColor {
	return USER_MESSAGE_FEEDBACK_COLORS_MAP[criteria];
}
