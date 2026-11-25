import { authStore } from '$auth/stores';
import { useQueryClient } from '@tanstack/svelte-query';
import { explanationKeys } from '$aiExplainer/api-client/keys';
import { httpPostEnhancePrompt } from '$aiExplainer/api-client/api/http-post-enhance-prompt';
import { httpPostSuggestActions } from '$aiExplainer/api-client/api/http-post-suggest-actions';
import { httpPostExplainPhrase } from '$aiExplainer/api-client/sse/http-post-explain-phrase';
import { httpPostExplainPhraseFollowUp } from '$aiExplainer/api-client/sse/http-post-explain-phrase-follow-up';
import type { ExplainPhraseFollowUpAction, SavedExplanation } from '$aiExplainer/types';
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
export type ExplainStreamTarget = 'explanation' | 'simpler' | 'examples' | 'similar' | 'text';

/** Follow-ups whose result is plain text shown in its own section, in display order. */
export const TEXT_FOLLOW_UP_ACTIONS = ['COMMON_MISTAKES', 'USED_WITH', 'IN_MY_LANGUAGE'] as const;
export type TextFollowUpAction = (typeof TEXT_FOLLOW_UP_ACTIONS)[number];

const MAX_REFINE_CHIPS = 4;
/** Shown when suggestions cannot be fetched: actions that fit every kind of question. */
const FALLBACK_REFINE_ACTIONS: ExplainPhraseFollowUpAction[] = ['MORE_EXAMPLES', 'SIMPLER'];

export type ExplainPhraseFlow = ReturnType<typeof useExplainPhraseFlow>;

export interface ExplainPhraseFlowOptions {
	/** Called with the new explanation's id as soon as an explanation is requested (e.g. to update the URL). */
	onExplanationStarted?: (explanationId: string) => void;
}

