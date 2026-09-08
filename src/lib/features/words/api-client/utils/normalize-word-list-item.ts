import type { WordListItem, WordsPaginatedDataResponse } from '$words/types';

type RawWordListItem = WordListItem & {
	isBookmarked?: boolean;
	isFromUnverifiedSource?: boolean;
};

export function getWordBookmarked(item: WordListItem): boolean {
	const raw = item as RawWordListItem;

	return Boolean(raw.bookmarked ?? raw.isBookmarked);
}

export function normalizeWordListItem(item: WordListItem): WordListItem {
	const raw = item as RawWordListItem;

	return {
		...item,
		bookmarked: getWordBookmarked(item),
		fromUnverifiedSource: Boolean(raw.fromUnverifiedSource ?? raw.isFromUnverifiedSource)
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
