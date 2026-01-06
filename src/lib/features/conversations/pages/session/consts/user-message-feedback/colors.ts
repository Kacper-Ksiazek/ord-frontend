import { cn } from 'flowbite-svelte';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type { CardThemeColors } from '../theme.types';

export const USER_MESSAGE_FEEDBACK_COLORS_MAP: Record<MessageFeedbackCriteria, CardThemeColors> = {
	MISTAKES: {
		twColor: 'red',
		cardBg: 'bg-red-50/50 dark:bg-red-900/10',
		cardBorder: 'border-red-200 dark:border-red-800',
		text: 'text-red-500 dark:text-red-400',
		iconColor: 'text-red-500 dark:text-red-400',
		highlightedText: cn(
			'bg-red-200/50 text-red-900 hover:bg-red-300/70',
			'dark:bg-red-900/70 dark:text-red-100 dark:hover:bg-red-600'
		)
	},

	STRENGTHS: {
		twColor: 'green',
		cardBg: 'bg-green-50/50 dark:bg-green-900/10',
		cardBorder: 'border-green-200 dark:border-green-800',
		text: 'text-green-500 dark:text-green-400',
		iconColor: 'text-green-600 dark:text-green-400',
		highlightedText: cn(
			'bg-green-200/50 text-green-900 hover:bg-green-300/70',
			'dark:bg-green-900/70 dark:text-green-100 dark:hover:bg-green-600'
		)
	},

	SUGGESTIONS: {
		twColor: 'blue',
		cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
		cardBorder: 'border-blue-200 dark:border-blue-800',
		text: 'text-blue-500 dark:text-blue-400',
		iconColor: 'text-blue-600 dark:text-blue-400',
		highlightedText: cn(
			'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70',
			'dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600'
		)
	}
} as const;

export function getUserMessageFeedbackColors(criteria: MessageFeedbackCriteria): CardThemeColors {
	return USER_MESSAGE_FEEDBACK_COLORS_MAP[criteria];
}
