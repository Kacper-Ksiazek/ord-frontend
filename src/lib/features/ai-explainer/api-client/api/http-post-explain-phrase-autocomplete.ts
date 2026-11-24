import type {
	ExplainPhraseAutocompleteRequest,
	ExplainPhraseAutocompleteResponse
} from '$aiExplainer/types';
import { api } from '$lib/api-client/axios';

export async function httpPostExplainPhraseAutocomplete(
	body: ExplainPhraseAutocompleteRequest,
	signal?: AbortSignal
): Promise<ExplainPhraseAutocompleteResponse> {
	const response = await api.post<ExplainPhraseAutocompleteResponse>(
		'/api/v1/ai-explainer/autocomplete',
		body,
		{ signal }
	);

	return response.data;
}
