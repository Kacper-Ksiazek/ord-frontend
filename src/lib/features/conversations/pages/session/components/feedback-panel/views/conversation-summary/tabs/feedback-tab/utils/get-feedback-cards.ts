import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type { FeedbackStatCardProps } from '../components/feedback-stat-card/feedback-stat-card.types';

export function getFeedbackCards(
	counts: Map<MessageFeedbackCriteria, number>
): Pick<FeedbackStatCardProps, 'count' | 'tabId'>[] {
	return [
		{
			tabId: 'ALL',
			count: Array.from(counts.values()).reduce((acc, value) => acc + value, 0)
		},
		{
			tabId: 'MISTAKES',
			count: counts.get('MISTAKES') ?? 0
		},
		{
			tabId: 'STRENGTHS',
			count: counts.get('STRENGTHS') ?? 0
		},
		{
			tabId: 'SUGGESTIONS',
			count: counts.get('SUGGESTIONS') ?? 0
		}
	];
}
