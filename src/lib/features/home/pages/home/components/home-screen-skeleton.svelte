<script lang="ts">
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import HomeCountCardsSkeleton from './home-count-cards-skeleton.svelte';
	import HomeRecentSectionsSkeleton from './home-recent-sections-skeleton.svelte';
	import HomeYearHeatmapSkeleton from './home-year-heatmap-skeleton.svelte';
</script>

<div class="flex flex-col gap-6" aria-busy="true" data-testid={E2E_TEST_IDS.home.skeleton}>
	<HomeCountCardsSkeleton />

	<HomeYearHeatmapSkeleton />

	<HomeRecentSectionsSkeleton />
</div>
