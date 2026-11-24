import { onDestroy, untrack } from 'svelte';
import { httpPostExplainPhraseAutocomplete } from '$aiExplainer/api-client/api/http-post-explain-phrase-autocomplete';
import { remainingCompletion } from '$aiExplainer/shared/utils/remaining-completion';
import { LruCache } from '$lib/utils/lru-cache';
import type { LanguageName } from '$lib/types/core/domain/languages';

/** Wait for a pause in typing before asking the model (one request per pause, not per keystroke). */
export const PHRASE_AUTOCOMPLETE_DELAY_MS = 350;
/** Matches the API's minimum prefix length. */
export const PHRASE_AUTOCOMPLETE_MIN_LENGTH = 2;
const PHRASE_AUTOCOMPLETE_MAX_LENGTH = 255;
const CACHE_LIMIT = 50;

export interface PhraseAutocompleteInput {
	value: string;
	language: LanguageName;
	/** False while the explainer streams or the input is disabled. */
	enabled: boolean;
}

/**
 * Tab-completion suggestions for the explain input. Requests are delayed until typing pauses,
 * in-flight requests are aborted when the text changes, and results are cached per prefix.
 * Typing the characters of a visible suggestion consumes it locally without a new request.
 * Failures are silent: autocomplete is a nicety and must never block typing.
 */
export function usePhraseAutocomplete(getInput: () => PhraseAutocompleteInput) {
	const cache = new LruCache<string>(CACHE_LIMIT);

	let completion = $state('');
	let suggestedFor = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;
	let controller: AbortController | undefined;
	/** Last value seen while enabled; re-enabling with unchanged text (e.g. after an explanation) must not ask again. */
	let lastValue = '';

	function cancelPending() {
		clearTimeout(timer);
		controller?.abort();
		controller = undefined;
	}

	function clear() {
		cancelPending();
		completion = '';
		suggestedFor = '';
	}

	function cacheKey(language: LanguageName, prefix: string) {
		return `${language}\u0000${prefix}`;
	}

	function show(prefix: string, next: string) {
		completion = next;
		suggestedFor = next ? prefix : '';
	}

	async function fetchCompletion(prefix: string, language: LanguageName) {
		const key = cacheKey(language, prefix);
		const cached = cache.get(key);

		if (cached !== undefined) {
			show(prefix, cached);

			return;
		}

		controller = new AbortController();

		try {
			const response = await httpPostExplainPhraseAutocomplete(
				{ prefix, language },
				controller.signal
			);
			const next = response.completion ?? '';

			cache.set(key, next);

			if (getInput().value === prefix) {
				show(prefix, next);
			}
		} catch {
			// Aborted or failed: keep typing uninterrupted, no suggestion.
		}
	}

	$effect(() => {
		const { value, language, enabled } = getInput();

		if (!enabled) {
			untrack(clear);

			return;
		}

		if (value === lastValue) {
			return;
		}

		lastValue = value;

		const rest = untrack(() =>
			completion ? remainingCompletion(suggestedFor, completion, value) : null
		);

		if (rest !== null) {
			// The user is typing along with the suggestion; keep it as is.
			return;
		}

		untrack(clear);

		const isRequestable =
			value.trim().length >= PHRASE_AUTOCOMPLETE_MIN_LENGTH &&
			value.length < PHRASE_AUTOCOMPLETE_MAX_LENGTH &&
			!value.includes('\n');

		if (!isRequestable) {
			return;
		}

		timer = setTimeout(() => {
			void fetchCompletion(value, language);
		}, PHRASE_AUTOCOMPLETE_DELAY_MS);
	});

	onDestroy(cancelPending);

	return {
		/** The part of the suggestion not typed yet, for the current input value. */
		get suggestion() {
			const { value } = getInput();

			return completion ? (remainingCompletion(suggestedFor, completion, value) ?? '') : '';
		},
		/** The full text after accepting the suggestion, or `null` when there is none. */
		accept(): string | null {
			const { value } = getInput();
			const rest = completion ? remainingCompletion(suggestedFor, completion, value) : null;

			if (!rest) {
				return null;
			}

			clear();

			return value + rest;
		},
		dismiss: clear
	};
}
