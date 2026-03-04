import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
import type { AggregatedFeedbackItem } from './aggregate-feedback.types';

export function aggregateFeedback(
	messages: CompactConversationMessage[]
): AggregatedFeedbackItem[] {
	const result: AggregatedFeedbackItem[] = [];

	for (const message of messages) {
		if (message.sender !== 'USER' || !message.feedback) continue;

		const createdAt = new Date(message.createdAt);

		// Aggregate mistakes
		for (const mistake of message.feedback.mistakes ?? []) {
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
		for (const strength of message.feedback.strengths ?? []) {
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
		for (const suggestion of message.feedback.suggestions ?? []) {
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
