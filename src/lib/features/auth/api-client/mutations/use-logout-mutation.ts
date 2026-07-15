import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { clearAppStorage } from '$lib/utils/local-storage';
import { httpDeleteLogout } from '../api/http-delete-logout';
import { authKeys } from '../keys';

export function createLogoutMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: httpDeleteLogout,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: authKeys.all });

			clearAppStorage();
		}
	}));
}
