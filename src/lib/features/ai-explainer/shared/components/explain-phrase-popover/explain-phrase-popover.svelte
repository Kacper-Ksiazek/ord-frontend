<script lang="ts">
	import { Dialog, Tooltip } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { BookPlus, Check, Eraser, SlidersHorizontal, Sparkles, X } from 'lucide-svelte';
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
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';
	import type { ExplainPhraseFollowUpAction } from '$aiExplainer/types';
	import {
		EXPLAIN_CONTEXT_MAX,
		EXPLAIN_INSTRUCTION_MAX,
		EXPLAIN_PHRASE_MAX,
		type ExplainPopoverTab,
		useExplainPhraseFlow
	} from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import type { SimilarExpression } from '../../utils/parse-explainer-follow-up';
	import ExplainPhrasePopoverStreamSkeleton from './explain-phrase-popover-stream-skeleton.svelte';
	import { ExplainPhraseCompactComposer } from './explain-phrase-compact-composer';
	import { Spinner } from '$lib/components/utils/spinner';
	import { authStore } from '$auth/stores';

	interface Props {
		isSidebarExpanded: boolean;
	}

	const flow = useExplainPhraseFlow();

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

	let answerScrollEl = $state<HTMLDivElement | null>(null);

	const compactGreetingFirstName = $derived(authStore.user?.name?.trim().split(/\s+/)[0] ?? '');
	const compactGreeting = $derived(
		compactGreetingFirstName.length > 0
			? m['features.ai-explainer.explain-popover.compact_greeting_named']({
					name: compactGreetingFirstName
				})
			: m['features.ai-explainer.explain-popover.compact_greeting']()
	);

	const explainPopoverTabs = $derived<Tab<ExplainPopoverTab>[]>([
		{
			id: 'request',
			label: m['features.ai-explainer.explain-popover.tabs.request']()
		},
		{
			id: 'answer',
			label: m['features.ai-explainer.explain-popover.tabs.answer'](),
			disabled: !flow.hasResponse
		}
	]);

	const answerStreamScrollKey = $derived(
		flow.isStreaming && flow.activeTab === 'answer'
			? `${flow.streamTarget}:${flow.streamedText.length}:${flow.view.examplePartial.length}:${flow.simplerText.length}:${flow.extraExamples.partial.length}:${flow.similarView.items.length}`
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

	type ExplainerPhraseHighlight = 'phrase';

	function highlightPhraseInExample(sentence: string): HighlightPart<ExplainerPhraseHighlight>[] {
		const term = flow.phrase.trim();

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
		disabled={flow.isStreaming}
		class={cn('h-8 w-8 shrink-0 border-none', flow.requestFormAdvanced && 'bg-accent-soft text-ink')}
		onClick={() => {
			flow.requestFormAdvanced = !flow.requestFormAdvanced;
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
		disabled={!flow.canClearPhrase}
		dataTestId={E2E_TEST_IDS.explainPopover.clearPhrase}
		class="h-8 w-8 shrink-0 border-none"
		onClick={() => {
			flow.handleReset();
		}}
	/>
{/snippet}

{#snippet saveSimilarButton(item: SimilarExpression)}
	{@const key = flow.similarExpressionKey(item)}
	{@const isSaving = flow.savingSimilarKey === key}
	{@const isDefined = flow.definedSourceWords.includes(key)}
	{@const saveLabel = m['features.ai-explainer.explain-popover.save_similar']({ word: item.phrase })}
	{@const savedLabel = m['features.ai-explainer.explain-popover.save_similar_saved']({
		word: item.phrase
	})}
	{#if isSaving}
		<span class="flex size-8 shrink-0 items-center justify-center" aria-label={saveLabel}>
			<Spinner class="size-4 text-ink" />
		</span>
	{:else if !flow.definedLookupReady}
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
			disabled={flow.savingSimilarKey !== null}
			class="size-8 shrink-0 border-none text-ink-muted hover:bg-accent-soft hover:text-ink disabled:opacity-60"
			iconClass="size-4"
			onClick={() => {
				void flow.saveSimilarExpression(item);
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
	<li class="flex min-h-8 items-start gap-2.5" data-testid={options.dataTestId}>
		{#if options.streaming}
			<span class="h-8 w-8 shrink-0" aria-hidden="true" />
		{:else}
			<PlayTextAudio text={example} id={audioId} language={flow.language} />
		{/if}
		<span class="message-body text-base text-ink">
			{@render explainerExampleText(example)}
		</span>
	</li>
{/snippet}

{#snippet explainRequestActions()}
	<div class="flex flex-wrap items-center justify-end gap-2 pt-1">
		<Button type="OUTLINED" variant="TEXT" disabled={flow.isStreaming} onClick={flow.handleReset}>
			{m['features.ai-explainer.explain-popover.reset']()}
		</Button>
		<Button
			type="FILLED"
			variant="PRIMARY"
			class="min-w-24"
			dataTestId={E2E_TEST_IDS.explainPopover.submit}
			disabled={!flow.canExplain}
			onClick={flow.handleExplain}
		>
			<Sparkles class="size-4" aria-hidden="true" />
			{flow.isStreaming
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
	onclick={() => flow.openModal()}
>
	<Sparkles class="h-5 w-5 shrink-0" />
	{#if isSidebarExpanded}
		<span class="text-sm font-medium" in:fade={{ delay: 150 }}>
			{m['features.ai-explainer.explain-popover.title']()}
		</span>
	{/if}
</button>

<Dialog.Root open={flow.isOpen} onOpenChange={flow.handleOpenChange}>
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
						data-testid={E2E_TEST_IDS.explainPopover.close}
						aria-label={m['features.ai-explainer.explain-popover.close']()}
						class="shrink-0 rounded-lg p-1.5 text-ink-subtle transition-colors hover:bg-accent-soft hover:text-ink"
						onclick={() => flow.closeModal()}
					>
						<X class="size-4" />
					</button>
				</div>
				{#if flow.errorMessage}
					<p
						class="mt-3 rounded-[10px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
						role="alert"
					>
						{flow.errorMessage}
					</p>
				{/if}

				<div class="mt-3 flex items-center justify-between gap-3 border-b border-line">
					<Tabs
						dataTestId={E2E_TEST_IDS.explainPopover.tabs}
						tabs={explainPopoverTabs}
						bind:activeTab={flow.activeTab}
						activeColor="primary"
						variant="underline"
						class="!mt-0 min-w-0 flex-1 !border-0"
					/>
					{#if flow.activeTab === 'request'}
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
				{#if flow.activeTab === 'request'}
					{#if flow.requestFormAdvanced}
						<form class="flex flex-col gap-3" onsubmit={flow.handleExplainSubmit}>
							<div class="flex gap-3">
								<div class="min-w-0 flex-1 space-y-2">
									<p class="text-sm font-medium text-ink">
										{m['features.ai-explainer.explain-popover.phrase_label']()}
									</p>
									<Input
										dataTestId={E2E_TEST_IDS.explainPopover.phrase}
										ariaLabel={m['features.ai-explainer.explain-popover.phrase_label']()}
										bind:value={flow.phrase}
										maxLength={EXPLAIN_PHRASE_MAX}
										placeholder={m['features.ai-explainer.explain-popover.phrase_placeholder']()}
										disabled={flow.isStreaming}
									/>
								</div>

								<div class="w-[200px] shrink-0 space-y-2">
									<p class="text-sm font-medium text-ink">
										{m['features.ai-explainer.explain-popover.language_label']()}
									</p>
									<DropdownSelect
										value={flow.language}
										options={LANGUAGE_OPTIONS}
										ariaLabel={m['features.ai-explainer.explain-popover.language_aria']()}
										optionLeading={phraseLanguageOptionLeading}
										onValueChange={(next) => {
											flow.language = next;
										}}
									/>
								</div>
							</div>

							<div class="space-y-2">
								<p class="text-sm font-medium text-ink">
									{m['features.ai-explainer.explain-popover.context_label']()}
								</p>
								<AutoHeightTextarea
									dataTestId={E2E_TEST_IDS.explainPopover.context}
									bind:value={flow.context}
									maxLength={EXPLAIN_CONTEXT_MAX}
									formField
									minRows={3}
									maxRows={6}
									placeholder={m['features.ai-explainer.explain-popover.context_placeholder']()}
									disabled={flow.isStreaming}
								/>
							</div>

							<div class="space-y-2">
								<p class="text-sm font-medium text-ink">
									{m['features.ai-explainer.explain-popover.instruction_label']()}
								</p>
								<AutoHeightTextarea
									dataTestId={E2E_TEST_IDS.explainPopover.customInstruction}
									bind:value={flow.customInstruction}
									maxLength={EXPLAIN_INSTRUCTION_MAX}
									formField
									placeholder={m['features.ai-explainer.explain-popover.instruction_placeholder']()}
									disabled={flow.isStreaming}
								/>
							</div>

							{@render explainRequestActions()}
						</form>
					{:else}
						<div
							class="relative flex min-h-[min(420px,100%)] flex-1 flex-col items-center justify-center py-8 sm:py-12"
						>
							<div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
								<div
									class="absolute top-1/2 left-1/2 h-[min(320px,75%)] w-[min(640px,110%)] -translate-x-1/2 -translate-y-[58%] rounded-full bg-primary-500/8 blur-3xl dark:bg-primary-400/12"
								></div>
								<div
									class="absolute top-1/2 left-1/2 h-[min(200px,50%)] w-[min(420px,85%)] -translate-x-1/2 -translate-y-[55%] rounded-full bg-highlight/35 blur-2xl dark:bg-highlight/20"
								></div>
							</div>

							<div class="relative w-full max-w-xl space-y-8 px-1">
								<p
									class="w-full text-center text-pretty text-[1.625rem] leading-snug font-medium tracking-tight text-ink sm:text-[1.75rem]"
								>
									{compactGreeting}
								</p>

								<form class="w-full" onsubmit={flow.handleExplainSubmit}>
									<ExplainPhraseCompactComposer
										bind:value={flow.phrase}
										maxLength={EXPLAIN_PHRASE_MAX}
										placeholder={m['features.ai-explainer.explain-popover.phrase_compact_placeholder']()}
										sendAriaLabel={m['features.ai-explainer.explain-popover.explain']()}
										phraseDataTestId={E2E_TEST_IDS.explainPopover.phrase}
										sendDataTestId={E2E_TEST_IDS.explainPopover.submit}
										disabled={flow.isStreaming}
										pending={flow.isStreaming}
										onValueChange={(next) => {
											flow.phrase = next;
										}}
										onSubmit={flow.handleCompactSubmit}
									/>
								</form>
							</div>
						</div>
					{/if}
				{:else}
					<div class="space-y-4">
						{#if flow.view.explanation || (flow.isStreaming && flow.streamTarget === 'explanation')}
							{#if flow.showExplanationSkeleton}
								<ExplainPhrasePopoverStreamSkeleton variant="explanation" />
							{:else}
								<p
									data-testid={E2E_TEST_IDS.explainPopover.explanation}
									class={cn(
										'message-body text-base whitespace-pre-wrap text-ink',
										flow.isStreaming &&
											flow.streamTarget === 'explanation' &&
											'generation-in-progress rounded-[10px]'
									)}
									aria-live="polite"
								>
									{@render emphasizedExplainerText(flow.view.explanation)}
								</p>
							{/if}
						{:else}
							<p class="message-body text-base text-ink-muted">
								{m['features.ai-explainer.explain-popover.answer_empty']()}
							</p>
						{/if}

						{#if flow.view.examples.length > 0 || flow.view.examplePartial.length > 0 || flow.showMoreExamplesContent || flow.showFollowUpSections}
							<div class="space-y-2">
								<p class="text-sm font-medium text-ink-muted">
									{m['features.ai-explainer.explain-popover.examples_label']()}
								</p>
								{#if flow.view.examples.length > 0 || flow.view.examplePartial.length > 0 || flow.showMoreExamplesContent}
									<ul class="space-y-2.5">
										{#each flow.view.examples as example, index (index)}
											{@render explainerExampleListItem(example, `explain-example-${index}`, {
												dataTestId: E2E_TEST_IDS.explainPopover.example(index)
											})}
										{/each}
										{#if flow.view.examplePartial}
											{@render explainerExampleListItem(
												flow.view.examplePartial,
												`explain-example-partial-${flow.view.examples.length}`,
												{
													streaming: flow.isStreaming && flow.streamTarget === 'explanation'
												}
											)}
										{/if}
										{#each flow.extraExamples.examples as example, index (`more-${index}-${example}`)}
											{@render explainerExampleListItem(
												example,
												`explain-more-example-${flow.view.examples.length + index}`
											)}
										{/each}
										{#if flow.extraExamples.partial}
											{@render explainerExampleListItem(
												flow.extraExamples.partial,
												`explain-more-example-partial-${flow.view.examples.length + flow.extraExamples.examples.length}`,
												{
													streaming: flow.isStreaming && flow.streamTarget === 'examples'
												}
											)}
										{/if}
										{#if flow.isStreaming && flow.streamTarget === 'examples'}
											<ExplainPhrasePopoverStreamSkeleton variant="more-examples" />
										{/if}
									</ul>
								{/if}
								{#if flow.showFollowUpSections && !flow.showMoreExamplesContent}
									<Button
										type="OUTLINED"
										variant="TEXT"
										dataTestId={E2E_TEST_IDS.explainPopover.followUp('MORE_EXAMPLES')}
										disabled={!flow.canTriggerFollowUp}
										onClick={() => flow.handleFollowUp('MORE_EXAMPLES')}
									>
										<Sparkles class="size-4" aria-hidden="true" />
										{actionLabel('MORE_EXAMPLES')}
									</Button>
								{/if}
							</div>
						{/if}

						{#if flow.showFollowUpSections}
							<div class="space-y-4" in:fade={{ delay: 200, duration: 250 }}>
								<div class="space-y-2">
									<p class="text-sm font-medium text-ink-muted">
										{m['features.ai-explainer.explain-popover.simpler_section']()}
									</p>
									{#if !flow.showSimplerContent}
										<Button
											type="OUTLINED"
											variant="TEXT"
											dataTestId={E2E_TEST_IDS.explainPopover.followUp('SIMPLER')}
											disabled={!flow.canTriggerFollowUp}
											onClick={() => flow.handleFollowUp('SIMPLER')}
										>
											<Sparkles class="size-4" aria-hidden="true" />
											{actionLabel('SIMPLER')}
										</Button>
									{/if}
									{#if flow.showSimplerContent}
										<p
											class={cn(
												'message-body text-base whitespace-pre-wrap text-ink',
												flow.isStreaming &&
													flow.streamTarget === 'simpler' &&
													'generation-in-progress rounded-[10px]'
											)}
											aria-live="polite"
										>
											{@render emphasizedExplainerText(flow.simplerText)}
										</p>
									{/if}
								</div>

								<div class="space-y-2">
									<p class="text-sm font-medium text-ink-muted">
										{m['features.ai-explainer.explain-popover.similar_section']()}
									</p>
									{#if !flow.showSimilarContent}
										<Button
											type="OUTLINED"
											variant="TEXT"
											dataTestId={E2E_TEST_IDS.explainPopover.followUp('SIMILAR_EXPRESSIONS')}
											disabled={!flow.canTriggerFollowUp}
											onClick={() => flow.handleFollowUp('SIMILAR_EXPRESSIONS')}
										>
											<Sparkles class="size-4" aria-hidden="true" />
											{actionLabel('SIMILAR_EXPRESSIONS')}
										</Button>
									{/if}
									{#if flow.showSimilarContent}
										{#if flow.showSimilarSkeleton}
											<ExplainPhrasePopoverStreamSkeleton variant="similar" />
										{:else}
											<ul class="flex flex-col gap-2">
												{#each flow.similarView.items as item, index (`${item.phrase}-${index}`)}
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
												{#if flow.similarView.partial}
													<li class="list-none">
														<div
															class="flex w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-3"
														>
															<div class="flex min-w-0 flex-1 flex-col gap-2.5">
																<p class="min-w-0 text-base leading-snug">
																	<span class="font-semibold text-ink">
																		{flow.similarView.partial.phrase}
																	</span>
																	{#if flow.similarView.partial.translation}
																		<span class="px-1 text-ink-subtle" aria-hidden="true">·</span>
																		<span class="text-ink-muted">
																			{flow.similarView.partial.translation}
																		</span>
																	{/if}
																</p>
																{#if flow.similarView.partial.description || (flow.similarView.partial.translation && flow.isStreaming)}
																	<p class="text-sm leading-relaxed text-ink-muted">
																		{flow.similarView.partial.description}
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
