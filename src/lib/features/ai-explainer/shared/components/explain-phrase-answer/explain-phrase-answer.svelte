<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Sparkles } from 'lucide-svelte';
	import { PlayTextAudio } from '$lib/components/utils/play-text-audio';
	import { StreamingCaret } from '$lib/components/utils/ai-text-skeleton';
	import * as m from '$lib/paraglide/messages.js';
	import type { ExplainPhraseFollowUpAction } from '$aiExplainer/types';
	import type { ExplainPhraseFlow } from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import type { ExplainPanelTestIds } from '$aiExplainer/testing/test-ids';
	import { ExplainPhraseStreamSkeleton } from '../explain-phrase-stream-skeleton';
	import EmphasizedText from './components/emphasized-text.svelte';
	import ExampleListItem from '../explain-phrase-example-item.svelte';
	import SimilarExpressionsList from './components/similar-expressions-list.svelte';

	interface Props {
		flow: ExplainPhraseFlow;
		testIds: ExplainPanelTestIds;
	}

	let { flow, testIds }: Props = $props();

	const phrase = $derived(flow.explainedPhrase || flow.phrase.trim());
	const isStreamingExplanation = $derived(flow.isStreaming && flow.streamTarget === 'explanation');
	const isStreamingSimpler = $derived(flow.isStreaming && flow.streamTarget === 'simpler');
	const showExamples = $derived(
		flow.view.examples.length > 0 ||
			flow.view.examplePartial.length > 0 ||
			flow.showMoreExamplesContent
	);
	/** Follow-ups not used yet, offered as chips under the answer. */
	const availableFollowUps = $derived.by((): ExplainPhraseFollowUpAction[] => {
		if (!flow.showFollowUpSections) {
			return [];
		}

		const actions: ExplainPhraseFollowUpAction[] = [];

		if (!flow.showMoreExamplesContent) actions.push('MORE_EXAMPLES');
		if (!flow.showSimplerContent) actions.push('SIMPLER');
		if (!flow.showSimilarContent) actions.push('SIMILAR_EXPRESSIONS');

		return actions;
	});

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

{#snippet sectionLabel(text: string)}
	<p class="text-xs font-semibold tracking-wide text-ink-subtle uppercase">{text}</p>
{/snippet}

<article class="flex flex-col gap-6">
	{#if phrase}
		<header class="flex items-start gap-2">
			<h3 class="min-w-0 text-2xl leading-tight font-semibold tracking-tight break-words text-ink">
				{phrase}
			</h3>
			<span class="-my-0.5 shrink-0">
				<PlayTextAudio text={phrase} id="explain-phrase-headword" language={flow.language} />
			</span>
		</header>
	{/if}

	<section>
		{#if flow.showExplanationSkeleton}
			<ExplainPhraseStreamSkeleton variant="explanation" {testIds} />
		{:else if flow.view.explanation || isStreamingExplanation}
			<p
				data-testid={testIds.explanation}
				class="message-body text-base whitespace-pre-wrap text-ink"
				aria-live="polite"
				aria-busy={isStreamingExplanation}
			>
				<EmphasizedText
					content={flow.view.explanation}
				/>{#if isStreamingExplanation && !flow.view.examplePartial && flow.view.examples.length === 0}<StreamingCaret
					/>{/if}
			</p>
		{:else}
			<p class="message-body text-base text-ink-muted">
				{m['features.ai-explainer.explain-popover.answer_empty']()}
			</p>
		{/if}
	</section>

	{#if showExamples}
		<section class="flex flex-col gap-2.5">
			{@render sectionLabel(m['features.ai-explainer.explain-popover.examples_label']())}
			<ul class="flex flex-col gap-3">
				{#each flow.view.examples as example, index (index)}
					<ExampleListItem
						{example}
						{phrase}
						language={flow.language}
						audioId={`explain-example-${index}`}
						dataTestId={testIds.example(index)}
					/>
				{/each}
				{#if flow.view.examplePartial}
					<ExampleListItem
						example={flow.view.examplePartial}
						{phrase}
						language={flow.language}
						audioId={`explain-example-partial-${flow.view.examples.length}`}
						streaming={isStreamingExplanation}
					/>
				{/if}
				{#each flow.extraExamples.examples as example, index (`more-${index}-${example}`)}
					<ExampleListItem
						{example}
						{phrase}
						language={flow.language}
						audioId={`explain-more-example-${flow.view.examples.length + index}`}
					/>
				{/each}
				{#if flow.extraExamples.partial}
					<ExampleListItem
						example={flow.extraExamples.partial}
						{phrase}
						language={flow.language}
						audioId={`explain-more-example-partial-${flow.view.examples.length + flow.extraExamples.examples.length}`}
						streaming={flow.isStreaming && flow.streamTarget === 'examples'}
					/>
				{/if}
				{#if flow.isStreaming && flow.streamTarget === 'examples' && !flow.extraExamples.partial}
					<ExplainPhraseStreamSkeleton variant="more-examples" {testIds} />
				{/if}
			</ul>
		</section>
	{/if}

	{#if flow.showSimplerContent}
		<section
			class="flex flex-col gap-1.5 rounded-xl bg-accent-soft px-4 py-3.5"
			in:fade={{ duration: 200 }}
		>
			{@render sectionLabel(m['features.ai-explainer.explain-popover.simpler_section']())}
			{#if isStreamingSimpler && !flow.simplerText}
				<ExplainPhraseStreamSkeleton variant="simpler" {testIds} />
			{:else}
				<p class="message-body text-base whitespace-pre-wrap text-ink" aria-live="polite">
					<EmphasizedText content={flow.simplerText} />{#if isStreamingSimpler}<StreamingCaret />{/if}
				</p>
			{/if}
		</section>
	{/if}

	{#if flow.showSimilarContent}
		<section class="flex flex-col gap-2.5" in:fade={{ duration: 200 }}>
			{@render sectionLabel(m['features.ai-explainer.explain-popover.similar_section']())}
			{#if flow.showSimilarSkeleton}
				<ExplainPhraseStreamSkeleton variant="similar" {testIds} />
			{:else}
				<SimilarExpressionsList {flow} />
			{/if}
		</section>
	{/if}

	{#if availableFollowUps.length > 0}
		<footer
			class="flex flex-wrap items-center gap-2 border-t border-line-subtle pt-4"
			in:fade={{ delay: 150, duration: 200 }}
		>
			<span class="mr-1 text-sm text-ink-subtle">
				{m['features.ai-explainer.explain-popover.follow_up_label']()}
			</span>
			{#each availableFollowUps as action (action)}
				<button
					type="button"
					class="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-50"
					data-testid={testIds.followUp(action)}
					disabled={!flow.canTriggerFollowUp}
					onclick={() => flow.handleFollowUp(action)}
				>
					<Sparkles class="size-3.5 text-ink-muted" aria-hidden="true" />
					{actionLabel(action)}
				</button>
			{/each}
		</footer>
	{/if}
</article>
