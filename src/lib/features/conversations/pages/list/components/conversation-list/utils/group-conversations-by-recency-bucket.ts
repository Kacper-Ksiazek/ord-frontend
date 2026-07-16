import type { ConversationSummaryDTO, RecencyBucket } from '$conversations/types';
import { RECENCY_BUCKETS } from '$conversations/shared/constants/enum-values';

export type RecencyBucketSectionGroup = {
	section: RecencyBucket;
	items: ConversationSummaryDTO[];
};

export function groupConversationsByRecencyBucket(
	items: readonly ConversationSummaryDTO[]
): RecencyBucketSectionGroup[] {
	const buckets: Record<RecencyBucket, ConversationSummaryDTO[]> = {
		TODAY: [],
		YESTERDAY: [],
		THIS_WEEK: [],
		THIS_MONTH: [],
		LATER: []
	};

	for (const item of items) {
		buckets[item.recencyBucket].push(item);
	}

	return RECENCY_BUCKETS.filter((id) => buckets[id].length > 0).map((section) => ({
		section,
		items: buckets[section]
	}));
}
