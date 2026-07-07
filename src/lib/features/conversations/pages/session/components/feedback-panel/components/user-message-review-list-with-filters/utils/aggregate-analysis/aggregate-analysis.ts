import type { CompactConversationMessage } from '$conversations/types';
import type { AggregatedAnalysisItem } from './aggregate-analysis.types';

export function aggregateAnalysis(
	messages: CompactConversationMessage[]
): AggregatedAnalysisItem[] {
	const result: AggregatedAnalysisItem[] = [];

	for (const message of messages) {
		if (message.sender !== 'USER' || !message.analysis) continue;

		const createdAt = new Date(message.createdAt);

		// Aggregate mistakes
		for (const mistake of message.analysis.mistakes ?? []) {
			result.push({
				type: 'MISTAKES',
				data: mistake,
				phrase: mistake.phrase,
				explanation: mistake.explanation,
				createdAt,
				searchableText: `${mistake.phrase} ${mistake.correctForm} ${mistake.explanation}`.toLowerCase()
			});
		}

		// Aggregate strengths
		for (const strength of message.analysis.strengths ?? []) {
			result.push({
				type: 'STRENGTHS',
				data: strength,
				phrase: strength.phrase,
				explanation: strength.explanation,
				createdAt,
				searchableText: `${strength.phrase} ${strength.explanation}`.toLowerCase()
			});
		}

		// Aggregate suggestions
		for (const suggestion of message.analysis.suggestions ?? []) {
			const alternativesText = suggestion.alternatives.join(' ');
			result.push({
				type: 'SUGGESTIONS',
				data: suggestion,
				phrase: suggestion.original,
				explanation: suggestion.explanation,
				createdAt,
				searchableText:
					`${suggestion.original} ${alternativesText} ${suggestion.explanation}`.toLowerCase()
			});
		}
	}

	return result;
}
