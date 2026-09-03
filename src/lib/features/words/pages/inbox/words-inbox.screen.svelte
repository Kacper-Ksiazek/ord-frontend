<script lang="ts">
	import { createWordOverviewQuery, createCapturedWordsQuery } from '$words/api-client';
	import { authStore } from '$auth/stores';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import CapturedWordsList from './components/captured-words-list.svelte';
	import WordOverviewStats from './components/word-overview-stats.svelte';
	import type { WordStatusFilter } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	const PER_PAGE = 50;

	let page = $state(0);
	let statusFilter = $state<WordStatusFilter>('all');
	let selectedWordIds = $state<string[]>([]);
	let listScrollContainer = $state<HTMLDivElement | undefined>();

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage);

	const overviewQuery = createWordOverviewQuery();
	const capturedWordsQuery = createCapturedWordsQuery(() => {
		if (!learningLanguage) {
			return null;
		}

		return {
			language: learningLanguage,
			page,
			perPage: PER_PAGE,
			...(statusFilter === 'active'
				? { status: 'ACTIVE' as const }
				: statusFilter === 'captured'
					? { status: 'CAPTURED' as const }
					: {})
		};
	});

	function clearSelection() {
		selectedWordIds = [];
	}

	function handlePageChange(nextPage: number) {
		page = nextPage;
		clearSelection();
	}

	function handleStatusFilterChange(filter: WordStatusFilter) {
		statusFilter = filter;
		page = 0;
		clearSelection();
		listScrollContainer?.scrollTo({ top: 0 });
	}
</script>

<svelte:head>
	<title>{m['features.words.inbox.header.title']()}</title>
</svelte:head>

<PageContentContainer>
	<ContentCard class="flex min-h-0 flex-1 flex-col" data-testid={E2E_TEST_IDS.inbox.page}>
		<Breadcrumb
			class="mb-6 shrink-0"
			crumbs={[
				{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
				{ label: m['features.words.inbox.breadcrumb.captured_words']() }
			]}
		/>

		<div class="mb-6 shrink-0 border-b border-line-subtle pb-6">
			<h1 class="text-2xl font-bold tracking-tight text-ink" data-testid={E2E_TEST_IDS.inbox.heading}>
				{m['features.words.inbox.header.title']()}
			</h1>
			<p class="mt-1 text-sm text-ink-muted">
				{m['features.words.inbox.header.description']()}
			</p>
		</div>

		<div class="mb-8 shrink-0">
			<WordOverviewStats
				{overviewQuery}
				{statusFilter}
				onStatusFilterChange={handleStatusFilterChange}
			/>
		</div>

		<div class="flex min-h-0 flex-1 flex-col">
			<CapturedWordsList
				{capturedWordsQuery}
				{page}
				{statusFilter}
				hasLearningLanguage={learningLanguage !== undefined}
				bind:selectedIds={selectedWordIds}
				bind:scrollContainer={listScrollContainer}
				onPageChange={handlePageChange}
			/>
		</div>
	</ContentCard>
</PageContentContainer>
