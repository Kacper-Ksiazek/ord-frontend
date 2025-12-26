import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

/**
 * Returns the leading color class for a given feedback metric criteria.
 * This color is used for icons and other visual indicators.
 */
export function getLeadingColorForFeedbackMetric(criteria: MessageFeedbackCriteria): string {
	const colorMap: Record<MessageFeedbackCriteria, string> = {
		SCORES: 'text-amber-500',
		MISTAKES: 'text-red-500',
		STRENGTHS: 'text-green-500',
		VOCABULARY_ENRICHMENT: 'text-blue-500',
		ALTERNATIVE_EXPRESSIONS: 'text-purple-500',
		CULTURAL_NOTE: 'text-indigo-500'
	};

	return colorMap[criteria];
}
