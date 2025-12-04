export type MessageFeedbackCriteria =
	| 'SCORES'
	| 'MISTAKES'
	| 'STRENGTHS'
	| 'VOCABULARY_ENRICHMENT'
	| 'ALTERNATIVE_EXPRESSIONS'
	| 'CULTURAL_NOTE';

export type FeedbackCriteriaColor = 'gray' | 'green' | 'red' | 'blue' | 'purple' | 'indigo';

export const FEEDBACK_CRITERIA_COLOR_MAP: Map<MessageFeedbackCriteria, FeedbackCriteriaColor> =
	new Map([
		['SCORES', 'gray'],
		['MISTAKES', 'red'],
		['STRENGTHS', 'green'],
		['VOCABULARY_ENRICHMENT', 'blue'],
		['ALTERNATIVE_EXPRESSIONS', 'purple'],
		['CULTURAL_NOTE', 'indigo']
	]);

export function getFeedbackCriteriaColor(criteria: MessageFeedbackCriteria): FeedbackCriteriaColor {
	return FEEDBACK_CRITERIA_COLOR_MAP.get(criteria) ?? 'gray';
}
