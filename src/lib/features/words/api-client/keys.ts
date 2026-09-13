import type { GetWordOverviewParams, GetWordsParams } from '$words/types';

const listParamsKey = (params: GetWordsParams) =>
	({
		language: params.language,
		page: params.page ?? 0,
		perPage: params.perPage ?? 50
	}) as const;

export const wordCaptureKeys = {
	all: ['words', 'capture'] as const,

	overview: (params: GetWordOverviewParams) =>
		[...wordCaptureKeys.all, 'overview', params.language] as const,

	lists: () => [...wordCaptureKeys.all, 'list'] as const,

	list: (params: GetWordsParams) => [...wordCaptureKeys.lists(), listParamsKey(params)] as const,

	searches: () => [...wordCaptureKeys.all, 'search'] as const,

	search: (params: Record<string, unknown>) => [...wordCaptureKeys.searches(), params] as const,

	banks: () => [...wordCaptureKeys.all, 'banks'] as const,

	details: () => [...wordCaptureKeys.all, 'detail'] as const,

	detail: (id: string) => [...wordCaptureKeys.details(), id] as const
};
