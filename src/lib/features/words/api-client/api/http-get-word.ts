import type { SingleWordResponse, WordListItem } from '$words/types';
import { api } from '$lib/api-client/axios';
import { getWordBookmarked } from '../utils/normalize-word-list-item';

export async function httpGetWord(id: string): Promise<SingleWordResponse> {
	const response = await api.get<SingleWordResponse>(`/api/v1/words/${id}`);
	const bookmarked = getWordBookmarked(response.data as WordListItem);

	return {
		...response.data,
		bookmarked
	};
}
