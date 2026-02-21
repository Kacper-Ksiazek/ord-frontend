import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type {
	ConversationMessageMistakeSeverity,
	ConversationMessageSuggestionType
} from '$lib/types/conversation/domain/conversation-message-feedback';

export type FeedbackTabFilter = 'ALL' | MessageFeedbackCriteria;
export type MistakeSeverityFilter = 'ALL' | ConversationMessageMistakeSeverity;
export type SuggestionTypeFilter = 'ALL' | ConversationMessageSuggestionType;

export interface FeedbackTabFilters {
	tab: FeedbackTabFilter;
	severity: MistakeSeverityFilter;
	suggestionType: SuggestionTypeFilter;
	searchQuery: string;
}
