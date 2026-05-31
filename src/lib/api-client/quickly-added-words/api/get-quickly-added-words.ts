import { api } from '../../axios';
import type { GetQuicklyAddedWordsParams } from '$lib/types/quickly-added-word/api/list-quickly-added-words';
import type { PaginatedQuicklyAddedWordsResponse } from '$lib/types/quickly-added-word/api/responses';

const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 50;

export async function getQuicklyAddedWords(
	params: GetQuicklyAddedWordsParams = {}
): Promise<PaginatedQuicklyAddedWordsResponse> {
	const page = params.page ?? DEFAULT_PAGE;
	const perPage = params.perPage ?? DEFAULT_PER_PAGE;
	const { isApproved } = params;

	const response = await api.get<PaginatedQuicklyAddedWordsResponse>(
		'/api/v1/quickly-added-words/',
		{
			params: {
				page,
				perPage,
				...(isApproved !== undefined ? { isApproved } : {})
			}
		}
	);

	return response.data;
}
