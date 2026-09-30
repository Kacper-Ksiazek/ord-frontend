import type { LanguageName } from '$words/types';
import { api } from '$lib/api-client/axios';

export interface LookupDefinedWordsRequest {
	language: LanguageName;
	sourceWords: string[];
}

export interface DefinedWordResponse {
	id: string;
	sourceWord: string;
}

export interface LookupDefinedWordsResponse {
	words: DefinedWordResponse[];
}

export async function httpPostLookupDefinedWords(
	body: LookupDefinedWordsRequest
): Promise<LookupDefinedWordsResponse> {
	const { data } = await api.post<LookupDefinedWordsResponse>('/api/v1/words/defined', body);

	return data;
}
