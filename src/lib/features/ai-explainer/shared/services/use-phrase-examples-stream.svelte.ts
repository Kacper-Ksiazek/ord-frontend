import { httpPostExplainPhraseFollowUp } from '$aiExplainer/api-client/sse/http-post-explain-phrase-follow-up';
import { parseAdditionalExamples } from '$aiExplainer/shared/utils/parse-explainer-follow-up';
import { buildExamplesPreviousExplanation } from '$aiExplainer/shared/utils/build-examples-previous-explanation';
import {
	PHRASE_EXAMPLES_CACHE_TTL_MS,
	phraseExamplesCacheKey
} from '$aiExplainer/shared/utils/phrase-examples-cache-key';
import { useTextStreamSubscription } from '$lib/services/use-text-stream-subscription.svelte';
import { getIdbCacheValue, setIdbCacheValue } from '$lib/utils/idb-cache';
import type { LanguageName } from '$lib/types/core/domain/languages';

export interface PhraseExamplesStreamInput {
	phrase: string;
	language: LanguageName;
	/** Short meaning of the phrase; grounds the examples in the right sense of the word. */
	definition: string;
}

/**
 * Streams fresh example sentences for a saved word using the explainer `MORE_EXAMPLES`
 * follow-up. Finished results are cached in IndexedDB for a day, so revisiting the page does not
 * call the model again; regenerating always streams new sentences and replaces the cache entry.
 * Each regenerate passes the examples shown so far so the model avoids repeating them.
 */
export function usePhraseExamplesStream(getInput: () => PhraseExamplesStreamInput) {
	const textStream = useTextStreamSubscription();

	let raw = $state('');
	let cached = $state<string[]>([]);
	let shown = $state<string[]>([]);
	let hasError = $state(false);
	let isLoadingCache = $state(false);

	const isStreaming = $derived(textStream.isStreaming);
	const view = $derived(parseAdditionalExamples(raw, [], { finalize: !isStreaming }));
	const examples = $derived(raw.length > 0 || isStreaming ? view.examples : cached);

	function cacheKey(input: PhraseExamplesStreamInput) {
		return phraseExamplesCacheKey(input.language, input.phrase);
	}

	/** Shows cached examples when fresh, otherwise generates new ones. */
	async function load() {
		const input = getInput();

		isLoadingCache = true;

		const fromCache = await getIdbCacheValue<string[]>(cacheKey(input));

		isLoadingCache = false;

		if (fromCache && fromCache.length > 0) {
			cached = fromCache;

			return;
		}

		generate();
	}

	function generate() {
		const input = getInput();
		const previous = [...shown, ...examples];

		raw = '';
		cached = [];
		hasError = false;
		shown = previous;

		textStream.start(
			httpPostExplainPhraseFollowUp({
				phrase: input.phrase,
				language: input.language,
				previousExplanation: buildExamplesPreviousExplanation(input.definition, previous),
				action: 'MORE_EXAMPLES',
				context: null
			}),
			{
				onChunk: (chunk) => {
					raw += chunk;
				},
				onError: () => {
					hasError = true;
				},
				onComplete: () => {
					const finished = parseAdditionalExamples(raw, [], { finalize: true }).examples;

					if (finished.length > 0) {
						void setIdbCacheValue(cacheKey(input), finished, PHRASE_EXAMPLES_CACHE_TTL_MS);
					}
				}
			}
		);
	}

	return {
		get examples() {
			return examples;
		},
		get partial() {
			return view.partial;
		},
		get isStreaming() {
			return isStreaming;
		},
		/** True while waiting for the cache or the model, before any sentence is available. */
		get isPending() {
			return isLoadingCache || isStreaming;
		},
		get hasError() {
			return hasError;
		},
		load,
		generate
	};
}
