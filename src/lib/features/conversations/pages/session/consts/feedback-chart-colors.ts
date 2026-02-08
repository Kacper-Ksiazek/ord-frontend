/**
 * Feedback Chart Colors
 *
 * Defines color values for feedback category bar charts.
 * Uses Tailwind color palette matching the feedback theme.
 */

import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

/**
 * Color scheme for feedback categories:
 * - MISTAKES: Red (#ef4444 - red-500)
 * - STRENGTHS: Green (#22c55e - green-500)
 * - SUGGESTIONS: Blue (#3b82f6 - blue-500)
 */
export const FEEDBACK_CHART_COLORS: Record<MessageFeedbackCriteria, string> = {
	MISTAKES: '#ef4444', // red-500
	STRENGTHS: '#22c55e', // green-500
	SUGGESTIONS: '#3b82f6' // blue-500
} as const;

/**
 * Get chart color for a feedback category
 */
export function getFeedbackChartColor(category: MessageFeedbackCriteria): string {
	return FEEDBACK_CHART_COLORS[category];
}
