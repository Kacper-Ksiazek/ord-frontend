import type { paths } from '@kacper-ksiazek/ord-api-types';

export type GetCapturedWordsParams = paths['/api/v1/words/captured']['get']['parameters']['query'];

/** UI filter for the list page — maps to `status` when not `all`. */
export type QawListApprovalFilter = 'all' | 'approved' | 'pending';
