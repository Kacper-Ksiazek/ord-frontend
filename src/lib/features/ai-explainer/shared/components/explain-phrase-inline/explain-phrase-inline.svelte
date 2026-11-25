<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import { introStagger } from '$lib/attachments';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { authStore } from '$auth/stores';
	import {
		EXPLAIN_PHRASE_MAX,
		useExplainPhraseFlow
	} from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import type { SavedExplanation } from '$aiExplainer/types';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import { usePhraseAutocomplete } from '$aiExplainer/shared/services/use-phrase-autocomplete.svelte';
	import { ExplainPhraseCompactComposer } from '../explain-phrase-compact-composer';
	import { ExplainPhraseAnswer } from '../explain-phrase-answer';
	import { explainGreeting } from '../../utils/explain-greeting';

	interface Props {
		/** Rendered under the input (e.g. the latest history), without moving the input off-centre. */
		actions?: Snippet;
		/** Use `h1` when the block is the page's main heading. */
		greetingTag?: 'h1' | 'h2' | 'p';
		/** True while an explanation is on screen (generated or opened from the history). */
		showingAnswer?: boolean;
		/** Id of the explanation on screen (null on the empty composer). */
		activeExplanationId?: string | null;
		/** Called with the id of every explanation that is started, e.g. to give it its own URL. */
		onExplanationStarted?: (explanationId: string) => void;
		/** A saved explanation is being fetched: shows a placeholder instead of the composer. */
		loading?: boolean;
		class?: string;
	}

	let {
		actions,
		greetingTag = 'p',
		showingAnswer = $bindable(false),
		activeExplanationId = $bindable(null),
		onExplanationStarted,
		loading = false,
		class: className
	}: Props = $props();

	$effect(() => {
		showingAnswer = flow.hasResponse;
		activeExplanationId = flow.hasResponse ? flow.explanationId : null;
	});

	/** Greeting, input and recent history rise in one after the other whenever the composer appears. */
	const composerIntro = introStagger({ startDelay: 0.2, interval: 0.1 });

	const flow = useExplainPhraseFlow({
		onExplanationStarted: (id) => onExplanationStarted?.(id)
	});
	const testIds = E2E_TEST_IDS.explainInline;
	const autocomplete = usePhraseAutocomplete(() => ({
		value: flow.phrase,
		language: flow.language,
		enabled: !flow.isStreaming && !flow.isEnhancing
	}));

	function acceptSuggestion() {
		const next = autocomplete.accept();

		if (next !== null) {
			flow.phrase = next;
		}
	}
	const greeting = $derived(explainGreeting(authStore.user?.name));

	/** Clears the current answer and returns to the empty composer. */
	export function reset() {
		flow.handleReset();
	}

	/** Opens a previously saved explanation in this block. */
	export function restoreExplanation(saved: SavedExplanation) {
		flow.restore(saved);
		rootEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

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
	class={cn(
		'grid',
		// The sticky header takes 3.5rem while an answer is shown, so the block gives that height back.
		flow.hasResponse
			? 'min-h-[max(28rem,calc(100dvh-7.5rem))]'
			: 'min-h-[max(32rem,calc(100dvh-4rem))]',
		className
	)}
	data-testid={testIds.root}
	aria-label={m['features.ai-explainer.explain-popover.title']()}
>
	{#if loading && !flow.hasResponse}
		<div
			class="col-start-1 row-start-1 flex flex-col gap-4 self-center rounded-[10px] border border-line bg-surface px-6 py-8"
			aria-busy="true"
			in:fade={{ duration: 200 }}
		>
			<Skeleton class="h-7 w-2/3 rounded-md" />
			<Skeleton class="h-3 w-full rounded-full" />
			<Skeleton class="h-3 w-11/12 rounded-full" />
			<Skeleton class="h-3 w-3/4 rounded-full" />
		</div>
	{:else if !flow.hasResponse}
		<!-- Composer card: greeting and input, shown until there is an answer. -->
		<div
			class="relative col-start-1 row-start-1 grid min-h-[max(32rem,calc(100dvh-4rem))] grid-rows-[1fr_auto_1fr] overflow-hidden rounded-[10px] px-4 py-12"
			in:fade={{ duration: 250, delay: 220 }}
			out:fade={{ duration: 200 }}
			{@attach composerIntro}
		>
			<!-- Top spacer: balances the area below so the input sits at the centre of the card. -->
			<div aria-hidden="true"></div>
			<div class="mx-auto w-full max-w-2xl">
				<svelte:element
					this={greetingTag}
					data-intro
					class="pb-10 text-center text-pretty text-3xl leading-tight font-semibold tracking-tight text-ink sm:text-4xl"
				>
					{greeting}
				</svelte:element>
				<form data-intro class="w-full" onsubmit={flow.handleExplainSubmit}>
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
						onEnhance={flow.handleEnhance}
						enhancing={flow.isEnhancing}
						enhanceDisabled={!flow.canEnhance}
						enhanceAriaLabel={m['features.ai-explainer.explain-popover.enhance_aria']()}
						enhanceDataTestId={testIds.enhance}
					/>
				</form>
			</div>

			<div class="min-w-0">
				{#if flow.errorMessage}
					<p
						class="mx-auto mt-4 w-full max-w-2xl rounded-[10px] border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
						role="alert"
					>
						{flow.errorMessage}
					</p>
				{/if}
				{#if actions}
					<div data-intro class="mx-auto mt-8 w-full max-w-xl">
						{@render actions()}
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div
			class="relative col-start-1 row-start-1 self-center rounded-[10px] border border-line bg-surface px-4 py-5 sm:px-6"
			data-testid={testIds.answer}
			in:fade={{ duration: 250, delay: 220 }}
			out:fade={{ duration: 200 }}
		>
			<ExplainPhraseAnswer {flow} {testIds} />
		</div>
	{/if}
</section>

<style>
	@media (prefers-reduced-motion: no-preference) {
		[data-intro] {
			opacity: 0;
		}
	}
</style>
