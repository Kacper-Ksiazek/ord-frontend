import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { clearAppStorage } from '$lib/utils/local-storage';
import { logout } from '../api/logout';
import { authKeys } from '../keys';

export function createLogoutMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: logout,
		onSuccess: () => {
			// Clear TanStack Query cache
			queryClient.removeQueries({ queryKey: authKeys.all });

			// Clear localStorage
			clearAppStorage();
		}
	}));
}
