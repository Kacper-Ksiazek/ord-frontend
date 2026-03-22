import type { ConversationType, RecencyBucket } from '$lib/types/conversation/domain/conversation';

export type ConversationListFilters = {
	search: string;
	recencyBucket: RecencyBucket | null;
	type: ConversationType | null;
};
