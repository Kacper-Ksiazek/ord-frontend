import type { QueryClient, QueryKey } from '@tanstack/svelte-query';
import type {
	SingleWordResponse,
	WordOverviewResponse,
	WordsPaginatedDataResponse
} from '$words/types';
import { wordCaptureKeys } from '../keys';
import { getWordBookmarked } from './normalize-word-list-item';

export type ApplyOptimisticBookmarkToggleOptions = {
	bookmarkedOnlyFilter?: boolean;
};

type SearchQueryParams = {
	bookmarked?: boolean | null;
};

function setBookmarkedFields<T extends { bookmarked?: boolean; isBookmarked?: boolean }>(
	item: T,
	bookmarked: boolean
): T {
	return {
		...item,
		bookmarked,
		isBookmarked: bookmarked
	};
}

function toggleBookmarkInList(
	data: WordsPaginatedDataResponse | undefined,
	wordId: string
): WordsPaginatedDataResponse | undefined {
	if (!data?.data) {
		return data;
	}

	return {
		...data,
		data: data.data.map((item) =>
			item.id === wordId ? setBookmarkedFields(item, !getWordBookmarked(item)) : item
		)
	};
}

function removeWordFromList(
	data: WordsPaginatedDataResponse | undefined,
	wordId: string
): WordsPaginatedDataResponse | undefined {
	if (!data?.data) {
		return data;
	}

	if (!data.data.some((item) => item.id === wordId)) {
		return data;
	}

	const nextData = data.data.filter((item) => item.id !== wordId);
	const pagination = data.pagination;

	return {
		...data,
		data: nextData,
		pagination: pagination
			? {
					...pagination,
					totalResults: Math.max(0, (pagination.totalResults ?? 0) - 1),
					resultsOnCurrentPage: nextData.length
				}
			: pagination
	};
}

function getSearchParamsFromQueryKey(queryKey: QueryKey): SearchQueryParams | null {
	if (
		queryKey.length < 4 ||
		queryKey[0] !== 'words' ||
		queryKey[1] !== 'capture' ||
		queryKey[2] !== 'search'
	) {
		return null;
	}

	const params = queryKey[3];

	return typeof params === 'object' && params !== null ? (params as SearchQueryParams) : null;
}

function shouldRemoveFromSearchOnUnbookmark(
	params: SearchQueryParams | null,
	bookmarkedOnlyFilter: boolean
): boolean {
	if (!params) {
		return false;
	}

	if (params.bookmarked === true) {
		return true;
	}

	return bookmarkedOnlyFilter && params.bookmarked == null;
}

function findWordBookmarkState(queryClient: QueryClient, wordId: string): boolean | undefined {
	const detail = queryClient.getQueryData<SingleWordResponse>(wordCaptureKeys.detail(wordId));
	if (detail) {
		return getWordBookmarked(detail);
	}

	for (const [, data] of queryClient.getQueriesData<WordsPaginatedDataResponse>({
		queryKey: wordCaptureKeys.all
	})) {
		const item = data?.data?.find((entry) => entry.id === wordId);
		if (item) {
			return getWordBookmarked(item);
		}
	}

	return undefined;
}

export function applyOptimisticBookmarkToggle(
	queryClient: QueryClient,
	wordId: string,
	options: ApplyOptimisticBookmarkToggleOptions = {}
) {
	const bookmarkedOnlyFilter = options.bookmarkedOnlyFilter ?? false;
	const beforeBookmarked = findWordBookmarkState(queryClient, wordId);
	const nextBookmarked = beforeBookmarked === undefined ? true : !beforeBookmarked;

	queryClient.setQueriesData<WordsPaginatedDataResponse>(
		{ queryKey: wordCaptureKeys.lists() },
		(data) => toggleBookmarkInList(data, wordId)
	);

	const searchQueries = queryClient.getQueriesData<WordsPaginatedDataResponse>({
		queryKey: wordCaptureKeys.searches()
	});

	for (const [queryKey, data] of searchQueries) {
		if (!data) {
			continue;
		}

		const searchParams = getSearchParamsFromQueryKey(queryKey);
		const shouldRemove =
			!nextBookmarked && shouldRemoveFromSearchOnUnbookmark(searchParams, bookmarkedOnlyFilter);
		const nextData = shouldRemove
			? removeWordFromList(data, wordId)
			: toggleBookmarkInList(data, wordId);

		queryClient.setQueryData(queryKey, nextData);
	}

	queryClient.setQueryData<SingleWordResponse>(wordCaptureKeys.detail(wordId), (data) => {
		if (!data) {
			return data;
		}

		return setBookmarkedFields(data, nextBookmarked);
	});

	if (beforeBookmarked !== undefined && beforeBookmarked !== nextBookmarked) {
		const delta = nextBookmarked ? 1 : -1;
		queryClient.setQueriesData<WordOverviewResponse>(
			{ queryKey: [...wordCaptureKeys.all, 'overview'] },
			(data) => {
				if (!data) {
					return data;
				}

				return {
					...data,
					bookmarkedCount: Math.max(0, (data.bookmarkedCount ?? 0) + delta)
				};
			}
		);
	}
}
