export interface DailyActivityPoint {
	date: string;
	messageCount: number;
}

export interface ConversationListActivityStats {
	messagesCount: number;
	conversationsCount: number;
	period: string;
}

export interface ConversationListActivitySnapshot {
	daily: DailyActivityPoint[];
	stats: ConversationListActivityStats;
}
