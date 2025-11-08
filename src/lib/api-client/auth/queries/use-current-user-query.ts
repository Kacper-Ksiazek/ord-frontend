import { createQuery } from '@tanstack/svelte-query';
import type { UserDTO } from '$lib/types/auth';
import { getCurrentUser } from '../api/get-current-user';
import { authKeys } from '../keys';

export function createCurrentUserQuery() {
	return createQuery<UserDTO>(() => ({
		queryKey: authKeys.currentUser(),
		queryFn: getCurrentUser,
		staleTime: 1000 * 60 * 5,
		retry: false
	}));
}
