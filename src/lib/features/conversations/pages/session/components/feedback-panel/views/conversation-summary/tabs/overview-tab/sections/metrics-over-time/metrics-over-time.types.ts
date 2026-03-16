export type MetricsOverTimeProperty = 'grammar' | 'vocabulary' | 'naturalness' | 'avgCharacters';

export interface MetricOption {
	label: string;
	value: MetricsOverTimeProperty;
}

export const METRIC_OPTIONS: MetricOption[] = [
	{ label: 'Grammar', value: 'grammar' },
	{ label: 'Vocabulary', value: 'vocabulary' },
	{ label: 'Naturalness', value: 'naturalness' },
	{ label: 'Avg. characters', value: 'avgCharacters' }
] as const;