export function useExplainPhraseFlow(options: ExplainPhraseFlowOptions = {}) {
	const textStream = useTextStreamSubscription();
	const queryClient = useQueryClient();
	const createWordsMutation = createCreateWordsMutation();
	const fillGapsMutation = createWordFillGapsMutation();

	let phrase = $state('');
	let language = $state<LanguageName>(authStore.user?.selectedLearningLanguage ?? 'ENGLISH');
	let context = $state('');
	let customInstruction = $state('');
	let streamedText = $state('');
	/** Phrase the current answer is about; stays fixed while the user edits the input. */
	let explainedPhrase = $state('');
	let simplerText = $state('');
	let extraExamplesRaw = $state('');
	let similarRaw = $state('');
	let streamTarget = $state<ExplainStreamTarget>('explanation');
	let errorMessage = $state<string | null>(null);
	let isEnhancing = $state(false);
	/** Id the API stores the current explanation under; null until one is requested. */
	let explanationId = $state<string | null>(null);
	let extraTexts = $state<Partial<Record<TextFollowUpAction, string>>>({});
	let textTargetAction = $state<TextFollowUpAction | null>(null);
	/** Refine actions that fit the question, most useful first; null until suggestions arrive. */
	let suggestedActions = $state<ExplainPhraseFollowUpAction[] | null>(null);
	let suggestionRequestId = 0;
	let activeTab = $state<ExplainPopoverTab>('request');
	let requestFormAdvanced = $state(false);
	let savingSimilarKey = $state<string | null>(null);
	let definedSourceWords = $state<string[]>([]);
	let definedLookupReady = $state(false);
	let definedLookupId = 0;

	const isStreaming = $derived(textStream.isStreaming);
	const streamExamplesFinalized = $derived(!isStreaming);
	/** A section is finished unless it is the one currently streaming (a follow-up must not reopen the explanation). */
	const isTargetFinalized = (target: ExplainStreamTarget) => !isStreaming || streamTarget !== target;
	const view = $derived(splitExplainerStream(streamedText, isTargetFinalized('explanation')));
	const extraExamples = $derived(
		parseAdditionalExamples(extraExamplesRaw, view.examples, {
			finalize: isTargetFinalized('examples')
		})
	);
	const similarView = $derived(
		parseSimilarExpressions(similarRaw, { finalize: isTargetFinalized('similar') })
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
	const textSections = $derived(
		TEXT_FOLLOW_UP_ACTIONS.filter((action) => extraTexts[action] !== undefined).map((action) => ({
			action,
			text: extraTexts[action] ?? '',
			isStreaming: isStreaming && streamTarget === 'text' && textTargetAction === action
		}))
	);
	const usedFollowUps = $derived.by((): ExplainPhraseFollowUpAction[] => {
		const used: ExplainPhraseFollowUpAction[] = [];

		if (showSimplerContent) used.push('SIMPLER');
		if (showMoreExamplesContent) used.push('MORE_EXAMPLES');
		if (showSimilarContent) used.push('SIMILAR_EXPRESSIONS');

		for (const section of textSections) {
			used.push(section.action);
		}

		return used;
	});
	/** Suggested refine actions not used yet, capped so the row stays calm. */
	const availableFollowUps = $derived(
		showFollowUpSections && suggestedActions
			? suggestedActions.filter((action) => !usedFollowUps.includes(action)).slice(0, MAX_REFINE_CHIPS)
			: []
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
	const canClearPhrase = $derived(
		!isStreaming &&
			(phrase.trim().length > 0 ||
				context.length > 0 ||
				customInstruction.length > 0 ||
				streamedText.trim().length > 0)
	);

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
		extraTexts = {};
		textTargetAction = null;
		suggestedActions = null;
		suggestionRequestId += 1;
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

	/** The API persists the explanation (or follow-up) before the stream ends, so the list is fresh now. */
	function refreshSavedExplanations() {
		void queryClient.invalidateQueries({ queryKey: explanationKeys.all });
	}

	/** Shows a previously saved explanation, with its follow-ups, as if it had just been generated. */
	function restore(saved: SavedExplanation) {
		textStream.stop();
		clearFollowUps();
		errorMessage = null;
		phrase = '';
		language = saved.language;
		explainedPhrase = saved.phrase;
		explanationId = saved.id;
		streamedText = saved.explanation;
		simplerText = saved.followUps.SIMPLER ?? '';
		extraExamplesRaw = saved.followUps.MORE_EXAMPLES ?? '';
		similarRaw = saved.followUps.SIMILAR_EXPRESSIONS ?? '';
		extraTexts = Object.fromEntries(
			TEXT_FOLLOW_UP_ACTIONS.flatMap((action) => {
				const text = saved.followUps[action];

				return text === undefined ? [] : [[action, text]];
			})
		);
		streamTarget = 'explanation';
		activeTab = 'answer';

		if (saved.suggestedActions.length > 0) {
			suggestedActions = saved.suggestedActions;
		} else {
			void loadSuggestions();
		}
	}

	/** Asks the API which refine actions fit this question; a failure falls back to the safe subset. */
	async function loadSuggestions() {
		const requestId = ++suggestionRequestId;

		suggestedActions = null;

		try {
			const result = await httpPostSuggestActions({
				phrase: explainedPhrase,
				language,
				explanation: streamedText.slice(0, 4000),
				explanationId
			});

			if (requestId === suggestionRequestId) {
				suggestedActions = result.actions;
			}

			// The API stored the kind and emoji with this call, so the history list can pick them up.
			refreshSavedExplanations();
		} catch {
			if (requestId === suggestionRequestId) {
				suggestedActions = FALLBACK_REFINE_ACTIONS;
			}
		}
	}

	function startStream(
		source: ReturnType<typeof httpPostExplainPhrase>,
		target: ExplainStreamTarget,
		textAction?: TextFollowUpAction
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

		if (target === 'text' && textAction) {
			textTargetAction = textAction;
			extraTexts = { ...extraTexts, [textAction]: '' };
		}

		textStream.start(source, {
			onChunk: (chunk) => {
				if (target === 'explanation') {
					streamedText += chunk;
				} else if (target === 'simpler') {
					simplerText += chunk;
				} else if (target === 'examples') {
					extraExamplesRaw += chunk;
				} else if (target === 'text' && textAction) {
					extraTexts = { ...extraTexts, [textAction]: (extraTexts[textAction] ?? '') + chunk };
				} else {
					similarRaw += chunk;
				}
			},
			onComplete: () => {
				refreshSavedExplanations();

				if (target === 'explanation' && streamedText.trim().length > 0) {
					void loadSuggestions();
				}
			},
			onError: () => {
				errorMessage = m['features.ai-explainer.explain-popover.error']();
			}
		});
	}

	/** Rewrites what is typed into a clearer request and puts it back in the input for review; nothing is sent. */
	async function handleEnhance() {
		const typed = phrase.trim();

		if (!typed || isStreaming || isEnhancing) {
			return;
		}

		isEnhancing = true;
		errorMessage = null;

		try {
			const result = await httpPostEnhancePrompt({ prompt: typed, language });

			phrase = result.prompt.slice(0, EXPLAIN_PHRASE_MAX);
		} catch (error) {
			errorMessage = getApiErrorMessage(
				error,
				m['features.ai-explainer.explain-popover.enhance_error']()
			);
		} finally {
			isEnhancing = false;
		}
	}

	function handleReset() {
		textStream.stop();
		activeTab = 'request';
		phrase = '';
		context = '';
		customInstruction = '';
		streamedText = '';
		explainedPhrase = '';
		explanationId = null;
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
		explainedPhrase = phrase.trim();
		explanationId = crypto.randomUUID();
		options.onExplanationStarted?.(explanationId);

		startStream(
			httpPostExplainPhrase({
				phrase: explainedPhrase,
				language,
				context: emptyToNull(context),
				customInstruction: emptyToNull(customInstruction),
				explanationId
			}),
			'explanation'
		);

		// The question lives on as the answer's heading; the input is ready for the next one.
		phrase = '';
	}

	function handleFollowUp(action: ExplainPhraseFollowUpAction) {
		if (!canTriggerFollowUp) {
			return;
		}

		activeTab = 'answer';

		const textAction = (TEXT_FOLLOW_UP_ACTIONS as readonly string[]).includes(action)
			? (action as TextFollowUpAction)
			: undefined;
		const streamTargetForAction: ExplainStreamTarget = textAction
			? 'text'
			: action === 'SIMPLER'
				? 'simpler'
				: action === 'MORE_EXAMPLES'
					? 'examples'
					: 'similar';

		startStream(
			httpPostExplainPhraseFollowUp({
				phrase: explainedPhrase,
				language,
				previousExplanation: streamedText,
				action,
				context: emptyToNull(context),
				explanationId
			}),
			streamTargetForAction,
			textAction
		);
	}

	return {
		get phrase() {
			return phrase;
		},
		set phrase(next) {
			phrase = next;
		},
		get language() {
			return language;
		},
		set language(next) {
			language = next;
		},
		get context() {
			return context;
		},
		set context(next) {
			context = next;
		},
		get customInstruction() {
			return customInstruction;
		},
		set customInstruction(next) {
			customInstruction = next;
		},
		get streamedText() {
			return streamedText;
		},
		get explainedPhrase() {
			return explainedPhrase;
		},
		get simplerText() {
			return simplerText;
		},
		get streamTarget() {
			return streamTarget;
		},
		get explanationId() {
			return explanationId;
		},
		get isEnhancing() {
			return isEnhancing;
		},
		get canEnhance() {
			return phrase.trim().length > 0 && !isStreaming && !isEnhancing;
		},
		get errorMessage() {
			return errorMessage;
		},
		get activeTab() {
			return activeTab;
		},
		set activeTab(next) {
			activeTab = next;
		},
		get requestFormAdvanced() {
			return requestFormAdvanced;
		},
		set requestFormAdvanced(next) {
			requestFormAdvanced = next;
		},
		get savingSimilarKey() {
			return savingSimilarKey;
		},
		get definedSourceWords() {
			return definedSourceWords;
		},
		get definedLookupReady() {
			return definedLookupReady;
		},
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
		get textSections() {
			return textSections;
		},
		get availableFollowUps() {
			return availableFollowUps;
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
		handleEnhance,
		handleReset,
		handleExplainSubmit,
		handleCompactSubmit,
		handleExplain,
		restore,
		handleFollowUp
	};
}
