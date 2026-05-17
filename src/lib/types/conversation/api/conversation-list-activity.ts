// TODO: ConversationOverview - refactor once npm package is published
export enum HeatmapPercentile {
	P0 = 'p0',
	P20 = 'p20',
	P40 = 'p40',
	P60 = 'p60',
	P80 = 'p80'
}

// TODO: ConversationOverview - refactor once npm package is published
export interface HeatmapDay {
	count: number;
	date: string;
	percentile: HeatmapPercentile;
}

// TODO: ConversationOverview - refactor once npm package is published
export interface ActivityWeekPoint {
	weekRange: string;
	count: number;
}

// TODO: ConversationOverview - refactor once npm package is published
export interface ConversationActivityOverview {
	periodLabel: string;
	messagesTotal: number;
	conversationsTotal: number;
	heatmap: HeatmapDay[];
	messagesByWeek: ActivityWeekPoint[];
	conversationsByWeek: ActivityWeekPoint[];
}
