import type { GetCapturedWordsParams } from '$quicklyAddedWords/types';

const listParamsKey = (params: GetCapturedWordsParams) =>
	({
		language: params.language,
		page: params.page ?? 0,
		perPage: params.perPage ?? 50,
		...(params.status !== undefined ? { status: params.status } : {})
	}) as const;

export const qawKeys = {
	all: ['quickly-added-words'] as const,

	overview: () => [...qawKeys.all, 'overview'] as const,

	lists: () => [...qawKeys.all, 'list'] as const,

	list: (params: GetCapturedWordsParams) => [...qawKeys.lists(), listParamsKey(params)] as const
};
