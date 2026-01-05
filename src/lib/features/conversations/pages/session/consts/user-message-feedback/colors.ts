import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type { CardThemeColors } from '../theme.types';

export const USER_MESSAGE_FEEDBACK_COLORS_MAP: Record<MessageFeedbackCriteria, CardThemeColors> = {
	MISTAKES: {
		twColor: 'red',
		bg: 'bg-red-50/50 dark:bg-red-900/10',
		border: 'border-red-200 dark:border-red-800',
		hover: 'hover:bg-red-50 dark:hover:bg-red-900/20',
		active: 'bg-red-100 dark:bg-red-900/30',
		cardBg: 'bg-red-50/50 dark:bg-red-900/10',
		cardBorder: 'border-red-200 dark:border-red-800',
		text: 'text-red-500 dark:text-red-400'
	},
	STRENGTHS: {
		twColor: 'green',
		bg: 'bg-green-50/50 dark:bg-green-900/10',
		border: 'border-green-200 dark:border-green-800',
		hover: 'hover:bg-green-50 dark:hover:bg-green-900/20',
		active: 'bg-green-100 dark:bg-green-900/30',
		cardBg: 'bg-green-50/50 dark:bg-green-900/10',
		cardBorder: 'border-green-200 dark:border-green-800',
		text: 'text-green-500 dark:text-green-400'
	},
	SUGGESTIONS: {
		twColor: 'blue',
		bg: 'bg-blue-50/50 dark:bg-blue-900/10',
		border: 'border-blue-200 dark:border-blue-800',
		hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
		active: 'bg-blue-100 dark:bg-blue-900/30',
		cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
		cardBorder: 'border-blue-200 dark:border-blue-800',
		text: 'text-blue-500 dark:text-blue-400'
	}
} as const;

export function getUserMessageFeedbackColors(criteria: MessageFeedbackCriteria): CardThemeColors {
	return USER_MESSAGE_FEEDBACK_COLORS_MAP[criteria];
}
