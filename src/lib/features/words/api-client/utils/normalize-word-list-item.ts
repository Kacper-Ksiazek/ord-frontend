import type { WordListItem, WordsPaginatedDataResponse } from '$words/types';

export function getWordBookmarked(item: {
	bookmarked?: boolean | null;
	isBookmarked?: boolean | null;
}): boolean {
	return Boolean(item.bookmarked ?? item.isBookmarked);
}

export function normalizeWordListItem(item: WordListItem): WordListItem {
	return {
		...item,
		bookmarked: getWordBookmarked(item)
	};
}

export function normalizeWordsPaginatedDataResponse(
	response: WordsPaginatedDataResponse
): WordsPaginatedDataResponse {
	if (!response.data) {
		return response;
	}

	return {
		...response,
		data: response.data.map(normalizeWordListItem)
	};
}
