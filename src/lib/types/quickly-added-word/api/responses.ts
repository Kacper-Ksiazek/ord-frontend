import type { components } from '@ord-api/ord-api-types';
import type { QuicklyAddedWordDTO } from '../domain/entities';

export type PaginationData = components['schemas']['PaginationData'];

export type PaginatedQuicklyAddedWordsResponse = {
	pagination: PaginationData;
	data: QuicklyAddedWordDTO[];
};
