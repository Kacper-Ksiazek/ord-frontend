import { createQuery } from '@tanstack/svelte-query';
import type { UserDTO } from '$auth/types';
import { httpGetCurrentUser } from '../api/http-get-current-user';
import { authKeys } from '../keys';

export function createCurrentUserQuery() {
	return createQuery<UserDTO>(() => ({
		queryKey: authKeys.currentUser(),
		queryFn: httpGetCurrentUser,
		staleTime: 1000 * 60 * 5,
		retry: false
	}));
}
