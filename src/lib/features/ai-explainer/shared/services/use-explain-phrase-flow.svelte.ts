import { afterNavigate, replaceState } from '$app/navigation';
import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { authStore } from '$auth/stores';
import { httpPostExplainPhrase } from '$aiExplainer/api-client/sse/http-post-explain-phrase';
import { httpPostExplainPhraseFollowUp } from '$aiExplainer/api-client/sse/http-post-explain-phrase-follow-up';
import type { ExplainPhraseFollowUpAction } from '$aiExplainer/types';
import {
	isExplainModalOpenFromLocationSearch,
	searchWithExplainModal
} from '$aiExplainer/shared/utils/explain-modal-url';
import {
	parseAdditionalExamples,
	parseSimilarExpressions,
	type SimilarExpression
} from '$aiExplainer/shared/utils/parse-explainer-follow-up';
import { splitExplainerStream } from '$aiExplainer/shared/utils/split-explainer-stream';
import { useTextStreamSubscription } from '$lib/services/use-text-stream-subscription.svelte';
import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
import { toast } from '$lib/components/utils/toast';
import type { LanguageName } from '$lib/types/core/domain/languages';
import * as m from '$lib/paraglide/messages.js';
import {
	createCreateWordsMutation,
	createWordFillGapsMutation,
	httpPostLookupDefinedWords
} from '$words';

export const EXPLAIN_PHRASE_MAX = 255;
export const EXPLAIN_CONTEXT_MAX = 2000;
export const EXPLAIN_INSTRUCTION_MAX = 500;

export type ExplainPopoverTab = 'request' | 'answer';
export type ExplainStreamTarget = 'explanation' | 'simpler' | 'examples' | 'similar';

