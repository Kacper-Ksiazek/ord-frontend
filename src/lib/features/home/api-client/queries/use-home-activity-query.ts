import { createQuery } from '@tanstack/svelte-query';
import type { HomeActivityPerDay } from '$home/types';
import { httpGetHomeActivity } from '../api/http-get-home-activity';
import { homeKeys } from '../keys';

export function createHomeActivityQuery() {
	return createQuery<HomeActivityPerDay>(() => ({
		queryKey: homeKeys.activity(),
		queryFn: httpGetHomeActivity
	}));
}
