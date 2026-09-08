<script lang="ts">
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import { cn } from '$lib/utils/cn';
	import type { WordsViewMode } from '$words/types';

	interface Props {
		viewMode: WordsViewMode;
		compact?: boolean;
		rowCount?: number;
	}

	let { viewMode, compact = false, rowCount = 5 }: Props = $props();

	const isPendingView = $derived(viewMode === 'pending');
	const rowWidths = ['w-36', 'w-44', 'w-32', 'w-40', 'w-28', 'w-36', 'w-42'];
</script>

<div
	class="flex flex-col gap-6"
	data-testid={E2E_TEST_IDS.inbox.listSkeleton}
	aria-busy="true"
	aria-hidden="true"
>
	{#if !isPendingView}
		<section class="min-w-0">
			<Skeleton class="mb-2 h-3 w-16 rounded-md bg-accent-soft" />
			<ul class="flex flex-col gap-2 p-0">
				{#each Array.from({ length: rowCount }, (_, index) => index) as index (index)}
					<li class="list-none">
						<div
							class={cn(
								'flex w-full gap-2 rounded-[10px] border border-line bg-surface',
								compact ? 'items-stretch px-3 py-2.5' : 'items-stretch px-3 py-3'
							)}
						>
							<Skeleton class="size-9 shrink-0 rounded-[10px] bg-accent-soft" />

							<div class={cn('min-w-0 flex-1', compact ? 'flex flex-col gap-1' : 'flex flex-col gap-2.5')}>
								<div class="flex min-w-0 items-center gap-2">
									<Skeleton
										class={cn(
											'h-4 rounded-md bg-accent-soft',
											rowWidths[index % rowWidths.length],
											compact && 'h-3.5'
										)}
									/>
									<Skeleton class="h-5 w-12 shrink-0 rounded-[10px] bg-accent-soft" />
								</div>

								{#if compact}
									<Skeleton class="h-3.5 w-28 rounded-md bg-accent-soft" />
								{:else}
									<Skeleton class="h-3.5 w-[88%] rounded-md bg-accent-soft" />
									<Skeleton class="h-3.5 w-[72%] rounded-md bg-accent-soft" />
								{/if}
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<div class="mb-6 flex items-center gap-3">
			<Skeleton class="size-4 rounded bg-accent-soft" />
			<Skeleton class="h-4 w-28 rounded-md bg-accent-soft" />
		</div>

		<ul class="flex flex-col gap-2 p-0">
			{#each Array.from({ length: rowCount }, (_, index) => index) as index (index)}
				<li class="list-none">
					<div
						class="flex w-full items-start gap-2 rounded-[10px] border border-line bg-surface px-3 py-3"
					>
						<Skeleton class="mt-0.5 size-4 shrink-0 rounded bg-accent-soft" />

						<div class="min-w-0 flex-1 flex flex-col gap-2">
							<Skeleton class={cn('h-4 rounded-md bg-accent-soft', rowWidths[index % rowWidths.length])} />
							<Skeleton class="h-3.5 w-32 rounded-md bg-accent-soft" />
						</div>

						<div class="flex shrink-0 items-center gap-1.5 self-start">
							<Skeleton class="h-8 w-20 rounded-[10px] bg-accent-soft" />
							<Skeleton class="size-8 rounded-[10px] bg-accent-soft" />
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
