import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
import type { UserMessageReviewFilters } from './lib/filters';

export interface UserMessageReviewListWithFiltersProps {
	filters: UserMessageReviewFilters;
	messages: CompactConversationMessage[];
}
