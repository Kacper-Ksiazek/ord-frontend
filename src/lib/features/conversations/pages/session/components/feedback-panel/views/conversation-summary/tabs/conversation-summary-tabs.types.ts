export interface ConversationSummaryData {
	totalLearningTips: number;
	totalMistakes: number;
	totalStrengths: number;
	totalSuggestions: number;
	learningTipsByCategory: {
		grammar: number;
		vocabulary: number;
		phrases: number;
	};
	averageUserMessageCharacters: number | null;
	averageAiMessageCharacters: number | null;
}
