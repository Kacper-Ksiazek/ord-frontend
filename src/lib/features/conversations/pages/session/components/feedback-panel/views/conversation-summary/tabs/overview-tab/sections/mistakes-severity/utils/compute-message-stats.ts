import round from 'lodash/round';
import type {
	ConversationMessageMistake,
	ConversationMessageMistakeSeverity
} from '$lib/types/conversation/domain/conversation-message-feedback';
import { MISTAKE_SEVERITY_CHART_COLORS_MAP } from '$conversations/pages/session/constants/mistake-severity-colors';

export type MistakeStats = Record<
	ConversationMessageMistakeSeverity,
	{
		label: string;
		color: string;
		count: number;
		fraction: number;
	}
>;

export function computeMessagesStats(mistakes: ConversationMessageMistake[]): MistakeStats {
	const counts = computeMistakesBySeverity(mistakes);
	const totalMistakes = mistakes.length;

	return {
		MINOR: {
			label: 'Minor',
			color: MISTAKE_SEVERITY_CHART_COLORS_MAP.MINOR,
			count: counts.MINOR,
			fraction: computePercentageValue(counts.MINOR, totalMistakes)
		},
		MODERATE: {
			label: 'Moderate',
			color: MISTAKE_SEVERITY_CHART_COLORS_MAP.MODERATE,
			count: counts.MODERATE,
			fraction: computePercentageValue(counts.MODERATE, totalMistakes)
		},
		CRITICAL: {
			label: 'Critical',
			color: MISTAKE_SEVERITY_CHART_COLORS_MAP.CRITICAL,
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

function computePercentageValue(a: number, b: number): number {
	return round((a / b) * 100, 2);
}
