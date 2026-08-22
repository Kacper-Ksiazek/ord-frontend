import type {
	CompactConversationMessage,
	CompactConversationUserMessage
} from '$conversations/types';

export type PerformanceAverages = {
	grammar: number;
	vocabulary: number;
	naturalness: number;
};

const METRIC_LABELS = {
	grammar: 'Gramatyka',
	vocabulary: 'Słownictwo',
	naturalness: 'Naturalność'
} as const;

export function computePerformanceAverages(
	messages: CompactConversationMessage[]
): PerformanceAverages | null {
	const analyses = messages
		.filter(
			(
				message
			): message is CompactConversationMessage & {
				sender: 'USER';
				analysis: NonNullable<CompactConversationUserMessage['analysis']>;
			} => message.sender === 'USER' && message.analysis != null
		)
		.map((message) => message.analysis);

	if (analyses.length === 0) {
		return null;
	}

	const sums = analyses.reduce(
		(acc, analysis) => {
			acc.grammar += analysis.grammar;
			acc.vocabulary += analysis.vocabulary;
			acc.naturalness += analysis.naturalness;

			return acc;
		},
		{ grammar: 0, vocabulary: 0, naturalness: 0 }
	);

	return {
		grammar: sums.grammar / analyses.length,
		vocabulary: sums.vocabulary / analyses.length,
		naturalness: sums.naturalness / analyses.length
	};
}

export function getMetricLabel(metric: keyof typeof METRIC_LABELS): string {
	return METRIC_LABELS[metric];
}

export const SCORE_METRICS = ['grammar', 'vocabulary', 'naturalness'] as const;

export type ScoreMetric = keyof typeof METRIC_LABELS;
