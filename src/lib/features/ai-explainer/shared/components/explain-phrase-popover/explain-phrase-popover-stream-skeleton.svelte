<script lang="ts">
	import AiSkeleton from '$lib/components/utils/ai-skeleton.svelte';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	type Variant = 'explanation' | 'similar';

	interface Props {
		variant: Variant;
	}

	let { variant }: Props = $props();

	const ariaLabel = $derived(
		variant === 'explanation'
			? m['features.ai-explainer.explain-popover.explaining']()
			: m['features.ai-explainer.explain-popover.actions.SIMILAR_EXPRESSIONS']()
	);

	const dataTestId = $derived(
		variant === 'explanation'
			? E2E_TEST_IDS.explainPopover.explanationSkeleton
			: E2E_TEST_IDS.explainPopover.similarSkeleton
	);
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
