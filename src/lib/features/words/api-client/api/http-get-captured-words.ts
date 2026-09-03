import type { GetCapturedWordsParams, WordsPaginatedDataResponse } from '$words/types';
import { api } from '$lib/api-client/axios';

const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 50;

export async function httpGetCapturedWords(
	params: GetCapturedWordsParams
): Promise<WordsPaginatedDataResponse> {
	const page = params.page ?? DEFAULT_PAGE;
	const perPage = params.perPage ?? DEFAULT_PER_PAGE;
	const { language, status } = params;

	const response = await api.get<WordsPaginatedDataResponse>('/api/v1/words/captured', {
		params: {
			language,
			page,
			perPage,
			...(status !== undefined ? { status } : {})
		}
	});

	return response.data;
}
