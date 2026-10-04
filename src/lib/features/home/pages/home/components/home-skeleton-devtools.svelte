<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { homeSkeletonPreviewDev } from '../state/home-skeleton-preview.dev.svelte';

	let open = $state(false);

	const showSkeleton = $derived(homeSkeletonPreviewDev.preview);
</script>

{#if import.meta.env.DEV}
	<div
		data-home-skeleton-devtools
		class="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2"
	>
		<Button
			type="OUTLINED"
			variant="TEXT"
			class="pointer-events-auto !h-8 !px-3 !text-xs shadow-sm"
			dataTestId={E2E_TEST_IDS.home.skeletonDevtoolsToggle}
			onClick={() => {
				open = !open;
			}}
		>
			{open ? 'Hide home devtools' : 'Home devtools'}
		</Button>

		{#if open}
			<div
				class="pointer-events-auto overlay-surface w-[min(280px,calc(100vw-2rem))] rounded-[10px] border border-line p-3 shadow-lg"
				data-testid={E2E_TEST_IDS.home.skeletonDevtoolsPanel}
			>
				<p class="text-xs font-medium text-ink-muted">Home loading preview</p>
				<label class="mt-2 flex cursor-pointer items-center justify-between gap-3">
					<span class="text-sm text-ink">Show skeletons</span>
					<input
						type="checkbox"
						class="size-4 rounded border-line accent-ink"
						checked={showSkeleton}
						data-testid={E2E_TEST_IDS.home.skeletonDevtoolsSwitch}
						onchange={(event) => {
							homeSkeletonPreviewDev.setPreview(event.currentTarget.checked);
						}}
					/>
				</label>
				<p class="mt-2 text-xs text-ink-subtle">
					{showSkeleton
						? 'Skeleton layout (ignores loaded data).'
						: 'Live data when the home query has loaded.'}
				</p>
			</div>
		{/if}
	</div>
{/if}
