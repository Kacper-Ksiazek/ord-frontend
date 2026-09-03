import type { GetCapturedWordsParams } from '$words/types';

const listParamsKey = (params: GetCapturedWordsParams) =>
	({
		language: params.language,
		page: params.page ?? 0,
		perPage: params.perPage ?? 50,
		...(params.status !== undefined ? { status: params.status } : {})
	}) as const;

export const wordCaptureKeys = {
	all: ['words', 'capture'] as const,

	overview: () => [...wordCaptureKeys.all, 'overview'] as const,

	lists: () => [...wordCaptureKeys.all, 'list'] as const,

	list: (params: GetCapturedWordsParams) =>
		[...wordCaptureKeys.lists(), listParamsKey(params)] as const
};
