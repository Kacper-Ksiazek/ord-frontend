<script lang="ts">
	import { page } from '$app/state';
	import { createHomeActivityQuery, createHomeQuery } from '$home/api-client';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import * as m from '$lib/paraglide/messages.js';
	import HomeCountCards from './components/home-count-cards.svelte';
	import HomeCountCardsSkeleton from './components/home-count-cards-skeleton.svelte';
	import HomeRecentSections from './components/home-recent-sections.svelte';
	import HomeRecentSectionsSkeleton from './components/home-recent-sections-skeleton.svelte';
	import HomeYearHeatmap from './components/home-year-heatmap.svelte';
	import HomeYearHeatmapSkeleton from './components/home-year-heatmap-skeleton.svelte';
	import { firstNameFromDisplayName, homeGreetingPeriod } from './utils/home-greeting';

	const homeQuery = createHomeQuery();
	const activityQuery = createHomeActivityQuery();
	const homeData = $derived(homeQuery.data);
	const activity = $derived(activityQuery.data);
	const greetingPeriod = homeGreetingPeriod(new Date());
	const firstName = $derived(firstNameFromDisplayName(page.data.user?.name));
	const greeting = $derived.by(() => {
		if (greetingPeriod === 'morning') {
			return m['features.home.home.greeting_morning']({ name: firstName });
		}

		if (greetingPeriod === 'afternoon') {
			return m['features.home.home.greeting_afternoon']({ name: firstName });
		}

		return m['features.home.home.greeting_evening']({ name: firstName });
	});
</script>

<svelte:head>
	<title>{m['features.home.home.page_title']()}</title>
</svelte:head>

{#if homeQuery.isError}
	<StatusPanel
		variant="error"
		header={m['features.home.home.load_error.header']()}
		description={homeQuery.error?.message ||
			m['features.home.home.load_error.description_fallback']()}
		primaryButton={{
			label: m['features.home.home.load_error.try_again'](),
			onClick: () => homeQuery.refetch()
		}}
	/>
{:else}
	<PageContentContainer class="max-w-[1440px]">
		<ContentCard data-testid={E2E_TEST_IDS.home.page}>
			<div class="flex flex-col gap-6">
				<h1 class="text-2xl font-bold tracking-tight text-ink" data-testid={E2E_TEST_IDS.home.greeting}>
					{greeting}
				</h1>

				{#if homeQuery.isPending}
					<HomeCountCardsSkeleton />
				{:else if homeData}
					<HomeCountCards home={homeData} />
				{/if}

				{#if activityQuery.isPending}
					<HomeYearHeatmapSkeleton />
				{:else if activityQuery.isError}
					<StatusPanel
						variant="error"
						header={m['features.home.home.load_error.header']()}
						description={activityQuery.error?.message ||
							m['features.home.home.load_error.description_fallback']()}
						primaryButton={{
							label: m['features.home.home.load_error.try_again'](),
							onClick: () => activityQuery.refetch()
						}}
					/>
				{:else if activity}
					<HomeYearHeatmap year={activity.year ?? 0} days={activity.days ?? []} />
				{/if}

				{#if homeQuery.isPending}
					<HomeRecentSectionsSkeleton />
				{:else if homeData}
					<HomeRecentSections
						recentWords={homeData.recentContent.words}
						recentConversations={homeData.recentContent.conversations}
					/>
				{/if}
			</div>
		</ContentCard>
	</PageContentContainer>
{/if}
