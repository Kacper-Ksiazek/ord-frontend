import { CONVERSATION_TYPES } from '$lib/features/conversations/shared/constants/enum_values';
import type { ConversationType, RecencyBucket } from '$lib/types/conversation/domain/conversation';
import type { GetConversationsFilters } from '$lib/types/conversation/api/list-conversations';

export const RECENCY_BUCKETS: RecencyBucket[] = [
	'TODAY',
	'YESTERDAY',
	'THIS_WEEK',
	'THIS_MONTH',
	'LATER'
];

const conversationTypeSet = new Set<string>(CONVERSATION_TYPES);
const recencyBucketSet = new Set<string>(RECENCY_BUCKETS);

export function conversationListFiltersFromSearchParams(
	searchParams: URLSearchParams
): GetConversationsFilters {
	const rawSearch = searchParams.get('search');
	const search = rawSearch?.trim() ? rawSearch.trim() : undefined;

	const recencyRaw = searchParams.get('recencyBucket');
	const recencyBucket =
		recencyRaw && recencyBucketSet.has(recencyRaw) ? (recencyRaw as RecencyBucket) : undefined;

	const typeRaw = searchParams.get('type');
	const type =
		typeRaw && conversationTypeSet.has(typeRaw) ? (typeRaw as ConversationType) : undefined;

	return { search, recencyBucket, type };
}
