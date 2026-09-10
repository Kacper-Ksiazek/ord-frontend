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
	<div class="grid gap-2 sm:grid-cols-3">
		<AiSkeleton class="h-10 w-full rounded-[10px]" />
		<AiSkeleton class="h-10 w-full rounded-[10px]" />
		<AiSkeleton class="h-10 w-full rounded-[10px]" />
	</div>

	<AiSkeleton class="mt-2 h-10 w-full rounded-[10px]" />
</div>
