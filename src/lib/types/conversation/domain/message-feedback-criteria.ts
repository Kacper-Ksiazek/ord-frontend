export type MessageFeedbackCriteria = 'MISTAKES' | 'STRENGTHS' | 'SUGGESTIONS';

export type FeedbackCriteriaColor = 'green' | 'red' | 'blue';

export const FEEDBACK_CRITERIA_COLOR_MAP: Map<MessageFeedbackCriteria, FeedbackCriteriaColor> =
	new Map([
		['MISTAKES', 'red'],
		['STRENGTHS', 'green'],
		['SUGGESTIONS', 'blue']
	]);

export function getFeedbackCriteriaColor(criteria: MessageFeedbackCriteria): FeedbackCriteriaColor {
	return FEEDBACK_CRITERIA_COLOR_MAP.get(criteria) ?? 'red';
}
