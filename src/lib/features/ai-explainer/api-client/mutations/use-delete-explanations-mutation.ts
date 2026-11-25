import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { httpDeleteExplanation } from '../api/http-delete-explanation';
import { explanationKeys } from '../keys';

/** Deletes one or many saved explanations; the list is refetched whether or not every delete succeeded. */
export function createDeleteExplanationsMutation() {
	const queryClient = useQueryClient();

	return createMutation(() => ({
		mutationFn: (ids: string[]) => Promise.all(ids.map((id) => httpDeleteExplanation(id))),
		onSettled: () => queryClient.invalidateQueries({ queryKey: explanationKeys.all })
	}));
}
