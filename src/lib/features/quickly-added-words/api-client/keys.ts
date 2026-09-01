import type { GetQuicklyAddedWordsParams } from '$quicklyAddedWords/types';

const listParamsKey = (params: GetQuicklyAddedWordsParams) =>
	({
		page: params.page ?? 0,
		perPage: params.perPage ?? 50,
		...(params.isApproved !== undefined ? { isApproved: params.isApproved } : {})
	}) as const;

export const qawKeys = {
	all: ['quickly-added-words'] as const,

	overview: () => [...qawKeys.all, 'overview'] as const,

	lists: () => [...qawKeys.all, 'list'] as const,

	list: (params: GetQuicklyAddedWordsParams = {}) =>
		[...qawKeys.lists(), listParamsKey(params)] as const
};
