import { createQuery } from '@tanstack/svelte-query';
import type { SavedExplanation } from '$aiExplainer/types';
import { httpGetExplanations } from '../api/http-get-explanations';
import { explanationKeys } from '../keys';

export function createExplanationsQuery() {
	return createQuery<SavedExplanation[]>(() => ({
		queryKey: explanationKeys.all,
		queryFn: httpGetExplanations
	}));
}
