<script lang="ts">
	import {
		createQawOverviewQuery,
		createQuicklyAddedWordsQuery
	} from '$quicklyAddedWords/api-client';
	import { authStore } from '$auth/stores';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import QawList from './components/qaw-list.svelte';
	import QawOverviewStats from './components/qaw-overview-stats.svelte';
	import type { QawListApprovalFilter } from '$quicklyAddedWords/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$quicklyAddedWords/testing/test-ids';

	const PER_PAGE = 50;

	let page = $state(0);
	let approvalFilter = $state<QawListApprovalFilter>('all');
	let selectedQawIds = $state<string[]>([]);
	let listScrollContainer = $state<HTMLDivElement | undefined>();

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage);

	const overviewQuery = createQawOverviewQuery();
	const qawQuery = createQuicklyAddedWordsQuery(() => {
		if (!learningLanguage) {
			return null;
		}

		return {
			language: learningLanguage,
			page,
			perPage: PER_PAGE,
			...(approvalFilter === 'approved'
				? { status: 'ACTIVE' as const }
				: approvalFilter === 'pending'
					? { status: 'CAPTURED' as const }
					: {})
		};
	});

	function clearSelection() {
		selectedQawIds = [];
	}

	function handlePageChange(nextPage: number) {
		page = nextPage;
		clearSelection();
	}

	function handleApprovalFilterChange(filter: QawListApprovalFilter) {
		approvalFilter = filter;
		page = 0;
		clearSelection();
		listScrollContainer?.scrollTo({ top: 0 });
	}
</script>

<svelte:head>
	<title>{m['features.quickly-added-words.list.header.title']()}</title>
</svelte:head>

<PageContentContainer>
	<ContentCard class="flex min-h-0 flex-1 flex-col" data-testid={E2E_TEST_IDS.list.page}>
		<Breadcrumb
			class="mb-6 shrink-0"
			crumbs={[
				{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
				{ label: m['features.quickly-added-words.list.breadcrumb.quickly_added_words']() }
			]}
		/>

		<div class="mb-6 shrink-0 border-b border-line-subtle pb-6">
			<h1 class="text-2xl font-bold tracking-tight text-ink" data-testid={E2E_TEST_IDS.list.heading}>
				{m['features.quickly-added-words.list.header.title']()}
			</h1>
			<p class="mt-1 text-sm text-ink-muted">
				{m['features.quickly-added-words.list.header.description']()}
			</p>
		</div>

		<div class="mb-8 shrink-0">
			<QawOverviewStats
				{overviewQuery}
				{approvalFilter}
				onApprovalFilterChange={handleApprovalFilterChange}
			/>
		</div>

		<div class="flex min-h-0 flex-1 flex-col">
			<QawList
				{qawQuery}
				{page}
				{approvalFilter}
				hasLearningLanguage={learningLanguage !== undefined}
				bind:selectedIds={selectedQawIds}
				bind:scrollContainer={listScrollContainer}
				onPageChange={handlePageChange}
			/>
		</div>
	</ContentCard>
</PageContentContainer>
