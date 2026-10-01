<script lang="ts">
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
</script>

<div class="flex flex-col gap-6" aria-busy="true" data-testid={E2E_TEST_IDS.home.skeleton}>
	<div class="grid w-full grid-cols-3 gap-3">
		{#each [0, 1, 2] as card (card)}
			<div class="h-40 animate-pulse rounded-[10px] border border-line bg-accent-soft"></div>
		{/each}
	</div>
	<div class="h-36 animate-pulse rounded-[10px] border border-line bg-accent-soft"></div>
</div>
