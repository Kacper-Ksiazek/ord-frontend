<script lang="ts">
	import { onMount } from 'svelte';
	import { RefreshCw, Sparkles } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { AiTextSkeleton } from '$lib/components/utils/ai-text-skeleton';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';
	import { usePhraseExamplesStream } from '$aiExplainer/shared/services/use-phrase-examples-stream.svelte';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import ExampleListItem from '../explain-phrase-example-item.svelte';

	interface Props {
		phrase: string;
		language: LanguageName;
		definition: string;
		/** How many sentences to show; extra ones from the model are dropped. */
		maxExamples?: number;
	}

	let { phrase, language, definition, maxExamples = 2 }: Props = $props();

	const testIds = E2E_TEST_IDS.phraseExamples;
	const stream = usePhraseExamplesStream(() => ({ phrase, language, definition }));

	let rootEl = $state<HTMLDivElement | null>(null);
	let hasStarted = $state(false);

	const isWaiting = $derived(!hasStarted || stream.isPending);
	const examples = $derived(stream.examples.slice(0, maxExamples));
	const partial = $derived(examples.length < maxExamples ? stream.partial : '');
	const placeholderCount = $derived(
		isWaiting ? Math.max(0, maxExamples - examples.length - (partial ? 1 : 0)) : 0
	);
	const skeletonSlots = $derived(Array.from({ length: placeholderCount }, (_, index) => index));

	function start() {
		if (hasStarted) {
			return;
		}

		hasStarted = true;
		void stream.load();
	}

	// Load only once the block is on screen, so off-screen carousel slides do not call the model.
	onMount(() => {
		if (!rootEl || typeof window.IntersectionObserver === 'undefined') {
			start();

			return;
		}

		const observer = new window.IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				observer.disconnect();
				start();
			}
		});

		observer.observe(rootEl);

		return () => observer.disconnect();
	});
</script>

<div bind:this={rootEl} class="flex flex-col gap-2" data-testid={testIds.root}>
	<div class="flex items-center justify-between gap-2">
		<span class="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
			<Sparkles class="size-3.5" aria-hidden="true" />
			{m['features.ai-explainer.phrase-examples.label']()}
		</span>
		<IconButton
			icon={RefreshCw}
			ariaLabel={m['features.ai-explainer.phrase-examples.regenerate']({ word: phrase })}
			tooltip={m['features.ai-explainer.phrase-examples.regenerate']({ word: phrase })}
			type="OUTLINED"
			variant="TEXT"
			disabled={isWaiting}
			dataTestId={testIds.regenerate}
			class="size-7 shrink-0 border-none text-ink-muted"
			iconClass="size-3.5"
			onClick={stream.generate}
		/>
	</div>

	{#if stream.hasError && examples.length === 0}
		<p class="rounded-[10px] bg-accent-soft px-3 py-2.5 text-sm text-ink-muted" role="alert">
			{m['features.ai-explainer.phrase-examples.error']()}
		</p>
	{:else}
		<ul class="flex flex-col gap-3" aria-live="polite" aria-busy={isWaiting}>
			{#each examples as example, index (`${index}-${example}`)}
				<ExampleListItem
					{example}
					{phrase}
					{language}
					audioId={`phrase-example-${phrase}-${index}`}
					dataTestId={testIds.item(index)}
				/>
			{/each}
			{#if partial}
				<ExampleListItem
					example={partial}
					{phrase}
					{language}
					audioId={`phrase-example-${phrase}-partial`}
					streaming
				/>
			{/if}
			{#each skeletonSlots as slot (slot)}
				<li
					class="border-l-2 border-line pl-3"
					data-testid={slot === 0 ? testIds.skeleton : undefined}
					aria-hidden="true"
				>
					<AiTextSkeleton lines={slot === 0 ? ['100%', '62%'] : ['94%', '48%']} />
				</li>
			{/each}
		</ul>
	{/if}
</div>
