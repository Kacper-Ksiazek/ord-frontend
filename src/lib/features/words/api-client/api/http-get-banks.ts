import type { BankListItem } from '$words/types';
import { api } from '$lib/api-client/axios';

export async function httpGetBanks(): Promise<BankListItem[]> {
	const response = await api.get<BankListItem[]>('/api/v1/banks');

	return response.data;
}
