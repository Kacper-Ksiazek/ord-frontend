<script lang="ts">
	import AiSkeleton from '$lib/components/utils/ai-skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div
	class="flex flex-col gap-6"
	data-testid={E2E_TEST_IDS.inbox.detailPendingSkeleton}
	aria-busy="true"
	aria-label={m['features.words.inbox.detail.loading']()}
>
	<section class="flex flex-col gap-2.5">
		<AiSkeleton class="h-4 w-24 rounded-md" />
		<div class="flex flex-wrap gap-2">
			<AiSkeleton class="h-7 w-16 rounded-[10px]" />
			<AiSkeleton class="h-7 w-20 rounded-[10px]" />
			<AiSkeleton class="h-7 w-14 rounded-[10px]" />
		</div>
	</section>

	<section class="flex flex-col gap-3">
		<AiSkeleton class="h-4 w-36 rounded-md" />
		<div class="rounded-xl border border-line-subtle bg-canvas px-4 py-3">
			<AiSkeleton class="h-3.5 w-full rounded-md" />
			<AiSkeleton class="mt-2 h-3.5 w-[88%] rounded-md" />
		</div>
	</section>
</div>
