<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import type { Subscription } from 'rxjs';
	import type { Observable } from 'rxjs';
	import { Sparkles, X } from 'lucide-svelte';
	import { authStore } from '$auth/stores';
	import { Button } from '$lib/components/buttons/button';
	import { Input } from '$lib/components/forms/input';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { ExplainPhraseLanguageFlag } from '../explain-phrase-language-flag';
	import { PlayTextAudio } from '$lib/components/utils/play-text-audio';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { cn } from '$lib/utils/cn';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';
	import {
		EXPLAIN_PHRASE_FOLLOW_UP_ACTIONS,
		type ExplainPhraseFollowUpAction
	} from '$aiExplainer/types';
	import { httpPostExplainPhrase } from '$aiExplainer/api-client/sse/http-post-explain-phrase';
	import { httpPostExplainPhraseFollowUp } from '$aiExplainer/api-client/sse/http-post-explain-phrase-follow-up';
	import { splitExplainerStream } from '../../utils/split-explainer-stream';
	import { createMockExplainerStream } from '../../utils/mock-explainer-stream';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import type { ExplainPhraseDevtoolsSeed } from './explain-phrase-popover-devtools.constants';
	import ExplainPhrasePopoverDevtools from './explain-phrase-popover-devtools.svelte';

	interface Props {
		isSidebarExpanded: boolean;
	}

	const PHRASE_MAX = 255;
	const CONTEXT_MAX = 2000;
	const INSTRUCTION_MAX = 500;
	const PREVIOUS_EXPLANATION_MAX = 4000;

	type ExplainPopoverTab = 'request' | 'answer';

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
	let isStreaming = $state(false);
	let errorMessage = $state<string | null>(null);
	let streamSubscription: Subscription | undefined;
	let activeTab = $state<ExplainPopoverTab>('request');

	const view = $derived(splitExplainerStream(streamedText));
	const hasContext = $derived(context.trim().length > 0);
	const hasResponse = $derived(isStreaming || streamedText.trim().length > 0);
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
	const canFollowUp = $derived(streamedText.trim().length > 0 && !isStreaming);

	$effect(() => {
		if (!hasResponse && activeTab === 'answer') {
			activeTab = 'request';
		}
	});

	function emptyToNull(value: string): string | null {
		const trimmed = value.trim();

		return trimmed.length > 0 ? trimmed : null;
	}

	function actionLabel(action: ExplainPhraseFollowUpAction): string {
		switch (action) {
			case 'SIMPLER':
				return m['features.ai-explainer.explain-popover.actions.SIMPLER']();
			case 'MORE_EXAMPLES':
				return m['features.ai-explainer.explain-popover.actions.MORE_EXAMPLES']();
			case 'REGISTER':
				return m['features.ai-explainer.explain-popover.actions.REGISTER']();
			case 'SIMILAR_EXPRESSIONS':
				return m['features.ai-explainer.explain-popover.actions.SIMILAR_EXPRESSIONS']();
			case 'IN_THIS_CONTEXT':
				return m['features.ai-explainer.explain-popover.actions.IN_THIS_CONTEXT']();
		}
	}

	function stopStream() {
		streamSubscription?.unsubscribe();
		streamSubscription = undefined;
	}

	function startStream(source: Observable<string>) {
		stopStream();
		errorMessage = null;
		isStreaming = true;
		streamedText = '';

		streamSubscription = source.subscribe({
			next: (chunk) => {
				streamedText += chunk;
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

	function openModal() {
		if (!phrase.trim()) {
			language = authStore.user?.selectedLearningLanguage ?? language;
		}

		isOpen = true;
	}

	function closeModal() {
		stopStream();
		isStreaming = false;
		isOpen = false;
	}

	function handleOpenChange(open: boolean) {
		if (open) {
			isOpen = true;

			return;
		}

		closeModal();
	}

	function handleReset() {
		stopStream();
		isStreaming = false;
		activeTab = 'request';
		phrase = '';
		context = '';
		customInstruction = '';
		streamedText = '';
		errorMessage = null;
		language = authStore.user?.selectedLearningLanguage ?? 'ENGLISH';
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
			})
		);
	}

	function applyExplainPhraseSeedForDevtools(seed: ExplainPhraseDevtoolsSeed) {
		stopStream();
		isStreaming = false;
		errorMessage = null;
		phrase = seed.phrase;
		language = seed.language;
		context = seed.context ?? '';
		customInstruction = seed.customInstruction ?? '';
		streamedText = '';
		isOpen = true;
	}

	function applyMockExplanationForDevtools(text: string, options?: { stream?: boolean }) {
		stopStream();
		errorMessage = null;

		if (!phrase.trim()) {
			phrase = 'Hund';
			language = 'GERMAN';
		}

		isOpen = true;
		activeTab = 'answer';

		if (options?.stream) {
			startStream(createMockExplainerStream(text));

			return;
		}

		isStreaming = false;
		streamedText = text;
	}

	function handleFollowUp(action: ExplainPhraseFollowUpAction) {
		if (!canFollowUp) {
			return;
		}

		if (action === 'IN_THIS_CONTEXT' && !hasContext) {
			errorMessage = m['features.ai-explainer.explain-popover.context_required']();
			activeTab = 'request';

			return;
		}

		activeTab = 'answer';

		startStream(
			httpPostExplainPhraseFollowUp({
				phrase: phrase.trim(),
				language,
				previousExplanation: streamedText.slice(0, PREVIOUS_EXPLANATION_MAX),
				action,
				context: emptyToNull(context)
			})
		);
	}

	onDestroy(stopStream);
</script>

{#snippet phraseLanguageOptionLeading(option: DropdownSelectOption<LanguageName>)}
	<ExplainPhraseLanguageFlag language={option.value} />
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
			class="overlay-surface fixed top-1/2 left-1/2 z-50 flex max-h-[min(90dvh,calc(100vh-2rem))] w-[min(52rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden border border-line shadow-lg"
			onInteractOutside={(event) => {
				if (!(event.target instanceof HTMLElement)) return;

				if (event.target.closest('[data-explain-phrase-devtools]')) {
					event.preventDefault();
				}
			}}
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

				<Tabs
					dataTestId={E2E_TEST_IDS.explainPopover.tabs}
					tabs={explainPopoverTabs}
					bind:activeTab
					activeColor="primary"
					variant="underline"
					class="mt-3 border-line"
				/>
			</header>

			<div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
				{#if activeTab === 'request'}
					<div class="flex flex-col gap-3">
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
					</div>
				{:else}
					<div class="flex min-h-48 flex-col gap-3 rounded-xl border border-line bg-accent-soft/30 p-4">
						{#if view.explanation || isStreaming}
							<p
								data-testid={E2E_TEST_IDS.explainPopover.explanation}
								class="text-sm leading-relaxed whitespace-pre-wrap text-ink"
								aria-live="polite"
							>
								{view.explanation}
								{#if isStreaming && view.examples.length === 0}
									<span class="text-ink-muted" aria-hidden="true">▍</span>
								{/if}
							</p>
						{:else}
							<p class="text-sm leading-relaxed text-ink-muted">
								{m['features.ai-explainer.explain-popover.answer_empty']()}
							</p>
						{/if}

						{#if view.examples.length > 0}
							<div class="space-y-2">
								<p class="text-sm font-medium text-ink">
									{m['features.ai-explainer.explain-popover.examples_label']()}
								</p>
								<ul class="space-y-2">
									{#each view.examples as example, index (index)}
										<li
											data-testid={E2E_TEST_IDS.explainPopover.example(index)}
											class="flex items-start gap-2 text-sm leading-relaxed text-ink"
										>
											<PlayTextAudio text={example} id={`explain-example-${index}`} {language} />
											<span>{example}</span>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>

					{#if canFollowUp || (isStreaming && streamedText.length > 0)}
						<div class="mt-4 flex flex-wrap gap-2">
							{#each EXPLAIN_PHRASE_FOLLOW_UP_ACTIONS as action (action)}
								<Button
									type="OUTLINED"
									variant="TEXT"
									dataTestId={E2E_TEST_IDS.explainPopover.followUp(action)}
									disabled={!canFollowUp || (action === 'IN_THIS_CONTEXT' && !hasContext)}
									title={action === 'IN_THIS_CONTEXT' && !hasContext
										? m['features.ai-explainer.explain-popover.context_required']()
										: undefined}
									onClick={() => handleFollowUp(action)}
								>
									{actionLabel(action)}
								</Button>
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<footer class="shrink-0 border-t border-line bg-surface/80 px-5 py-3">
				<div class="flex flex-wrap items-center justify-end gap-2">
					<Button type="OUTLINED" variant="TEXT" disabled={isStreaming} onClick={handleReset}>
						{m['features.ai-explainer.explain-popover.reset']()}
					</Button>
					<Button type="OUTLINED" variant="TEXT" onClick={closeModal}>
						<X class="size-4" aria-hidden="true" />
						{m['features.ai-explainer.explain-popover.close']()}
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
			</footer>
		</Dialog.Content>
		{#if isOpen}
			<ExplainPhrasePopoverDevtools
				onApplySeed={applyExplainPhraseSeedForDevtools}
				onApplyMockExplanation={applyMockExplanationForDevtools}
				onSetError={(message) => {
					errorMessage = message;
				}}
				onResetForm={handleReset}
				onOpenModal={openModal}
			/>
		{/if}
	</Dialog.Portal>
</Dialog.Root>
