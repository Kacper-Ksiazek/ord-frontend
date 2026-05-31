<script lang="ts">
	import {
		createQAWOverviewQuery,
		createQuicklyAddedWordsQuery
	} from '$lib/api-client/quickly-added-words/queries';
	import { PageContentContainer } from '$lib/components/surfaces/page-content-container';
	import { ContentCard } from '$lib/components/surfaces/content-card';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import { QawList, QawOverviewStats } from '$lib/features/quickly-added-words/pages/list';
	import type { QawListApprovalFilter } from '$lib/types/quickly-added-word/api/list-quickly-added-words';
	import * as m from '$lib/paraglide/messages.js';

	const PER_PAGE = 50;

	let page = $state(0);
	let approvalFilter = $state<QawListApprovalFilter>('all');
	let selectedQawIds = $state<string[]>([]);
	let listScrollContainer = $state<HTMLDivElement | undefined>();

	const overviewQuery = createQAWOverviewQuery();
	const qawQuery = createQuicklyAddedWordsQuery(() => ({
		page,
		perPage: PER_PAGE,
		...(approvalFilter === 'approved'
			? { isApproved: true }
			: approvalFilter === 'pending'
				? { isApproved: false }
				: {})
	}));

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
	<ContentCard class="flex min-h-0 flex-1 flex-col">
		<Breadcrumb
			class="mb-6 shrink-0"
			crumbs={[
				{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
				{ label: m['features.quickly-added-words.list.breadcrumb.quickly_added_words']() }
			]}
		/>

		<div class="mb-6 shrink-0">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
				{m['features.quickly-added-words.list.header.title']()}
			</h1>
			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
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
				bind:selectedIds={selectedQawIds}
				bind:scrollContainer={listScrollContainer}
				onPageChange={handlePageChange}
			/>
		</div>
	</ContentCard>
</PageContentContainer>
