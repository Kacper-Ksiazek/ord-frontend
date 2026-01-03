import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

const COLORS_MAP = {
	MISTAKES: {
		bg: 'bg-red-50/50 dark:bg-red-900/10',
		border: 'border-red-200 dark:border-red-800',
		hover: 'hover:bg-red-50 dark:hover:bg-red-900/20',
		active: 'bg-red-100 dark:bg-red-900/30',
		cardBg: 'bg-red-50/50 dark:bg-red-900/10',
		cardBorder: 'border-red-200 dark:border-red-800'
	},
	STRENGTHS: {
		bg: 'bg-green-50/50 dark:bg-green-900/10',
		border: 'border-green-200 dark:border-green-800',
		hover: 'hover:bg-green-50 dark:hover:bg-green-900/20',
		active: 'bg-green-100 dark:bg-green-900/30',
		cardBg: 'bg-green-50/50 dark:bg-green-900/10',
		cardBorder: 'border-green-200 dark:border-green-800'
	},
	SUGGESTIONS: {
		bg: 'bg-blue-50/50 dark:bg-blue-900/10',
		border: 'border-blue-200 dark:border-blue-800',
		hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20',
		active: 'bg-blue-100 dark:bg-blue-900/30',
		cardBg: 'bg-blue-50/50 dark:bg-blue-900/10',
		cardBorder: 'border-blue-200 dark:border-blue-800'
	}
};

/**
 * Returns subtle background color classes for hover state based on feedback criteria
 */
export function getHoverBackgroundColor(criteria: MessageFeedbackCriteria): string {
	return COLORS_MAP[criteria].hover;
}

/**
 * Returns more prominent background color classes for active/open state based on feedback criteria
 */
export function getActiveBackgroundColor(criteria: MessageFeedbackCriteria): string {
	return COLORS_MAP[criteria].active;
}

/**
 * Returns subtle border color classes for cards based on feedback criteria
 */
export function getCardBorderColor(criteria: MessageFeedbackCriteria): string {
	return COLORS_MAP[criteria].cardBorder;
}

/**
 * Returns subtle background color classes for cards based on feedback criteria
 */
export function getCardBackgroundColor(criteria: MessageFeedbackCriteria): string {
	return COLORS_MAP[criteria].cardBg;
}

const severityMap: Record<ConversationMessageMistakeSeverity, number> = {
	MINOR: 1,
	MODERATE: 2,
	CRITICAL: 3
};

export function getSeverityLevel(severity: ConversationMessageMistakeSeverity): number {
	return severityMap[severity];
}
