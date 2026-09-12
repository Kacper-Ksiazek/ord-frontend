import type { GetWordsParams, WordsPaginatedDataResponse } from '$words/types';
import { api } from '$lib/api-client/axios';
import { normalizeWordsPaginatedDataResponse } from '../utils/normalize-word-list-item';

const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 50;

export async function httpGetWords(params: GetWordsParams): Promise<WordsPaginatedDataResponse> {
	const page = params.page ?? DEFAULT_PAGE;
	const perPage = params.perPage ?? DEFAULT_PER_PAGE;
	const { language } = params;

	const response = await api.get<WordsPaginatedDataResponse>('/api/v1/words', {
		params: {
			language,
			page,
			perPage
		}
	});

	return normalizeWordsPaginatedDataResponse(response.data);
}
