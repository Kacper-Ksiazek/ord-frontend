<script lang="ts">
	import { Dialog, Tooltip } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { onDestroy, onMount, tick } from 'svelte';
	import { afterNavigate, replaceState } from '$app/navigation';
	import { browser } from '$app/environment';
	import type { Subscription } from 'rxjs';
	import type { Observable } from 'rxjs';
	import { BookPlus, Check, Eraser, SlidersHorizontal, Sparkles, X } from 'lucide-svelte';
	import { authStore } from '$auth/stores';
	import { Button } from '$lib/components/buttons/button';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Input } from '$lib/components/forms/input';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { ExplainPhraseLanguageFlag } from '../explain-phrase-language-flag';
	import { PlayTextAudio } from '$lib/components/utils/play-text-audio';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { cn } from '$lib/utils/cn';
	import { parseEmphasisText } from '$lib/utils/text/parse-emphasis-text';
	import { highlightText, type HighlightPart } from '$lib/utils/text/highlight-segments';
	import {
		isExplainModalOpenFromLocationSearch,
		searchWithExplainModal
	} from '$lib/utils/url/modal-query';
	import type { SubmitEvent } from 'svelte/elements';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';
	import type { ExplainPhraseFollowUpAction } from '$aiExplainer/types';
	import { httpPostExplainPhrase } from '$aiExplainer/api-client/sse/http-post-explain-phrase';
	import { httpPostExplainPhraseFollowUp } from '$aiExplainer/api-client/sse/http-post-explain-phrase-follow-up';
	import { splitExplainerStream } from '../../utils/split-explainer-stream';
	import {
		parseAdditionalExamples,
		parseSimilarExpressions
	} from '../../utils/parse-explainer-follow-up';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import ExplainPhrasePopoverStreamSkeleton from './explain-phrase-popover-stream-skeleton.svelte';
	import { ExplainPhraseCompactComposer } from './explain-phrase-compact-composer';
	import { Spinner } from '$lib/components/utils/spinner';
	import { toast } from '$lib/components/utils/toast';
	import { getApiErrorMessage } from '$lib/utils/get-api-error-message';
	import {
		createCreateWordsMutation,
		createWordFillGapsMutation,
		httpPostLookupDefinedWords
	} from '$words';
	import type { SimilarExpression } from '../../utils/parse-explainer-follow-up';

	interface Props {
		isSidebarExpanded: boolean;
	}

	const PHRASE_MAX = 255;
	const CONTEXT_MAX = 2000;
	const INSTRUCTION_MAX = 500;

	type ExplainPopoverTab = 'request' | 'answer';
	type ExplainStreamTarget = 'explanation' | 'simpler' | 'examples' | 'similar';

	const LANGUAGE_OPTIONS: DropdownSelectOption<LanguageName>[] = [
		{ value: 'ENGLISH', label: 'English' },
		{ value: 'POLISH', label: 'Polish' },
		{ value: 'GERMAN', label: 'German' },
		{ value: 'FRENCH', label: 'French' },
		{ value: 'SPANISH', label: 'Spanish' },
		{ value: 'ITALIAN', label: 'Italian' },
		{ value: 'NORWEGIAN', label: 'Norwegian' },
		{ value: 'RUSSIAN', label: 'Russian' },
		{ value: 'SLOVENIAN', label: 'Slovenian' }
	];

	let { isSidebarExpanded }: Props = $props();

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
	let isStreaming = $state(false);
	let errorMessage = $state<string | null>(null);
	let streamSubscription: Subscription | undefined;
	let activeTab = $state<ExplainPopoverTab>('request');
	let requestFormAdvanced = $state(false);
	let answerScrollEl = $state<HTMLDivElement | null>(null);
	let savingSimilarKey = $state<string | null>(null);
	let definedSourceWords = $state<string[]>([]);
	let definedLookupReady = $state(false);
	let definedLookupId = 0;

	const createWordsMutation = createCreateWordsMutation();
	const fillGapsMutation = createWordFillGapsMutation();

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
		similarView.items.map((item) => item.phrase.trim()).filter((phrase) => phrase.length > 0)
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
	const explainPopoverTabs = $derived<Tab<ExplainPopoverTab>[]>([
		{
			id: 'request',
			label: m['features.ai-explainer.explain-popover.tabs.request']()
		},
		{
			id: 'answer',
			label: m['features.ai-explainer.explain-popover.tabs.answer'](),
			disabled: !hasResponse
		}
	]);
	const canExplain = $derived(
		phrase.trim().length > 0 &&
			phrase.trim().length <= PHRASE_MAX &&
			context.length <= CONTEXT_MAX &&
			customInstruction.length <= INSTRUCTION_MAX &&
			!isStreaming
	);
	const canClearPhrase = $derived(phrase.trim().length > 0 && !isStreaming);
	$effect(() => {
		if (!hasResponse && activeTab === 'answer') {
			activeTab = 'request';
		}
	});

	const answerStreamScrollKey = $derived(
		isStreaming && activeTab === 'answer'
			? `${streamTarget}:${streamedText.length}:${view.examplePartial.length}:${simplerText.length}:${extraExamplesRaw.length}:${extraExamples.partial.length}:${similarRaw.length}`
			: null
	);

	$effect(() => {
		const key = answerStreamScrollKey;

		if (!key || !answerScrollEl) {
			return;
		}

		void tick().then(() => {
			if (!answerScrollEl) {
				return;
			}

			answerScrollEl.scrollTop = answerScrollEl.scrollHeight;
		});
	});

	function emptyToNull(value: string): string | null {
		const trimmed = value.trim();

		return trimmed.length > 0 ? trimmed : null;
	}

	type ExplainerPhraseHighlight = 'phrase';

	function highlightPhraseInExample(sentence: string): HighlightPart<ExplainerPhraseHighlight>[] {
		const term = phrase.trim();

		if (!term) {
			return [{ text: sentence }];
		}

		return highlightText(sentence, [{ text: term, category: 'phrase' }]);
	}

	function actionLabel(action: ExplainPhraseFollowUpAction): string {
		switch (action) {
			case 'SIMPLER':
				return m['features.ai-explainer.explain-popover.actions.SIMPLER']();
			case 'MORE_EXAMPLES':
				return m['features.ai-explainer.explain-popover.actions.MORE_EXAMPLES']();
			case 'SIMILAR_EXPRESSIONS':
				return m['features.ai-explainer.explain-popover.actions.SIMILAR_EXPRESSIONS']();
		}
	}

	function stopStream() {
		streamSubscription?.unsubscribe();
		streamSubscription = undefined;
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

				definedLookupReady = false;
			});
	});

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

	function startStream(source: Observable<string>, target: ExplainStreamTarget) {
		stopStream();
		errorMessage = null;
		isStreaming = true;
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

		streamSubscription = source.subscribe({
			next: (chunk) => {
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
			error: () => {
				isStreaming = false;
				errorMessage = m['features.ai-explainer.explain-popover.error']();
			},
			complete: () => {
				isStreaming = false;
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
		stopStream();
		isStreaming = false;
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

	onMount(applyExplainModalFromLocation);

	afterNavigate(() => {
		applyExplainModalFromLocation();
	});

	function handleReset() {
		stopStream();
		isStreaming = false;
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

	function handleExplainSubmit(event: SubmitEvent) {
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

	onDestroy(stopStream);
</script>

{#snippet phraseLanguageOptionLeading(option: DropdownSelectOption<LanguageName>)}
	<ExplainPhraseLanguageFlag language={option.value} />
{/snippet}

{#snippet emphasizedExplainerText(content: string)}
	{#each parseEmphasisText(content) as part, index (index)}
		{#if part.emphasized}
			<span class="rounded-md bg-highlight/90 px-1 py-px font-medium text-ink">{part.text}</span>
		{:else}
			{part.text}
		{/if}
	{/each}
{/snippet}

{#snippet advancedOptionsToggle()}
	<IconButton
		icon={SlidersHorizontal}
		ariaLabel={m['features.ai-explainer.explain-popover.advanced_options_label']()}
		tooltip={m['features.ai-explainer.explain-popover.advanced_options_label']()}
		dataTestId={E2E_TEST_IDS.explainPopover.advancedToggle}
		type="OUTLINED"
		variant="TEXT"
		disabled={isStreaming}
		class={cn('h-8 w-8 shrink-0 border-none', requestFormAdvanced && 'bg-accent-soft text-ink')}
		onClick={() => {
			requestFormAdvanced = !requestFormAdvanced;
		}}
	/>
{/snippet}

{#snippet clearPhraseAction()}
	<IconButton
		icon={Eraser}
		ariaLabel={m['features.ai-explainer.explain-popover.reset']()}
		tooltip={m['features.ai-explainer.explain-popover.reset']()}
		type="OUTLINED"
		variant="TEXT"
		disabled={!canClearPhrase}
		class="h-8 w-8 shrink-0 border-none"
		onClick={() => {
			phrase = '';
		}}
	/>
{/snippet}

{#snippet saveSimilarButton(item: SimilarExpression)}
	{@const key = similarExpressionKey(item)}
	{@const isSaving = savingSimilarKey === key}
	{@const isDefined = definedSourceWords.includes(key)}
	{@const saveLabel = m['features.ai-explainer.explain-popover.save_similar']({ word: item.phrase })}
	{@const savedLabel = m['features.ai-explainer.explain-popover.save_similar_saved']({
		word: item.phrase
	})}
	{#if isSaving}
		<span class="flex size-8 shrink-0 items-center justify-center" aria-label={saveLabel}>
			<Spinner class="size-4 text-ink" />
		</span>
	{:else if !definedLookupReady}
		<span class="size-8 shrink-0" aria-hidden="true"></span>
	{:else if isDefined}
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props: triggerProps })}
					<span
						{...triggerProps}
						class={cn(
							'flex size-8 shrink-0 items-center justify-center text-ink-muted',
							triggerProps.class
						)}
						aria-label={savedLabel}
					>
						<Check class="size-4" aria-hidden="true" />
					</span>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content class="overlay-surface z-50 px-2 py-1 text-xs" sideOffset={6}>
					{savedLabel}
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	{:else}
		<IconButton
			icon={BookPlus}
			ariaLabel={saveLabel}
			tooltip={saveLabel}
			type="OUTLINED"
			variant="TEXT"
			disabled={savingSimilarKey !== null}
			class="size-8 shrink-0 border-none text-ink-muted hover:bg-accent-soft hover:text-ink disabled:opacity-60"
			iconClass="size-4"
			onClick={() => {
				void saveSimilarExpression(item);
			}}
		/>
	{/if}
{/snippet}

{#snippet explainerExampleText(sentence: string)}
	{#each highlightPhraseInExample(sentence) as part, index (index)}
		{#if part.highlight}
			<span class="font-semibold">{part.text}</span>
		{:else}
			{part.text}
		{/if}
	{/each}
{/snippet}

{#snippet explainerExampleListItem(
	example: string,
	audioId: string,
	options: { streaming?: boolean; dataTestId?: string } = {}
)}
	<li class="flex items-start gap-2.5" data-testid={options.dataTestId}>
		{#if options.streaming}
			<span class="flex size-10 shrink-0" aria-hidden="true" />
		{:else}
			<PlayTextAudio text={example} id={audioId} {language} />
		{/if}
		<span class="message-body text-base text-ink">
			{@render explainerExampleText(example)}
		</span>
	</li>
{/snippet}

{#snippet explainRequestActions()}
	<div class="flex flex-wrap items-center justify-end gap-2 pt-1">
		<Button type="OUTLINED" variant="TEXT" disabled={isStreaming} onClick={handleReset}>
			{m['features.ai-explainer.explain-popover.reset']()}
		</Button>
		<Button
			type="FILLED"
			variant="PRIMARY"
			class="min-w-24"
			dataTestId={E2E_TEST_IDS.explainPopover.submit}
			disabled={!canExplain}
			onClick={handleExplain}
		>
			<Sparkles class="size-4" aria-hidden="true" />
			{isStreaming
				? m['features.ai-explainer.explain-popover.explaining']()
				: m['features.ai-explainer.explain-popover.explain']()}
		</Button>
	</div>
{/snippet}

<button
	type="button"
	data-testid={E2E_TEST_IDS.explainPopover.trigger}
	title={m['features.ai-explainer.explain-popover.title']()}
	class={cn(
		'flex w-full items-center rounded-lg py-2 transition-colors',
		'cursor-pointer text-ink hover:bg-accent-soft hover:text-ink',
		isSidebarExpanded ? 'justify-start gap-3 px-3' : 'justify-center px-0'
	)}
	onclick={openModal}
>
	<Sparkles class="h-5 w-5 shrink-0" />
	{#if isSidebarExpanded}
		<span class="text-sm font-medium" in:fade={{ delay: 150 }}>
			{m['features.ai-explainer.explain-popover.title']()}
		</span>
	{/if}
</button>

<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-scrim backdrop-blur-sm" />
		<Dialog.Content
			data-testid={E2E_TEST_IDS.explainPopover.root}
			class="overlay-surface fixed top-1/2 left-1/2 z-50 flex h-[min(640px,calc(100vh-2rem))] w-[min(52rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-line shadow-lg"
		>
			<header class="shrink-0 border-b border-line px-5 pt-5 pb-0">
				<div class="flex items-start justify-between gap-3">
					<div class="flex min-w-0 flex-1 items-start gap-3">
						<div
							class="flex size-[54px] shrink-0 items-center justify-center rounded-[10px] bg-primary-50 text-primary-600 dark:bg-primary-900/25 dark:text-primary-400"
							aria-hidden="true"
						>
							<Sparkles class="size-6" />
						</div>
						<div class="min-w-0 flex-1">
							<Dialog.Title class="text-lg font-semibold text-ink">
								{m['features.ai-explainer.explain-popover.title']()}
							</Dialog.Title>
							<Dialog.Description class="mt-1 text-sm leading-relaxed text-ink-muted">
								{m['features.ai-explainer.explain-popover.description']()}
							</Dialog.Description>
						</div>
					</div>
					<button
						type="button"
						aria-label={m['features.ai-explainer.explain-popover.close']()}
						class="shrink-0 rounded-lg p-1.5 text-ink-subtle transition-colors hover:bg-accent-soft hover:text-ink"
						onclick={closeModal}
					>
						<X class="size-4" />
					</button>
				</div>
				{#if errorMessage}
					<p
						class="mt-3 rounded-[10px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
						role="alert"
					>
						{errorMessage}
					</p>
				{/if}

				<div class="mt-3 flex items-center justify-between gap-3 border-b border-line">
					<Tabs
						dataTestId={E2E_TEST_IDS.explainPopover.tabs}
						tabs={explainPopoverTabs}
						bind:activeTab
						activeColor="primary"
						variant="underline"
						class="!mt-0 min-w-0 flex-1 !border-0"
					/>
					{#if activeTab === 'request'}
						<div class="flex shrink-0 items-center gap-0.5 pb-1">
							{@render clearPhraseAction()}
							{@render advancedOptionsToggle()}
						</div>
					{/if}
				</div>
			</header>

			<div
				bind:this={answerScrollEl}
				class="flex min-h-0 flex-1 flex-col overflow-y-auto scroll-pb-4 px-5 py-4"
			>
				{#if activeTab === 'request'}
					{#if requestFormAdvanced}
						<form class="flex flex-col gap-3" onsubmit={handleExplainSubmit}>
							<div class="flex gap-3">
								<div class="min-w-0 flex-1 space-y-2">
									<p class="text-sm font-medium text-ink">
										{m['features.ai-explainer.explain-popover.phrase_label']()}
									</p>
									<Input
										dataTestId={E2E_TEST_IDS.explainPopover.phrase}
										ariaLabel={m['features.ai-explainer.explain-popover.phrase_label']()}
										bind:value={phrase}
										maxLength={PHRASE_MAX}
										placeholder={m['features.ai-explainer.explain-popover.phrase_placeholder']()}
										disabled={isStreaming}
									/>
								</div>

								<div class="w-[200px] shrink-0 space-y-2">
									<p class="text-sm font-medium text-ink">
										{m['features.ai-explainer.explain-popover.language_label']()}
									</p>
									<DropdownSelect
										value={language}
										options={LANGUAGE_OPTIONS}
										ariaLabel={m['features.ai-explainer.explain-popover.language_aria']()}
										optionLeading={phraseLanguageOptionLeading}
										onValueChange={(next) => {
											language = next;
										}}
									/>
								</div>
							</div>

							<div class="space-y-2">
								<p class="text-sm font-medium text-ink">
									{m['features.ai-explainer.explain-popover.context_label']()}
								</p>
								<AutoHeightTextarea
									bind:value={context}
									maxLength={CONTEXT_MAX}
									formField
									minRows={3}
									maxRows={6}
									placeholder={m['features.ai-explainer.explain-popover.context_placeholder']()}
									disabled={isStreaming}
								/>
							</div>

							<div class="space-y-2">
								<p class="text-sm font-medium text-ink">
									{m['features.ai-explainer.explain-popover.instruction_label']()}
								</p>
								<AutoHeightTextarea
									bind:value={customInstruction}
									maxLength={INSTRUCTION_MAX}
									formField
									placeholder={m['features.ai-explainer.explain-popover.instruction_placeholder']()}
									disabled={isStreaming}
								/>
							</div>

							{@render explainRequestActions()}
						</form>
					{:else}
						<div class="flex flex-1 flex-col justify-center py-10">
							<div class="mx-auto w-full max-w-lg space-y-5">
								<form onsubmit={handleExplainSubmit}>
									<ExplainPhraseCompactComposer
										bind:value={phrase}
										maxLength={PHRASE_MAX}
										placeholder={m['features.ai-explainer.explain-popover.phrase_compact_placeholder']()}
										sendAriaLabel={m['features.ai-explainer.explain-popover.explain']()}
										phraseDataTestId={E2E_TEST_IDS.explainPopover.phrase}
										sendDataTestId={E2E_TEST_IDS.explainPopover.submit}
										disabled={isStreaming}
										pending={isStreaming}
										onValueChange={(next) => {
											phrase = next;
										}}
										onSubmit={handleCompactSubmit}
									/>
								</form>
							</div>
						</div>
					{/if}
				{:else}
					<div class="space-y-4">
						{#if view.explanation || (isStreaming && streamTarget === 'explanation')}
							{#if showExplanationSkeleton}
								<ExplainPhrasePopoverStreamSkeleton variant="explanation" />
							{:else}
								<p
									data-testid={E2E_TEST_IDS.explainPopover.explanation}
									class={cn(
										'message-body text-base whitespace-pre-wrap text-ink',
										isStreaming && streamTarget === 'explanation' && 'generation-in-progress rounded-[10px]'
									)}
									aria-live="polite"
								>
									{@render emphasizedExplainerText(view.explanation)}
								</p>
							{/if}
						{:else}
							<p class="message-body text-base text-ink-muted">
								{m['features.ai-explainer.explain-popover.answer_empty']()}
							</p>
						{/if}

						{#if view.examples.length > 0 || view.examplePartial.length > 0 || showMoreExamplesContent || showFollowUpSections}
							<div class="space-y-2">
								<p class="text-sm font-medium text-ink-muted">
									{m['features.ai-explainer.explain-popover.examples_label']()}
								</p>
								{#if view.examples.length > 0 || view.examplePartial.length > 0 || showMoreExamplesContent}
									<ul class="space-y-2.5">
										{#each view.examples as example, index (index)}
											{@render explainerExampleListItem(example, `explain-example-${index}`, {
												dataTestId: E2E_TEST_IDS.explainPopover.example(index)
											})}
										{/each}
										{#if view.examplePartial}
											{@render explainerExampleListItem(
												view.examplePartial,
												`explain-example-partial-${view.examples.length}`,
												{
													streaming: isStreaming && streamTarget === 'explanation'
												}
											)}
										{/if}
										{#each extraExamples.examples as example, index (`more-${index}-${example}`)}
											{@render explainerExampleListItem(
												example,
												`explain-more-example-${view.examples.length + index}`
											)}
										{/each}
										{#if extraExamples.partial}
											{@render explainerExampleListItem(
												extraExamples.partial,
												`explain-more-example-partial-${view.examples.length + extraExamples.examples.length}`,
												{
													streaming: isStreaming && streamTarget === 'examples'
												}
											)}
										{/if}
									</ul>
								{/if}
								{#if showFollowUpSections && !showMoreExamplesContent}
									<Button
										type="OUTLINED"
										variant="TEXT"
										dataTestId={E2E_TEST_IDS.explainPopover.followUp('MORE_EXAMPLES')}
										disabled={!canTriggerFollowUp}
										onClick={() => handleFollowUp('MORE_EXAMPLES')}
									>
										<Sparkles class="size-4" aria-hidden="true" />
										{actionLabel('MORE_EXAMPLES')}
									</Button>
								{/if}
							</div>
						{/if}

						{#if showFollowUpSections}
							<div class="space-y-4" in:fade={{ delay: 200, duration: 250 }}>
								<div class="space-y-2">
									<p class="text-sm font-medium text-ink-muted">
										{m['features.ai-explainer.explain-popover.simpler_section']()}
									</p>
									{#if !showSimplerContent}
										<Button
											type="OUTLINED"
											variant="TEXT"
											dataTestId={E2E_TEST_IDS.explainPopover.followUp('SIMPLER')}
											disabled={!canTriggerFollowUp}
											onClick={() => handleFollowUp('SIMPLER')}
										>
											<Sparkles class="size-4" aria-hidden="true" />
											{actionLabel('SIMPLER')}
										</Button>
									{/if}
									{#if showSimplerContent}
										<p
											class={cn(
												'message-body text-base whitespace-pre-wrap text-ink',
												isStreaming && streamTarget === 'simpler' && 'generation-in-progress rounded-[10px]'
											)}
											aria-live="polite"
										>
											{@render emphasizedExplainerText(simplerText)}
										</p>
									{/if}
								</div>

								<div class="space-y-2">
									<p class="text-sm font-medium text-ink-muted">
										{m['features.ai-explainer.explain-popover.similar_section']()}
									</p>
									{#if !showSimilarContent}
										<Button
											type="OUTLINED"
											variant="TEXT"
											dataTestId={E2E_TEST_IDS.explainPopover.followUp('SIMILAR_EXPRESSIONS')}
											disabled={!canTriggerFollowUp}
											onClick={() => handleFollowUp('SIMILAR_EXPRESSIONS')}
										>
											<Sparkles class="size-4" aria-hidden="true" />
											{actionLabel('SIMILAR_EXPRESSIONS')}
										</Button>
									{/if}
									{#if showSimilarContent}
										{#if showSimilarSkeleton}
											<ExplainPhrasePopoverStreamSkeleton variant="similar" />
										{:else}
											<ul class="flex flex-col gap-2">
												{#each similarView.items as item, index (`${item.phrase}-${index}`)}
													<li class="list-none">
														<div
															class="flex w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-3"
														>
															<div class="flex min-w-0 flex-1 flex-col gap-2.5">
																<p class="min-w-0 text-base leading-snug">
																	<span class="font-semibold text-ink">{item.phrase}</span>
																	<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
																	<span class="text-ink-muted">{item.translation}</span>
																</p>
																<p class="text-sm leading-relaxed text-ink-muted">
																	{@render emphasizedExplainerText(item.description)}
																</p>
															</div>
															{@render saveSimilarButton(item)}
														</div>
													</li>
												{/each}
												{#if similarView.partial}
													<li class="list-none">
														<div
															class="flex w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-3"
														>
															<div class="flex min-w-0 flex-1 flex-col gap-2.5">
																<p class="min-w-0 text-base leading-snug">
																	<span class="font-semibold text-ink">
																		{similarView.partial.phrase}
																	</span>
																	{#if similarView.partial.translation}
																		<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
																		<span class="text-ink-muted">
																			{similarView.partial.translation}
																		</span>
																	{/if}
																</p>
																{#if similarView.partial.description || (similarView.partial.translation && isStreaming)}
																	<p class="text-sm leading-relaxed text-ink-muted">
																		{similarView.partial.description}
																	</p>
																{/if}
															</div>
														</div>
													</li>
												{/if}
											</ul>
										{/if}
									{/if}
								</div>
							</div>
						{/if}
					</div>
					<div class="h-4 shrink-0" aria-hidden="true"></div>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
