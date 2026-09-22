<script lang="ts">
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { cn } from '$lib/utils/cn';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	interface Props {
		sectionCount?: number;
		rowsPerSection?: number;
	}

	let { sectionCount = 2, rowsPerSection = 3 }: Props = $props();

	const rowWidths = ['w-[72%]', 'w-[58%]', 'w-[64%]', 'w-[50%]'];
</script>

<div
	class="flex flex-col gap-6"
	data-testid={E2E_TEST_IDS.conversations.listSkeleton}
	aria-busy="true"
	aria-hidden="true"
>
	{#each Array.from({ length: sectionCount }, (_, sectionIndex) => sectionIndex) as sectionIndex (sectionIndex)}
		<section class="min-w-0">
			<Skeleton class="mb-2 h-3 w-20 rounded-md bg-accent-soft" />

			<ul class="flex flex-col gap-2 p-0">
				{#each Array.from({ length: rowsPerSection }, (_, rowIndex) => rowIndex) as rowIndex (rowIndex)}
					<li class="list-none">
						<div
							class="flex w-full items-stretch rounded-[10px] border border-line bg-surface px-3 py-3 sm:gap-4"
						>
							<Skeleton class="size-10 shrink-0 rounded-[10px] bg-accent-soft" />

							<div class="min-w-0 flex-1 space-y-2 pl-3">
								<Skeleton
									class={cn(
										'h-4 rounded-md bg-accent-soft',
										rowWidths[(sectionIndex * rowsPerSection + rowIndex) % rowWidths.length]
									)}
								/>
								<div class="flex flex-wrap gap-2">
									<Skeleton class="h-5 w-12 rounded-[10px] bg-accent-soft" />
									<Skeleton class="h-5 w-16 rounded-[10px] bg-accent-soft" />
									<Skeleton class="h-5 w-14 rounded-[10px] bg-accent-soft" />
								</div>
							</div>

							<Skeleton class="hidden h-3 w-10 shrink-0 rounded-md bg-accent-soft sm:block" />
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
