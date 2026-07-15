import { createQuery } from '@tanstack/svelte-query';
import type { ConversationActivityOverview } from '$conversations/types';
import { httpGetConversationActivityOverview } from '../api/http-get-conversation-activity-overview';
import { conversationKeys } from '../keys';

export function createConversationActivityOverviewQuery() {
	return createQuery<ConversationActivityOverview>(() => ({
		queryKey: conversationKeys.overview(),
		queryFn: httpGetConversationActivityOverview
	}));
}
