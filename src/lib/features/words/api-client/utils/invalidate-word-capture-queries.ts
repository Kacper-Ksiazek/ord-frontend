import type { QueryClient } from '@tanstack/svelte-query';
import { wordCaptureKeys } from '../keys';

export function invalidateWordCaptureQueries(queryClient: QueryClient) {
	return queryClient.invalidateQueries({ queryKey: wordCaptureKeys.all });
}
