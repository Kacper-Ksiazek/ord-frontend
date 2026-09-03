import type {
	CompactConversationMessage,
	CompactConversationUserMessage
} from '$conversations/types';

import * as m from '$lib/paraglide/messages';

export type PerformanceAverages = {
	grammar: number;
	vocabulary: number;
	naturalness: number;
};

const METRIC_MESSAGE_KEYS = {
	grammar: 'features.conversation.session.scores.grammar',
	vocabulary: 'features.conversation.session.scores.vocabulary',
	naturalness: 'features.conversation.session.scores.naturalness'
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

	const sums = analyses.reduce<PerformanceAverages>(
		(acc, analysis) => {
			acc.grammar += analysis.grammar ?? 0;
			acc.vocabulary += analysis.vocabulary ?? 0;
			acc.naturalness += analysis.naturalness ?? 0;

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

export function getMetricLabel(metric: keyof typeof METRIC_MESSAGE_KEYS): string {
	const messageKey = METRIC_MESSAGE_KEYS[metric] as keyof typeof m;
	const messageFn = m[messageKey] as (() => string) | undefined;

	return messageFn?.() || metric;
}

export const SCORE_METRICS = ['grammar', 'vocabulary', 'naturalness'] as const;

export type ScoreMetric = keyof typeof METRIC_MESSAGE_KEYS;
