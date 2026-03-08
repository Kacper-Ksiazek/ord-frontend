import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
import type { LearningTipFilters } from './lib/filters';

export interface LearningTipsListWithFiltersProps {
	filters?: LearningTipFilters;
	messages: CompactConversationMessage[];
}
