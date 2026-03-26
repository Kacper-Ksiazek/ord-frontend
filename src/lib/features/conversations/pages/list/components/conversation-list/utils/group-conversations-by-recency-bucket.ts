import type {
	ConversationSummaryDTO,
	RecencyBucket
} from '$lib/types/conversation/domain/conversation';

const RECENCY_BUCKET_ORDER: RecencyBucket[] = [
	'TODAY',
	'YESTERDAY',
	'THIS_WEEK',
	'THIS_MONTH',
	'LATER'
];

export const RECENCY_BUCKET_LABEL: Record<RecencyBucket, string> = {
	TODAY: 'Today',
	YESTERDAY: 'Yesterday',
	THIS_WEEK: 'This week',
	THIS_MONTH: 'This month',
	LATER: 'Later'
};

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

	return RECENCY_BUCKET_ORDER.filter((id) => buckets[id].length > 0).map((section) => ({
		section,
		items: buckets[section]
	}));
}
