<script lang="ts">
	import AiSkeleton from '$lib/components/utils/ai-skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		ariaLabel: string;
	}

	let { ariaLabel }: Props = $props();
</script>

<div
	class="absolute inset-0 z-10 flex flex-col overflow-hidden rounded-xl bg-canvas p-3"
	data-testid={E2E_TEST_IDS.capturePopover.fillRowOverlay}
	aria-busy="true"
	aria-label={ariaLabel}
>
	<div
		class="grid min-w-0 flex-1 gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_7.5rem_10rem]"
	>
		<AiSkeleton class="h-10 w-full rounded-[10px]" />
		<AiSkeleton class="h-10 w-full rounded-[10px]" />
		<AiSkeleton class="h-10 w-full rounded-[10px] xl:w-[7.5rem]" />
		<AiSkeleton class="h-10 w-full rounded-[10px] xl:w-[10rem]" />
	</div>

	<AiSkeleton class="mt-2 h-16 w-full rounded-[10px]" />
</div>
