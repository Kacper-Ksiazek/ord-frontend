import type { CompactConversationMessage } from '$conversations/types';
import type { AggregatedAnalysisItem } from './aggregate-analysis.types';

export function aggregateAnalysis(
	messages: CompactConversationMessage[]
): AggregatedAnalysisItem[] {
	const result: AggregatedAnalysisItem[] = [];

	for (let messageOrder = 0; messageOrder < messages.length; messageOrder++) {
		const message = messages[messageOrder];

		if (message.sender !== 'USER' || !message.analysis) continue;

		const createdAt = new Date(message.createdAt);

		for (const mistake of message.analysis.mistakes ?? []) {
			result.push({
				type: 'MISTAKES',
				data: mistake,
				phrase: mistake.phrase,
				explanation: mistake.explanation,
				createdAt,
				messageOrder,
				searchableText: `${mistake.phrase} ${mistake.correctForm} ${mistake.explanation}`.toLowerCase()
			});
		}

		for (const strength of message.analysis.strengths ?? []) {
			result.push({
				type: 'STRENGTHS',
				data: strength,
				phrase: strength.phrase,
				explanation: strength.explanation,
				createdAt,
				messageOrder,
				searchableText: `${strength.phrase} ${strength.explanation}`.toLowerCase()
			});
		}

		for (const suggestion of message.analysis.suggestions ?? []) {
			const alternativesText = suggestion.alternatives.join(' ');
			result.push({
				type: 'SUGGESTIONS',
				data: suggestion,
				phrase: suggestion.original,
				explanation: suggestion.explanation,
				createdAt,
				messageOrder,
				searchableText:
					`${suggestion.original} ${alternativesText} ${suggestion.explanation}`.toLowerCase()
			});
		}
	}

	return result;
}
