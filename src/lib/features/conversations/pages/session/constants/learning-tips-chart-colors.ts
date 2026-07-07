/**
 * Learning Tips Chart Colors
 *
 * Defines color values for learning tips category bar charts.
 * Uses Tailwind color palette matching the learning tips theme.
 */

import type { LearningTipCategory } from '$conversations/types';

/**
 * Color scheme for learning tips categories:
 * - GRAMMAR: Green (#22c55e - green-500)
 * - VOCABULARY: Blue (#3b82f6 - blue-500)
 * - PHRASES: Purple (#a855f7 - purple-500)
 */
export const LEARNING_TIPS_CHART_COLORS: Record<LearningTipCategory, string> = {
	GRAMMAR: '#22c55e', // green-500
	VOCABULARY: '#3b82f6', // blue-500
	PHRASES: '#a855f7' // purple-500
} as const;

/**
 * Get chart color for a learning tip category
 */
export function getLearningTipChartColor(category: LearningTipCategory): string {
	return LEARNING_TIPS_CHART_COLORS[category];
}
