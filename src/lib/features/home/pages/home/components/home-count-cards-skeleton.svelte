<script lang="ts">
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
</script>

{#snippet countCardSkeleton(dotRows: number, showTypeBar: boolean, chartTestId: string)}
	<section
		class="flex min-h-[260px] min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		aria-hidden="true"
	>
		<div class="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,7fr)] items-stretch gap-3">
			<div class="flex min-w-0 flex-col justify-between gap-2">
				<div class="h-6 w-24 max-w-full animate-pulse rounded-md bg-accent-soft"></div>
				<div class="h-9 w-16 max-w-full animate-pulse rounded-md bg-accent-soft"></div>
			</div>
			<div
				class="h-20 min-w-0 w-full p-1 animate-pulse rounded-[10px] bg-accent-soft"
				data-testid={chartTestId}
			></div>
		</div>
		{#if showTypeBar}
			<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
				<div class="flex h-2.5 w-full gap-1">
					{#each [40, 28, 18, 12, 8] as flex (flex)}
						<div
							class="h-full min-w-[3px] animate-pulse rounded-full bg-accent-soft"
							style={`flex: ${flex} 1 0`}
						></div>
					{/each}
				</div>
				<div class="flex h-4 w-full gap-2">
					{#each { length: 4 } as _, i (i)}
						<div class="h-4 w-16 animate-pulse rounded-md bg-accent-soft"></div>
					{/each}
				</div>
			</div>
		{/if}
		<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
			{#each { length: dotRows } as _, row (row)}
				<div class="flex h-5 items-center justify-between gap-3">
					<div class="h-5 w-28 animate-pulse rounded-md bg-accent-soft"></div>
					<div class="h-5 w-6 animate-pulse rounded-md bg-accent-soft"></div>
				</div>
			{/each}
		</div>
	</section>
{/snippet}

<div class="grid w-full grid-cols-3 items-stretch gap-3">
	{@render countCardSkeleton(1, true, E2E_TEST_IDS.home.wordsTrendChart)}
	{@render countCardSkeleton(3, false, E2E_TEST_IDS.home.conversationsTrendChart)}
	<section
		class="flex min-h-[260px] min-w-0 flex-col items-center justify-center rounded-[10px] border border-line bg-surface p-4"
		aria-hidden="true"
		data-testid={E2E_TEST_IDS.home.gamesCard}
	>
		<div class="flex flex-col items-center gap-6">
			<div class="size-16 animate-pulse rounded-full bg-accent-soft"></div>
			<div class="flex flex-col items-center gap-2">
				<div class="h-7 w-24 animate-pulse rounded-md bg-accent-soft"></div>
				<div class="h-4 w-44 max-w-full animate-pulse rounded-md bg-accent-soft"></div>
				<div class="h-4 w-36 max-w-full animate-pulse rounded-md bg-accent-soft"></div>
			</div>
		</div>
	</section>
</div>
