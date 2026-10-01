<script lang="ts">
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
</script>

<div class="flex flex-col gap-6" aria-busy="true" data-testid={E2E_TEST_IDS.home.skeleton}>
	<div class="grid w-full grid-cols-3 gap-3">
		{#each [0, 1, 2] as card (card)}
			<div class="h-40 animate-pulse rounded-[10px] border border-line bg-accent-soft"></div>
		{/each}
	</div>
	<div class="flex flex-col gap-3">
		<div class="h-6 w-40 animate-pulse rounded-[10px] bg-accent-soft"></div>
		<div class="rounded-[10px] border border-line bg-surface p-4">
			<div class="h-28 animate-pulse rounded-[10px] bg-accent-soft"></div>
		</div>
	</div>
	<div class="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-6">
		{#each [0, 1] as block (block)}
			<div class="h-52 animate-pulse rounded-[10px] border border-line bg-accent-soft"></div>
		{/each}
	</div>
</div>
