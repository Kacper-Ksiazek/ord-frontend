<script lang="ts">
	import { AiTextSkeleton } from '$lib/components/utils/ai-text-skeleton';
	import type { ExplainPanelTestIds } from '$aiExplainer/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	type Variant = 'explanation' | 'simpler' | 'similar' | 'more-examples';

	interface Props {
		variant: Variant;
		testIds: ExplainPanelTestIds;
	}

	let { variant, testIds }: Props = $props();
</script>

{#if variant === 'explanation'}
	<AiTextSkeleton
		label={m['features.ai-explainer.explain-popover.explaining']()}
		lines={['100%', '97%', '92%', '58%']}
		dataTestId={testIds.explanationSkeleton}
	/>
{:else if variant === 'simpler'}
	<AiTextSkeleton lines={['100%', '84%']} />
{:else if variant === 'more-examples'}
	<!-- Rendered inside the examples <ul>, so each placeholder is a list item shaped like an example. -->
	{#each [0, 1] as slot (slot)}
		<li
			class="border-l-2 border-line pl-3"
			data-testid={slot === 0 ? testIds.moreExamplesSkeleton : undefined}
		>
			<AiTextSkeleton lines={[slot === 0 ? '88%' : '72%']} />
		</li>
	{/each}
{:else}
	<ul
		class="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
		data-testid={testIds.similarSkeleton}
		aria-busy="true"
		aria-label={m['features.ai-explainer.explain-popover.actions.SIMILAR_EXPRESSIONS']()}
	>
		{#each [0, 1] as slot (slot)}
			<li class="rounded-xl border border-line bg-surface px-3.5 py-3">
				<AiTextSkeleton size="sm" lines={['45%', '100%', '78%']} />
			</li>
		{/each}
	</ul>
{/if}
