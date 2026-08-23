import type {
	GetQuicklyAddedWordsParams,
	QAWPaginatedDataResponse
} from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

const DEFAULT_PAGE = 0;
const DEFAULT_PER_PAGE = 50;

export async function httpGetQuicklyAddedWords(
	params: GetQuicklyAddedWordsParams = {}
): Promise<QAWPaginatedDataResponse> {
	const page = params.page ?? DEFAULT_PAGE;
	const perPage = params.perPage ?? DEFAULT_PER_PAGE;
	const { isApproved } = params;

	const response = await api.get<QAWPaginatedDataResponse>('/api/v1/quickly-added-words/', {
		params: {
			page,
			perPage,
			...(isApproved !== undefined ? { isApproved } : {})
		}
	});

	return response.data;
}
