import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type { AggregatedFeedbackItem } from './aggregate-feedback/aggregate-feedback.types';

export function countFeedback(
	items: AggregatedFeedbackItem[]
): Map<MessageFeedbackCriteria, number> {
	return items.reduce(
		(acc, item) => {
			acc.set(item.type, (acc.get(item.type) ?? 0) + 1);

			return acc;
		},

		new Map<MessageFeedbackCriteria, number>([
			['MISTAKES', 0],
			['STRENGTHS', 0],
			['SUGGESTIONS', 0]
		])
	);
}
