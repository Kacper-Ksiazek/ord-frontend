<script lang="ts">
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
</script>

<div
	class="mb-6 flex w-full min-w-0 flex-col gap-3 xl:flex-row"
	data-testid={E2E_TEST_IDS.conversations.activitySkeleton}
	aria-busy="true"
	aria-hidden="true"
>
	<div
		class="min-h-[120px] min-w-0 flex-1 rounded-[10px] border border-line bg-surface p-4 xl:max-w-[55%]"
	>
		<Skeleton class="mb-3 h-4 w-32 rounded-md bg-accent-soft" />
		<div class="grid grid-cols-7 gap-1.5">
			{#each Array.from({ length: 28 }, (_, index) => index) as index (index)}
				<Skeleton class="aspect-square rounded-sm bg-accent-soft" />
			{/each}
		</div>
	</div>

	<div class="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
		{#each [0, 1] as cardIndex (cardIndex)}
			<div
				class="min-h-[120px] min-w-0 flex-1 rounded-[10px] border border-line bg-surface p-4"
			>
				<Skeleton class="mb-2 h-3 w-24 rounded-md bg-accent-soft" />
				<Skeleton class="mb-4 h-8 w-16 rounded-md bg-accent-soft" />
				<Skeleton class="h-16 w-full rounded-md bg-accent-soft" />
			</div>
		{/each}
	</div>
</div>
