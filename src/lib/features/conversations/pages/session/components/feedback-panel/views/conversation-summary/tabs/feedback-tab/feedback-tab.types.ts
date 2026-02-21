import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';

export type FeedbackTabFilter = 'ALL' | MessageFeedbackCriteria;
export type MistakeSeverityFilter = 'ALL' | ConversationMessageMistakeSeverity;

export interface FeedbackTabFilters {
	tab: FeedbackTabFilter;
	severity: MistakeSeverityFilter;
	searchQuery: string;
}
