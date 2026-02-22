/**
 * Score Color Constants
 *
 * Defines color schemes for score displays based on score ranges.
 * Used across circular progress bars and score components.
 */

export interface ScoreColorClasses {
	stroke: string;
	bg: string;
	text: string;
	value: string;
}

export interface ScoreBoxColor {
	bg: string;
}

/**
 * Color scheme for scores:
 * - Red (0-3): Low scores - needs improvement
 * - Orange (4-5): Low-medium scores - getting better
 * - Yellow (6-7): Medium scores - good
 * - Green (8-9): High scores - excellent
 * - Dark Green (10): Perfect score - outstanding
 */

const SCORE_COLORS: Record<string, ScoreColorClasses> = {
	null: {
		stroke: 'stroke-gray-400 dark:stroke-gray-500',
		bg: 'stroke-gray-200 dark:stroke-gray-800',
		text: 'text-gray-600 dark:text-gray-400',
		value: 'text-gray-700 dark:text-gray-300'
	},
	perfect: {
		// Perfect score (10) - Dark Green
		stroke: 'stroke-green-800 dark:stroke-green-700',
		bg: 'stroke-green-200 dark:stroke-green-900',
		text: 'text-green-800 dark:text-green-300',
		value: 'text-green-900 dark:text-green-100'
	},
	high: {
		// High scores (8-9) - Green
		stroke: 'stroke-green-600 dark:stroke-green-500',
		bg: 'stroke-green-200 dark:stroke-green-800',
		text: 'text-green-700 dark:text-green-300',
		value: 'text-green-900 dark:text-green-100'
	},
	medium: {
		// Medium scores (6-7) - Bright Yellow
		stroke: 'stroke-yellow-400 dark:stroke-yellow-300',
		bg: 'stroke-yellow-100 dark:stroke-yellow-900',
		text: 'text-yellow-600 dark:text-yellow-200',
		value: 'text-yellow-700 dark:text-yellow-100'
	},
	lowMedium: {
		// Low-medium scores (4-5) - Orange (lighter, more vibrant)
		stroke: 'stroke-orange-500 dark:stroke-orange-400',
		bg: 'stroke-orange-200 dark:stroke-orange-900',
		text: 'text-orange-600 dark:text-orange-300',
		value: 'text-orange-800 dark:text-orange-100'
	},
	low: {
		// Low scores (0-3) - Red (brighter on light, keep dark as before)
		stroke: 'stroke-red-600 dark:stroke-red-600',
		bg: 'stroke-red-200 dark:stroke-red-900',
		text: 'text-red-700 dark:text-red-300',
		value: 'text-red-900 dark:text-red-100'
	}
} as const;

const SCORE_BOX_COLORS: Record<string, ScoreBoxColor> = {
	perfect: {
		// Perfect score (10) - Dark Green
		bg: 'bg-green-800 dark:bg-green-700'
	},
	high: {
		// High scores (8-9) - Green
		bg: 'bg-green-600 dark:bg-green-500'
	},
	medium: {
		// Medium scores (6-7) - Bright Yellow
		bg: 'bg-yellow-400 dark:bg-yellow-300'
	},
	lowMedium: {
		// Low-medium scores (4-5) - Orange (lighter, more vibrant)
		bg: 'bg-orange-500 dark:bg-orange-400'
	},
	low: {
		// Low scores (0-3) - Red (brighter on light, keep dark as before)
		bg: 'bg-red-600 dark:bg-red-600'
	}
} as const;

/**
 * Get color classes for circular progress bar based on score
 */
export function getScoreColorClasses(score: number | null): ScoreColorClasses {
	if (score === null) {
		return SCORE_COLORS.null;
	}

	if (score === 10) {
		return SCORE_COLORS.perfect;
	} else if (score >= 8) {
		return SCORE_COLORS.high;
	} else if (score >= 6) {
		return SCORE_COLORS.medium;
	} else if (score >= 4) {
		return SCORE_COLORS.lowMedium;
	} else {
		return SCORE_COLORS.low;
	}
}

/**
 * Get background color class for score box based on score
 */
export function getScoreBoxColor(score: number): string {
	if (score === 10) {
		return SCORE_BOX_COLORS.perfect.bg;
	} else if (score >= 8) {
		return SCORE_BOX_COLORS.high.bg;
	} else if (score >= 6) {
		return SCORE_BOX_COLORS.medium.bg;
	} else if (score >= 4) {
		return SCORE_BOX_COLORS.lowMedium.bg;
	} else {
		return SCORE_BOX_COLORS.low.bg;
	}
}
