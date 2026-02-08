/**
 * Mistake Severity Chart Colors
 *
 * Defines color values for mistake severity pie charts.
 * Colors progress from lightest (minor) to darkest (critical) shades of red.
 */

/**
 * Color scheme for mistake severity:
 * - Minor (severity1): Lightest red - red-400 (#f87171)
 * - Moderate (severity2): Medium red - red-600 (#dc2626)
 * - Critical (severity3): Darkest red - red-800 (#991b1b)
 */
export const MISTAKE_SEVERITY_CHART_COLORS: string[] = [
	'#f87171', // Minor (severity1) - red-400 (lightest)
	'#dc2626', // Moderate (severity2) - red-600 (medium)
	'#991b1b' // Critical (severity3) - red-800 (darkest/most intensive)
];
