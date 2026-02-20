import type {
	ConversationMessageMistake,
	ConversationMessageMistakeSeverity
} from '$lib/types/conversation/domain/conversation-message-feedback';

export type MistakeStats = Record<
	ConversationMessageMistakeSeverity,
	{
		label: string;
		count: number;
		fraction: Percentage;
	}
>;

export function computeMessagesStats(mistakes: ConversationMessageMistake[]): MistakeStats {
	const counts = computeMistakesBySeverity(mistakes);
	const totalMistakes = mistakes.length;

	return {
		MINOR: {
			label: 'Minor (1)',
			count: counts.MINOR,
			fraction: computePercentageValue(counts.MINOR, totalMistakes)
		},
		MODERATE: {
			label: 'Moderate (2)',
			count: counts.MODERATE,
			fraction: computePercentageValue(counts.MODERATE, totalMistakes)
		},
		CRITICAL: {
			label: 'Critical (3)',
			count: counts.CRITICAL,
			fraction: computePercentageValue(counts.CRITICAL, totalMistakes)
		}
	};
}

function computeMistakesBySeverity(
	mistakes: ConversationMessageMistake[]
): Record<ConversationMessageMistakeSeverity, number> {
	return mistakes.reduce(
		(acc, m) => {
			acc[m.severity] += 1;

			return acc;
		},
		{
			MINOR: 0,
			MODERATE: 0,
			CRITICAL: 0
		} satisfies Record<ConversationMessageMistakeSeverity, number>
	);
}

function computePercentageValue(a: number, b: number): Percentage {
	return `${((a / b) * 100).toFixed(2)}%`;
}
