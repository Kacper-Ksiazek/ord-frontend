import type { Observable } from 'rxjs';
import type { ExplainPhraseFollowUpRequest } from '$aiExplainer/types';
import { createSSEStream } from '$lib/api-client/utils/sse';

export function httpPostExplainPhraseFollowUp(
	body: ExplainPhraseFollowUpRequest
): Observable<string> {
	return createSSEStream<string>('/api/v1/ai-explainer/explain-phrase/follow-up', {
		method: 'POST',
		body
	});
}
