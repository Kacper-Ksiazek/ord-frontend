import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { logout } from '../api/logout';
import { authKeys } from '../keys';

export function createLogoutMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: authKeys.all });
		}
	}));
}
