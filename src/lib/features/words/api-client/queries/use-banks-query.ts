import { createQuery } from '@tanstack/svelte-query';
import { httpGetBanks } from '../api/http-get-banks';
import { wordCaptureKeys } from '../keys';

export function createBanksQuery(enabled: () => boolean = () => true) {
	return createQuery(() => ({
		queryKey: wordCaptureKeys.banks(),
		queryFn: () => httpGetBanks(),
		enabled: enabled()
	}));
}
