<script lang="ts">
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
</script>

<div
	class="flex flex-col gap-6 px-6 py-5 pb-6"
	data-testid={E2E_TEST_IDS.inbox.detailSkeleton}
	aria-hidden="true"
>
	<div class="flex flex-wrap items-center gap-2">
		<Skeleton class="h-6 w-16 rounded-[10px] bg-accent-soft" />
		<Skeleton class="h-6 w-24 rounded-[10px] bg-accent-soft" />
		<Skeleton class="h-6 w-20 rounded-[10px] bg-accent-soft" />
	</div>

	<section class="flex flex-col gap-2.5">
		<Skeleton class="h-4 w-24 rounded-md bg-accent-soft" />
		<div class="rounded-xl border border-line-subtle bg-canvas px-4 py-3">
			<div class="flex flex-col gap-2">
				<Skeleton class="h-3.5 w-full rounded-md bg-accent-soft" />
				<Skeleton class="h-3.5 w-[92%] rounded-md bg-accent-soft" />
				<Skeleton class="h-3.5 w-[78%] rounded-md bg-accent-soft" />
			</div>
		</div>
	</section>

	<section class="flex flex-col gap-2.5">
		<Skeleton class="h-4 w-28 rounded-md bg-accent-soft" />
		<div class="flex flex-wrap gap-2">
			<Skeleton class="h-8 w-24 rounded-[10px] bg-accent-soft" />
			<Skeleton class="h-8 w-20 rounded-[10px] bg-accent-soft" />
			<Skeleton class="h-8 w-28 rounded-[10px] bg-accent-soft" />
		</div>
	</section>

	<section class="flex flex-col gap-3">
		<Skeleton class="h-4 w-36 rounded-md bg-accent-soft" />
		<div class="rounded-xl border border-line-subtle bg-canvas px-4 py-3">
			<Skeleton class="mb-2 h-3 w-20 rounded-md bg-accent-soft" />
			<Skeleton class="h-3.5 w-full rounded-md bg-accent-soft" />
			<Skeleton class="mt-2 h-3.5 w-[84%] rounded-md bg-accent-soft" />
		</div>
	</section>
</div>
