import { createQuery } from '@tanstack/svelte-query';
import type { HomeResponse } from '$home/types';
import { httpGetHome } from '../api/http-get-home';
import { homeKeys } from '../keys';

export function createHomeQuery() {
	return createQuery<HomeResponse>(() => ({
		queryKey: homeKeys.summary(),
		queryFn: httpGetHome
	}));
}
