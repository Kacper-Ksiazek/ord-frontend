import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { clearAppStorage } from '$lib/utils/local-storage';
import { httpLogout } from '../api/http-logout';
import { authKeys } from '../keys';

export function createLogoutMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: httpLogout,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: authKeys.all });

			clearAppStorage();
		}
	}));
}
