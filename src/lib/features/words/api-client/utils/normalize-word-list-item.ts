import type { WordListItem, WordsPaginatedDataResponse } from '$words/types';

type RawWordListItem = WordListItem & {
	isBookmarked?: boolean;
};

export function getWordBookmarked(item: WordListItem): boolean {
	const raw = item as RawWordListItem;

	return Boolean(raw.bookmarked ?? raw.isBookmarked);
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
