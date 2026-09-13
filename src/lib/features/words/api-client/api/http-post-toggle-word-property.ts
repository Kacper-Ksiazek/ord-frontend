import type { components } from '@kacper-ksiazek/ord-api-types';
import { api } from '$lib/api-client/axios';

export type WordToggleableProperty = components['schemas']['WordToggleableProperty'];

export async function httpPostToggleWordProperty(
	wordId: string,
	property: WordToggleableProperty
): Promise<void> {
	await api.post(`/api/v1/words/${wordId}/toggle-property`, null, {
		params: { property }
	});
}
