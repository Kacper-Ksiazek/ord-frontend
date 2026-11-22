<script lang="ts">
	import type { ExplainPhraseFlow } from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import type { SimilarExpression } from '$aiExplainer/shared/utils/parse-explainer-follow-up';
	import EmphasizedText from './emphasized-text.svelte';
	import SaveSimilarButton from './save-similar-button.svelte';

	interface Props {
		flow: ExplainPhraseFlow;
	}

	let { flow }: Props = $props();
</script>

{#snippet expressionCard(item: SimilarExpression, isPartial: boolean)}
	<li class="flex min-w-0 items-start gap-2 rounded-xl border border-line bg-surface px-3.5 py-3">
		<div class="flex min-w-0 flex-1 flex-col gap-1">
			<p class="min-w-0 leading-snug">
				<span class="font-semibold text-ink">{item.phrase}</span>
				{#if item.translation}
					<span class="text-sm text-ink-muted">· {item.translation}</span>
				{/if}
			</p>
			{#if item.description}
				<p class="text-sm leading-relaxed text-ink-muted">
					<EmphasizedText content={item.description} />
				</p>
			{/if}
		</div>
		{#if !isPartial}
			<div class="-my-1 -mr-1">
				<SaveSimilarButton {flow} {item} />
			</div>
		{/if}
	</li>
{/snippet}

<ul class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
	{#each flow.similarView.items as item, index (`${item.phrase}-${index}`)}
		{@render expressionCard(item, false)}
	{/each}
	{#if flow.similarView.partial}
		{@render expressionCard(flow.similarView.partial, true)}
	{/if}
</ul>
