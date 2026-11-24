<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import { Sparkles, X } from 'lucide-svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import {
		EXPLAIN_PHRASE_MAX,
		type ExplainPopoverTab,
		useExplainPhraseFlow
	} from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import { usePhraseAutocomplete } from '$aiExplainer/shared/services/use-phrase-autocomplete.svelte';
	import { ExplainPhraseCompactComposer } from '../explain-phrase-compact-composer';
	import { ExplainPhraseAdvancedForm } from '../explain-phrase-advanced-form';
	import { ExplainPhraseAnswer } from '../explain-phrase-answer';
	import ExplainPhraseRequestTools from '../explain-phrase-request-tools.svelte';
	import { explainGreeting } from '../../utils/explain-greeting';
	import { authStore } from '$auth/stores';

	interface Props {
		isSidebarExpanded: boolean;
	}

	const flow = useExplainPhraseFlow();
	const testIds = E2E_TEST_IDS.explainPopover;
	const autocomplete = usePhraseAutocomplete(() => ({
		value: flow.phrase,
		language: flow.language,
		enabled: flow.isOpen && !flow.isStreaming && flow.activeTab === 'request'
	}));

	function acceptSuggestion() {
		const next = autocomplete.accept();

		if (next !== null) {
			flow.phrase = next;
		}
	}

	let { isSidebarExpanded }: Props = $props();

	let answerScrollEl = $state<HTMLDivElement | null>(null);

	const compactGreeting = $derived(explainGreeting(authStore.user?.name));

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
</script>

<button
	type="button"
	data-testid={testIds.trigger}
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
			data-testid={testIds.root}
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
						data-testid={testIds.close}
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
						dataTestId={testIds.tabs}
						tabs={explainPopoverTabs}
						bind:activeTab={flow.activeTab}
						activeColor="primary"
						variant="underline"
						class="!mt-0 min-w-0 flex-1 !border-0"
					/>
					{#if flow.activeTab === 'request'}
						<ExplainPhraseRequestTools {flow} {testIds} class="pb-1" />
					{/if}
				</div>
			</header>

			<div
				bind:this={answerScrollEl}
				class="flex min-h-0 flex-1 flex-col overflow-y-auto scroll-pb-4 px-5 py-4"
			>
				{#if flow.activeTab === 'request'}
					{#if flow.requestFormAdvanced}
						<ExplainPhraseAdvancedForm {flow} {testIds} />
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
										phraseDataTestId={testIds.phrase}
										sendDataTestId={testIds.submit}
										disabled={flow.isStreaming}
										pending={flow.isStreaming}
										onValueChange={(next) => {
											flow.phrase = next;
										}}
										onSubmit={flow.handleCompactSubmit}
										suggestion={autocomplete.suggestion}
										onAcceptSuggestion={acceptSuggestion}
										onDismissSuggestion={autocomplete.dismiss}
										suggestionHintLabel={m['features.ai-explainer.explain-popover.autocomplete_hint']()}
									/>
								</form>
							</div>
						</div>
					{/if}
				{:else}
					<ExplainPhraseAnswer {flow} {testIds} />
					<div class="h-4 shrink-0" aria-hidden="true"></div>
				{/if}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
