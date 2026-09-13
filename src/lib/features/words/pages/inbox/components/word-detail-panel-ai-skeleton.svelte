<script lang="ts">
	import AiSkeleton from '$lib/components/utils/ai-skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div
	class="flex flex-col gap-6 rounded-xl border border-primary-200/70 bg-primary-50/35 px-4 py-4 dark:border-primary-300/25 dark:bg-primary-900/10"
	data-testid={E2E_TEST_IDS.inbox.detailAiSkeleton}
	aria-busy="true"
	aria-label={m['features.words.inbox.detail.generate_with_ai_loading']()}
>
	<div class="flex items-center gap-2">
		<span class="size-2 shrink-0 rounded-full bg-primary-400/80 motion-safe:animate-pulse"></span>
		<p class="text-xs font-medium uppercase tracking-wide text-primary-700 dark:text-primary-300">
			{m['features.words.inbox.detail.ai_generating_label']()}
		</p>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<AiSkeleton class="h-6 w-16 rounded-[10px]" />
		<AiSkeleton class="h-6 w-24 rounded-[10px]" />
		<AiSkeleton class="h-6 w-20 rounded-[10px]" />
	</div>

	<section class="flex flex-col gap-2.5">
		<AiSkeleton class="h-4 w-24 rounded-md" />
		<div
			class="rounded-xl border border-primary-200/50 bg-surface/70 px-4 py-3 dark:border-primary-300/20"
		>
			<div class="flex flex-col gap-2">
				<AiSkeleton class="h-3.5 w-full rounded-md" />
				<AiSkeleton class="h-3.5 w-[92%] rounded-md" />
				<AiSkeleton class="h-3.5 w-[78%] rounded-md" />
			</div>
		</div>
	</section>

	<section class="flex flex-col gap-2.5">
		<AiSkeleton class="h-4 w-28 rounded-md" />
		<div class="flex flex-wrap gap-2">
			<AiSkeleton class="h-8 w-24 rounded-[10px]" />
			<AiSkeleton class="h-8 w-20 rounded-[10px]" />
			<AiSkeleton class="h-8 w-28 rounded-[10px]" />
		</div>
	</section>

	<section class="flex flex-col gap-3">
		<AiSkeleton class="h-4 w-36 rounded-md" />
		<div
			class="rounded-xl border border-primary-200/50 bg-surface/70 px-4 py-3 dark:border-primary-300/20"
		>
			<AiSkeleton class="mb-2 h-3 w-20 rounded-md" />
			<AiSkeleton class="h-3.5 w-full rounded-md" />
			<AiSkeleton class="mt-2 h-3.5 w-[84%] rounded-md" />
		</div>
	</section>
</div>
