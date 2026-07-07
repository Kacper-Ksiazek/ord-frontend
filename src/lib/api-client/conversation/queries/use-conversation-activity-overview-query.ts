import { createQuery } from '@tanstack/svelte-query';
import type { ConversationActivityOverview } from '$conversations/types/api/conversation-list-activity';
import { getConversationActivityOverview } from '../api/get-conversation-activity-overview';
import { conversationKeys } from '../keys';

export function createConversationActivityOverviewQuery() {
	return createQuery<ConversationActivityOverview>(() => ({
		queryKey: conversationKeys.overview(),
		queryFn: getConversationActivityOverview
	}));
}