export function useExplainPhraseFlow() {
	const textStream = useTextStreamSubscription();
	const createWordsMutation = createCreateWordsMutation();
	const fillGapsMutation = createWordFillGapsMutation();

	let isOpen = $state(false);
	let phrase = $state('');
	let language = $state<LanguageName>(authStore.user?.selectedLearningLanguage ?? 'ENGLISH');
	let context = $state('');
	let customInstruction = $state('');
	let streamedText = $state('');
	let simplerText = $state('');
	let extraExamplesRaw = $state('');
	let similarRaw = $state('');
	let streamTarget = $state<ExplainStreamTarget>('explanation');
	let errorMessage = $state<string | null>(null);
	let activeTab = $state<ExplainPopoverTab>('request');
	let requestFormAdvanced = $state(false);
	let savingSimilarKey = $state<string | null>(null);
	let definedSourceWords = $state<string[]>([]);
	let definedLookupReady = $state(false);
	let definedLookupId = 0;

	const isStreaming = $derived(textStream.isStreaming);
	const streamExamplesFinalized = $derived(!isStreaming);
	const view = $derived(splitExplainerStream(streamedText, streamExamplesFinalized));
	const extraExamples = $derived(
		parseAdditionalExamples(extraExamplesRaw, view.examples, {
			finalize: streamExamplesFinalized
		})
	);
	const similarView = $derived(
		parseSimilarExpressions(similarRaw, { finalize: streamExamplesFinalized })
	);
	const similarLookupPhrases = $derived(
		similarView.items.map((item) => item.phrase.trim()).filter((value) => value.length > 0)
	);
	const hasResponse = $derived(isStreaming || streamedText.trim().length > 0);
	const showFollowUpSections = $derived(
		streamedText.trim().length > 0 && (streamTarget !== 'explanation' || !isStreaming)
	);
	const canTriggerFollowUp = $derived(streamedText.trim().length > 0 && !isStreaming);
	const showSimplerContent = $derived(
		simplerText.length > 0 || (isStreaming && streamTarget === 'simpler')
	);
	const showMoreExamplesContent = $derived(
		view.examplePartial.length > 0 ||
			extraExamples.examples.length > 0 ||
			extraExamples.partial.length > 0 ||
			(isStreaming && streamTarget === 'examples')
	);
	const showSimilarContent = $derived(
		similarView.items.length > 0 ||
			similarView.partial !== null ||
			(isStreaming && streamTarget === 'similar')
	);
	const showExplanationSkeleton = $derived(
		isStreaming && streamTarget === 'explanation' && view.explanation.trim().length === 0
	);
	const showSimilarSkeleton = $derived(
		isStreaming &&
			streamTarget === 'similar' &&
			similarView.items.length === 0 &&
			similarView.partial === null
	);
	const canExplain = $derived(
		phrase.trim().length > 0 &&
			phrase.trim().length <= EXPLAIN_PHRASE_MAX &&
			context.length <= EXPLAIN_CONTEXT_MAX &&
			customInstruction.length <= EXPLAIN_INSTRUCTION_MAX &&
			!isStreaming
	);
	const canClearPhrase = $derived(phrase.trim().length > 0 && !isStreaming);

	$effect(() => {
		if (!hasResponse && activeTab === 'answer') {
			activeTab = 'request';
		}
	});

	$effect(() => {
		const phrases = similarLookupPhrases;
		const lookupLanguage = language;
		const canLookup = streamExamplesFinalized;

		if (!canLookup) {
			return;
		}

		const requestId = ++definedLookupId;

		if (phrases.length === 0) {
			definedSourceWords = [];
			definedLookupReady = true;

			return;
		}

		definedLookupReady = false;
		definedSourceWords = [];

		void httpPostLookupDefinedWords({
			language: lookupLanguage,
			sourceWords: phrases
		})
			.then((response) => {
				if (requestId !== definedLookupId) {
					return;
				}

				definedSourceWords = response.words.map((word) => word.sourceWord.trim().toLocaleLowerCase());
				definedLookupReady = true;
			})
			.catch(() => {
				if (requestId !== definedLookupId) {
					return;
				}

				definedLookupReady = true;
			});
	});

	function emptyToNull(value: string): string | null {
		const trimmed = value.trim();

		return trimmed.length > 0 ? trimmed : null;
	}

	function clearFollowUps() {
		simplerText = '';
		extraExamplesRaw = '';
		similarRaw = '';
		savingSimilarKey = null;
		definedSourceWords = [];
		definedLookupReady = false;
		definedLookupId += 1;
	}

	function similarExpressionKey(item: SimilarExpression) {
		return item.phrase.trim().toLocaleLowerCase();
	}

	function clipWordField(value: string) {
		return value.trim().slice(0, 255);
	}

	async function saveSimilarExpression(item: SimilarExpression) {
		const key = similarExpressionKey(item);

		if (!key || savingSimilarKey !== null || definedSourceWords.includes(key)) {
			return;
		}

		const sourceWord = clipWordField(item.phrase);
		const translation = clipWordField(item.translation);
		const definition = clipWordField(item.description);

		if (!sourceWord || !translation || !definition) {
			return;
		}

		savingSimilarKey = key;

		const aiToast = toast.aiProgress(
			m['components.utils.toast.ai_thinking_1'](),
			m['components.utils.toast.title_ai_pending']()
		);

		try {
			const filled = await fillGapsMutation.mutateAsync({
				language,
				items: [{ sourceWord, translation, definition }]
			});
			const result = filled.items?.[0];
			const type = result?.type;

			if (!type || result?.error) {
				aiToast.error(m['features.ai-explainer.explain-popover.save_similar_error']());

				return;
			}

			await createWordsMutation.mutateAsync([
				{
					sourceWord,
					language,
					translation,
					definition,
					type,
					extraMark: result.extraMark ?? null
				}
			]);

			definedSourceWords = [...definedSourceWords, key];
			aiToast.success(
				m['features.ai-explainer.explain-popover.save_similar_success']({ word: sourceWord })
			);
		} catch (error) {
			aiToast.error(
				getApiErrorMessage(error, m['features.ai-explainer.explain-popover.save_similar_error']())
			);
		} finally {
			savingSimilarKey = null;
		}
	}

	function startStream(
		source: ReturnType<typeof httpPostExplainPhrase>,
		target: ExplainStreamTarget
	) {
		textStream.stop();
		errorMessage = null;
		streamTarget = target;

		if (target === 'explanation') {
			streamedText = '';
			clearFollowUps();
		}

		if (target === 'simpler') {
			simplerText = '';
		}

		if (target === 'similar') {
			similarRaw = '';
		}

		textStream.start(source, {
			onChunk: (chunk) => {
				if (target === 'explanation') {
					streamedText += chunk;
				} else if (target === 'simpler') {
					simplerText += chunk;
				} else if (target === 'examples') {
					extraExamplesRaw += chunk;
				} else {
					similarRaw += chunk;
				}
			},
			onError: () => {
				errorMessage = m['features.ai-explainer.explain-popover.error']();
			}
		});
	}

	function syncExplainModalQuery(open: boolean) {
		if (!browser) {
			return;
		}

		const desired = searchWithExplainModal(window.location.search, open);
		const current = window.location.search;

		if (current === desired || (desired === '' && current === '')) {
			return;
		}

		replaceState(desired === '' ? '?' : desired, {});
	}

	function applyExplainModalFromLocation() {
		if (!browser) {
			return;
		}

		const wantsOpen = isExplainModalOpenFromLocationSearch(window.location.search);

		if (wantsOpen && !isOpen) {
			openModal({ skipUrl: true });

			return;
		}

		if (!wantsOpen && isOpen) {
			closeModal({ skipUrl: true });
		}
	}

	function openModal(options?: { skipUrl?: boolean }) {
		if (!phrase.trim()) {
			language = authStore.user?.selectedLearningLanguage ?? language;
		}

		isOpen = true;

		if (!options?.skipUrl) {
			syncExplainModalQuery(true);
		}
	}

	function closeModal(options?: { skipUrl?: boolean }) {
		textStream.stop();
		isOpen = false;

		if (!options?.skipUrl) {
			syncExplainModalQuery(false);
		}
	}

	function handleOpenChange(open: boolean) {
		if (open) {
			openModal();

			return;
		}

		closeModal();
	}

	function handleReset() {
		textStream.stop();
		activeTab = 'request';
		phrase = '';
		context = '';
		customInstruction = '';
		streamedText = '';
		clearFollowUps();
		errorMessage = null;
		language = authStore.user?.selectedLearningLanguage ?? 'ENGLISH';
		requestFormAdvanced = false;
	}

	function handleExplainSubmit(event: Event) {
		event.preventDefault();

		if (!canExplain) {
			return;
		}

		handleExplain();
	}

	function handleCompactSubmit(nextPhrase: string) {
		phrase = nextPhrase;

		if (!canExplain) {
			return;
		}

		handleExplain();
	}

	function handleExplain() {
		if (!canExplain) {
			return;
		}

		activeTab = 'answer';

		startStream(
			httpPostExplainPhrase({
				phrase: phrase.trim(),
				language,
				context: emptyToNull(context),
				customInstruction: emptyToNull(customInstruction)
			}),
			'explanation'
		);
	}

	function handleFollowUp(action: ExplainPhraseFollowUpAction) {
		if (!canTriggerFollowUp) {
			return;
		}

		activeTab = 'answer';

		const streamTargetForAction =
			action === 'SIMPLER' ? 'simpler' : action === 'MORE_EXAMPLES' ? 'examples' : 'similar';

		startStream(
			httpPostExplainPhraseFollowUp({
				phrase: phrase.trim(),
				language,
				previousExplanation: streamedText,
				action,
				context: emptyToNull(context)
			}),
			streamTargetForAction
		);
	}

	onMount(applyExplainModalFromLocation);

	afterNavigate(() => {
		applyExplainModalFromLocation();
	});

	return {
		isOpen,
		phrase,
		language,
		context,
		customInstruction,
		streamedText,
		simplerText,
		streamTarget,
		errorMessage,
		activeTab,
		requestFormAdvanced,
		savingSimilarKey,
		definedSourceWords,
		definedLookupReady,
		get isStreaming() {
			return isStreaming;
		},
		get view() {
			return view;
		},
		get extraExamples() {
			return extraExamples;
		},
		get similarView() {
			return similarView;
		},
		get hasResponse() {
			return hasResponse;
		},
		get showFollowUpSections() {
			return showFollowUpSections;
		},
		get canTriggerFollowUp() {
			return canTriggerFollowUp;
		},
		get showSimplerContent() {
			return showSimplerContent;
		},
		get showMoreExamplesContent() {
			return showMoreExamplesContent;
		},
		get showSimilarContent() {
			return showSimilarContent;
		},
		get showExplanationSkeleton() {
			return showExplanationSkeleton;
		},
		get showSimilarSkeleton() {
			return showSimilarSkeleton;
		},
		get canExplain() {
			return canExplain;
		},
		get canClearPhrase() {
			return canClearPhrase;
		},
		similarExpressionKey,
		saveSimilarExpression,
		openModal,
		closeModal,
		handleOpenChange,
		handleReset,
		handleExplainSubmit,
		handleCompactSubmit,
		handleExplain,
		handleFollowUp
	};
}
