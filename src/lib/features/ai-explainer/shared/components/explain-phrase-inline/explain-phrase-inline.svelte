<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { authStore } from '$auth/stores';
	import {
		EXPLAIN_PHRASE_MAX,
		useExplainPhraseFlow
	} from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import { usePhraseAutocomplete } from '$aiExplainer/shared/services/use-phrase-autocomplete.svelte';
	import { ExplainPhraseCompactComposer } from '../explain-phrase-compact-composer';
	import { ExplainPhraseAnswer } from '../explain-phrase-answer';
	import ExplainPhraseRequestTools from '../explain-phrase-request-tools.svelte';
	import { explainGreeting } from '../../utils/explain-greeting';

	interface Props {
		/** Shortcut actions rendered under the composer (provided by the host page). */
		actions?: Snippet;
		/** Use `h1` when the block is the page's main heading. */
		greetingTag?: 'h1' | 'h2' | 'p';
		class?: string;
	}

	let { actions, greetingTag = 'p', class: className }: Props = $props();

	const flow = useExplainPhraseFlow();
	const testIds = E2E_TEST_IDS.explainInline;
	const autocomplete = usePhraseAutocomplete(() => ({
		value: flow.phrase,
		language: flow.language,
		enabled: !flow.isStreaming
	}));

	function acceptSuggestion() {
		const next = autocomplete.accept();

		if (next !== null) {
			flow.phrase = next;
		}
	}
	const greeting = $derived(explainGreeting(authStore.user?.name));

	let rootEl = $state<HTMLElement | null>(null);

	/** Lets other blocks on the page (e.g. a word card) run an explanation here. */
	export function explainPhrase(phrase: string) {
		flow.phrase = phrase;
		flow.handleExplain();
		rootEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<section
	bind:this={rootEl}
	class={cn('relative overflow-hidden rounded-[10px] border border-line bg-surface', className)}
	data-testid={testIds.root}
	aria-label={m['features.ai-explainer.explain-popover.title']()}
>
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-[28rem] overflow-hidden"
		aria-hidden="true"
	>
		<div
			class="absolute top-16 left-1/2 h-72 w-[min(760px,95%)] -translate-x-1/2 rounded-full bg-primary-500/8 blur-3xl dark:bg-primary-400/12"
		></div>
		<div
			class="absolute top-28 left-1/2 h-44 w-[min(480px,80%)] -translate-x-1/2 rounded-full bg-highlight/35 blur-2xl dark:bg-highlight/20"
		></div>
	</div>

	<div class="relative px-4 py-20 sm:px-8 sm:py-28 lg:py-32">
		<ExplainPhraseRequestTools
			{flow}
			{testIds}
			showAdvancedToggle={false}
			class="absolute top-3 right-3"
		/>

		<div class="mx-auto w-full max-w-2xl space-y-10">
			<svelte:element
				this={greetingTag}
				class="text-center text-pretty text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl"
			>
				{greeting}
			</svelte:element>
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

		{#if actions}
			<div class="mx-auto mt-8 w-full max-w-3xl">
				{@render actions()}
			</div>
		{/if}

		{#if flow.errorMessage}
			<p
				class="mx-auto mt-4 max-w-2xl rounded-[10px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
				role="alert"
			>
				{flow.errorMessage}
			</p>
		{/if}
	</div>

	{#if flow.hasResponse}
		<div
			class="relative border-t border-line px-4 py-5 sm:px-6"
			data-testid={testIds.answer}
			in:fade={{ duration: 200 }}
		>
			<ExplainPhraseAnswer {flow} {testIds} />
		</div>
	{/if}
</section>
