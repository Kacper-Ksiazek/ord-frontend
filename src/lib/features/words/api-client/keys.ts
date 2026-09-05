import type { GetWordsParams } from '$words/types';

const listParamsKey = (params: GetWordsParams) =>
	({
		language: params.language,
		page: params.page ?? 0,
		perPage: params.perPage ?? 50,
		...(params.hasProgress !== undefined ? { hasProgress: params.hasProgress } : {}),
		...(params.isFromUnverifiedSource !== undefined
			? { isFromUnverifiedSource: params.isFromUnverifiedSource }
			: {})
	}) as const;

export const wordCaptureKeys = {
	all: ['words', 'capture'] as const,

	overview: () => [...wordCaptureKeys.all, 'overview'] as const,

	lists: () => [...wordCaptureKeys.all, 'list'] as const,

	list: (params: GetWordsParams) => [...wordCaptureKeys.lists(), listParamsKey(params)] as const,

	details: () => [...wordCaptureKeys.all, 'detail'] as const,

	detail: (id: string) => [...wordCaptureKeys.details(), id] as const
};
