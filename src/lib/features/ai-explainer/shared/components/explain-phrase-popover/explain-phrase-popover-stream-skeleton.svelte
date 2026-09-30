<script lang="ts">
	import AiSkeleton from '$lib/components/utils/ai-skeleton.svelte';
	import { cn } from '$lib/utils/cn';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	type Variant = 'explanation' | 'similar' | 'more-examples';

	interface Props {
		variant: Variant;
	}

	let { variant }: Props = $props();

	const ariaLabel = $derived(
		variant === 'explanation'
			? m['features.ai-explainer.explain-popover.explaining']()
			: variant === 'more-examples'
				? m['features.ai-explainer.explain-popover.actions.MORE_EXAMPLES']()
				: m['features.ai-explainer.explain-popover.actions.SIMILAR_EXPRESSIONS']()
	);

	const dataTestId = $derived(
		variant === 'explanation'
			? E2E_TEST_IDS.explainPopover.explanationSkeleton
			: variant === 'more-examples'
				? E2E_TEST_IDS.explainPopover.moreExamplesSkeleton
				: E2E_TEST_IDS.explainPopover.similarSkeleton
	);

	const moreExampleSkeletonWidths = ['w-full', 'w-[92%]', 'w-[84%]'] as const;
</script>

{#if variant === 'explanation'}
	<div
		class="flex flex-col gap-2.5 py-0.5"
		data-testid={dataTestId}
		aria-busy="true"
		aria-label={ariaLabel}
	>
		<AiSkeleton class="h-4 w-full rounded-md" />
		<AiSkeleton class="h-4 w-[94%] rounded-md" />
		<AiSkeleton class="h-4 w-[88%] rounded-md" />
	</div>
{:else if variant === 'more-examples'}
	{#each moreExampleSkeletonWidths as width, index (index)}
		<li
			class="flex min-h-8 items-start gap-2.5"
			data-testid={index === 0 ? dataTestId : undefined}
			aria-busy="true"
			aria-label={index === 0 ? ariaLabel : undefined}
		>
			<AiSkeleton class="h-8 w-8 shrink-0 rounded-[10px]" aria-hidden="true" />
			<div class="flex min-h-8 min-w-0 flex-1 items-center">
				<AiSkeleton class={cn('h-8 rounded-md', width)} />
			</div>
		</li>
	{/each}
{:else}
	<ul class="flex flex-col gap-2" data-testid={dataTestId} aria-busy="true" aria-label={ariaLabel}>
		<li class="list-none">
			<div
				class="flex w-full items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-3"
			>
				<div class="flex min-w-0 flex-1 flex-col gap-2.5">
					<AiSkeleton class="h-5 w-[68%] rounded-md" />
					<AiSkeleton class="h-3.5 w-full rounded-md" />
					<AiSkeleton class="h-3.5 w-[84%] rounded-md" />
				</div>
				<span class="size-8 shrink-0" aria-hidden="true"></span>
			</div>
		</li>
	</ul>
{/if}
