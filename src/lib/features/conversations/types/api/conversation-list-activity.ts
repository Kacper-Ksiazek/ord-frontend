import type { components } from '@kacper-ksiazek/ord-api-types';

export type ConversationActivityOverview = components['schemas']['ConversationActivityOverviewDTO'];
export type HeatmapDay = components['schemas']['HeatmapDayDTO'];
export type ActivityWeekPoint = components['schemas']['ActivityWeekPointDTO'];
export type HeatmapPercentile = HeatmapDay['percentile'];

export const HeatmapPercentile = {
	P0: 'p0',
	P20: 'p20',
	P40: 'p40',
	P60: 'p60',
	P80: 'p80'
} as const satisfies Record<string, HeatmapPercentile>;
