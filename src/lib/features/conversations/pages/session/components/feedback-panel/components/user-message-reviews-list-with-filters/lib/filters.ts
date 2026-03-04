import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
import type {
	ConversationMessageMistakeSeverity,
	ConversationMessageSuggestionType
} from '$lib/types/conversation/domain/conversation-message-feedback';

export type FeedbackCategoryFilter = 'ALL' | MessageFeedbackCriteria;
export type MistakeSeverityFilter = 'ALL' | ConversationMessageMistakeSeverity;
export type SuggestionTypeFilter = 'ALL' | ConversationMessageSuggestionType;

export interface UserMessageReviewFilters {
	category: FeedbackCategoryFilter;
	searchQuery: string;
	// subcategories
	mistakeSeverity: MistakeSeverityFilter;
	suggestionType: SuggestionTypeFilter;
}
