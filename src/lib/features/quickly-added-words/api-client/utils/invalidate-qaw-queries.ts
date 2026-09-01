import type { QueryClient } from '@tanstack/svelte-query';
import { qawKeys } from '../keys';

export function invalidateQawQueries(queryClient: QueryClient) {
	return queryClient.invalidateQueries({ queryKey: qawKeys.all });
}
