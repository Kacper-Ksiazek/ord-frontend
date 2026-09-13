import { QueryClient } from '@tanstack/query-core';
import { describe, expect, it } from 'vitest';
import { wordCaptureKeys } from '../keys';
import type { SingleWordResponse, WordOverviewResponse } from '$words/types';
import { applyOptimisticBookmarkToggle } from './apply-optimistic-bookmark-toggle';

describe('applyOptimisticBookmarkToggle', () => {
	it('removes unbookmarked word from bookmarked-only search cache', () => {
		const queryClient = new QueryClient();
		const searchKey = wordCaptureKeys.search({
			language: 'ENGLISH',
			page: 0,
			perPage: 50,
			searchingPhrase: null,
			wordTypes: [],
			wordExtraMarks: [],
			banksIds: [],
			bookmarked: true,
			sortBy: 'CREATED_AT',
			sortDirection: 'DESC'
		});

		queryClient.setQueryData(searchKey, {
			data: [
				{ id: 'word-1', sourceWord: 'alpha', bookmarked: true, isBookmarked: true },
				{ id: 'word-2', sourceWord: 'beta', bookmarked: true, isBookmarked: true }
			],
			pagination: {
				page: 0,
				perPage: 50,
				totalResults: 2,
				resultsOnCurrentPage: 2
			}
		});

		applyOptimisticBookmarkToggle(queryClient, 'word-1', { bookmarkedOnlyFilter: true });

		const updated = queryClient.getQueryData<{
			data: Array<{ id?: string }>;
			pagination?: { totalResults?: number; resultsOnCurrentPage?: number };
		}>(searchKey);

		expect(updated?.data?.map((item) => item.id)).toEqual(['word-2']);
		expect(updated?.pagination?.totalResults).toBe(1);
		expect(updated?.pagination?.resultsOnCurrentPage).toBe(1);
	});

	it('keeps word in regular search cache when unbookmarking', () => {
		const queryClient = new QueryClient();
		const searchKey = wordCaptureKeys.search({
			language: 'ENGLISH',
			page: 0,
			perPage: 50,
			searchingPhrase: null,
			wordTypes: [],
			wordExtraMarks: [],
			banksIds: [],
			bookmarked: null,
			sortBy: 'CREATED_AT',
			sortDirection: 'DESC'
		});

		queryClient.setQueryData(searchKey, {
			data: [{ id: 'word-1', sourceWord: 'alpha', bookmarked: true, isBookmarked: true }]
		});

		applyOptimisticBookmarkToggle(queryClient, 'word-1');

		const updated = queryClient.getQueryData<{
			data: Array<{ id?: string; bookmarked?: boolean; isBookmarked?: boolean }>;
		}>(searchKey);

		expect(updated?.data).toHaveLength(1);
		expect(updated?.data?.[0]?.bookmarked).toBe(false);
		expect(updated?.data?.[0]?.isBookmarked).toBe(false);
	});

	it('updates detail query bookmarked state when toggling bookmark', () => {
		const queryClient = new QueryClient();
		const detailKey = wordCaptureKeys.detail('word-1');

		queryClient.setQueryData(detailKey, {
			id: 'word-1',
			sourceWord: 'alpha',
			bookmarked: false,
			isBookmarked: false
		});

		applyOptimisticBookmarkToggle(queryClient, 'word-1');

		expect(queryClient.getQueryData<SingleWordResponse>(detailKey)?.bookmarked).toBe(true);
	});

	it('updates overview bookmarkedCount when toggling bookmark', () => {
		const queryClient = new QueryClient();
		const overviewKey = wordCaptureKeys.overview({ language: 'ENGLISH' });
		const listKey = wordCaptureKeys.list({
			language: 'ENGLISH',
			page: 0,
			perPage: 50
		});

		queryClient.setQueryData(overviewKey, {
			total: 1,
			bookmarkedCount: 1
		});
		queryClient.setQueryData(listKey, {
			data: [{ id: 'word-1', sourceWord: 'alpha', bookmarked: true, isBookmarked: true }]
		});

		applyOptimisticBookmarkToggle(queryClient, 'word-1');

		expect(queryClient.getQueryData<WordOverviewResponse>(overviewKey)?.bookmarkedCount).toBe(0);
	});
});
