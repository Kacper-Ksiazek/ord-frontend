import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

/**
 * Returns subtle background color classes for hover state based on feedback criteria
 */
export function getHoverBackgroundColor(criteria: MessageFeedbackCriteria): string {
	const colorMap: Record<MessageFeedbackCriteria, string> = {
		MISTAKES: 'hover:bg-red-50 dark:hover:bg-red-900/20',
		STRENGTHS: 'hover:bg-green-50 dark:hover:bg-green-900/20',
		VOCABULARY_ENRICHMENT: 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
	};

	return colorMap[criteria];
}

/**
 * Returns more prominent background color classes for active/open state based on feedback criteria
 */
export function getActiveBackgroundColor(criteria: MessageFeedbackCriteria): string {
	const colorMap: Record<MessageFeedbackCriteria, string> = {
		MISTAKES: 'bg-red-100 dark:bg-red-900/30',
		STRENGTHS: 'bg-green-100 dark:bg-green-900/30',
		VOCABULARY_ENRICHMENT: 'bg-blue-100 dark:bg-blue-900/30'
	};

	return colorMap[criteria];
}

/**
 * Returns subtle border color classes for cards based on feedback criteria
 */
export function getCardBorderColor(criteria: MessageFeedbackCriteria): string {
	const colorMap: Record<MessageFeedbackCriteria, string> = {
		MISTAKES: 'border-red-200 dark:border-red-800',
		STRENGTHS: 'border-green-200 dark:border-green-800',
		VOCABULARY_ENRICHMENT: 'border-blue-200 dark:border-blue-800'
	};

	return colorMap[criteria];
}

/**
 * Returns subtle background color classes for cards based on feedback criteria
 */
export function getCardBackgroundColor(criteria: MessageFeedbackCriteria): string {
	const colorMap: Record<MessageFeedbackCriteria, string> = {
		MISTAKES: 'bg-red-50/50 dark:bg-red-900/10',
		STRENGTHS: 'bg-green-50/50 dark:bg-green-900/10',
		VOCABULARY_ENRICHMENT: 'bg-blue-50/50 dark:bg-blue-900/10'
	};

	return colorMap[criteria];
}
