/** Quiet studio chart colors — read from CSS variables when in browser. */

function readStudioCssVar(variable: string, fallback: string): string {
	if (typeof document === 'undefined') {
		return fallback;
	}

	return getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || fallback;
}

export function getChartInkMuted(): string {
	return readStudioCssVar('--studio-ink-muted', '#6b6b6b');
}

/** Flat / empty sparklines — quieter than {@link getChartInkMuted}. */
export function getChartInkDisabled(): string {
	return readStudioCssVar('--studio-line-subtle', '#f3f3f3');
}

export function getChartLine(): string {
	return readStudioCssVar('--studio-line', '#ebebeb');
}

/** Primary series stroke — charcoal (light) / light grey (dark). */
export function getChartPrimaryLine(): string {
	return readStudioCssVar('--studio-chart-series', '#2a2a2a');
}

export const CHART_MARGINS_COMPACT = { top: 8, right: 8, bottom: 8, left: 8 } as const;

export const CHART_MARGINS_AXIS = { top: 12, right: 16, bottom: 36, left: 44 } as const;
