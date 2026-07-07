import { createQuery } from '@tanstack/svelte-query';
import type { ConversationActivityOverview } from '$conversations/types';
import { getConversationActivityOverview } from '../api/get-conversation-activity-overview';
import { conversationKeys } from '../keys';

export function createConversationActivityOverviewQuery() {
	return createQuery<ConversationActivityOverview>(() => ({
		queryKey: conversationKeys.overview(),
		queryFn: getConversationActivityOverview
	}));
}
