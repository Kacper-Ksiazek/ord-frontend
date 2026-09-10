import type { components } from '@kacper-ksiazek/ord-api-types';
import type { CreateWordRequest } from '$words/types';
import { api } from '$lib/api-client/axios';

export type CreatedWord = components['schemas']['WordDTO'];

export async function httpPostCreateWord(body: CreateWordRequest): Promise<CreatedWord> {
	const { data } = await api.post<CreatedWord>('/api/v1/words', body);

	return data;
}

export async function httpPostCreateWords(body: CreateWordRequest[]): Promise<CreatedWord[]> {
	return Promise.all(body.map((request) => httpPostCreateWord(request)));
}
