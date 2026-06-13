import type { paths } from '@ord-api/ord-api-types';

export type GetQuicklyAddedWordsParams = NonNullable<
	paths['/api/v1/quickly-added-words/']['get']['parameters']['query']
>;

/** UI filter for the list page — maps to `isApproved` when not `all`. */
export type QawListApprovalFilter = 'all' | 'approved' | 'pending';
