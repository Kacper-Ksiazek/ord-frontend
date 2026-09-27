import type { Observable } from 'rxjs';
import type { ExplainPhraseRequest } from '$aiExplainer/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function httpPostExplainPhrase(body: ExplainPhraseRequest): Observable<string> {
	return createSSEStream<string>('/api/v1/ai-explainer/explain-phrase', {
		method: 'POST',
		body
	});
}
