<script lang="ts">
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div
	class="flex h-full min-h-[480px] w-full flex-1 flex-col gap-4 p-4 lg:flex-row"
	data-testid={E2E_TEST_IDS.session.layoutSkeleton}
	aria-busy="true"
	aria-label={m['features.conversation.session.loading_title']()}
>
	<div class="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
		<div class="rounded-[10px] border border-line bg-surface p-4">
			<div class="flex items-start gap-4">
				<Skeleton class="size-12 shrink-0 rounded-full bg-accent-soft" />
				<div class="min-w-0 flex-1 space-y-2">
					<Skeleton class="h-4 w-40 rounded-md bg-accent-soft" />
					<Skeleton class="h-4 w-full max-w-md rounded-md bg-accent-soft" />
					<div class="flex gap-2 pt-1">
						<Skeleton class="h-5 w-14 rounded-[10px] bg-accent-soft" />
						<Skeleton class="h-5 w-20 rounded-[10px] bg-accent-soft" />
					</div>
				</div>
			</div>
		</div>

		<div class="flex min-h-0 flex-1 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4">
			{#each [0, 1, 2] as index (index)}
				<div class="flex gap-3 {index % 2 === 0 ? '' : 'flex-row-reverse'}">
					<Skeleton class="size-8 shrink-0 rounded-full bg-accent-soft" />
					<Skeleton class="h-16 w-[min(100%,20rem)] rounded-[10px] bg-accent-soft" />
				</div>
			{/each}
		</div>

		<Skeleton class="h-12 w-full rounded-[10px] bg-accent-soft" />
	</div>

	<div class="hidden min-h-0 w-full shrink-0 border-l border-line-subtle bg-surface p-6 lg:block lg:w-80">
		<Skeleton class="mb-4 h-6 w-32 rounded-md bg-accent-soft" />
		<Skeleton class="mb-2 h-10 w-full rounded-[10px] bg-accent-soft" />
		<Skeleton class="h-24 w-full rounded-[10px] bg-accent-soft" />
	</div>
</div>
