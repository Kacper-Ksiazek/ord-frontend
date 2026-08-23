import { createQuery } from '@tanstack/svelte-query';
import type {
	GetQuicklyAddedWordsParams,
	QAWPaginatedDataResponse
} from '$quicklyAddedWords/types';
import { httpGetQuicklyAddedWords } from '../api/http-get-quickly-added-words';
import { qawKeys } from '../keys';

export function createQuicklyAddedWordsQuery(
	getParams: () => GetQuicklyAddedWordsParams = () => ({})
) {
	return createQuery<QAWPaginatedDataResponse>(() => {
		const params = getParams();

		return {
			queryKey: qawKeys.list(params),
			queryFn: () => httpGetQuicklyAddedWords(params)
		};
	});
}
