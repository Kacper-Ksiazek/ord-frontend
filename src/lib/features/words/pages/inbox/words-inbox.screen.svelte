<script lang="ts">
	import { page as appPage } from '$app/state';
	import { afterNavigate, replaceState } from '$app/navigation';
	import {
		createWordsQuery,
		createWordsSearchQuery,
		createWordOverviewQuery
	} from '$words/api-client';
	import { authStore } from '$auth/stores';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import CapturedWordsList from './components/captured-words-list.svelte';
	import WordDetailPanel from './components/word-detail-panel.svelte';
	import WordsViewToggle from './components/words-view-toggle.svelte';
	import WordListFiltersBar from './components/word-list-filters-bar.svelte';
	import { WordsListFiltersState } from './state/words-list-filters-state.svelte';
	import { buildWordsInboxQueryString, parseWordsInboxUrl } from './state/words-inbox-url-state';
	import {
		createWordDetailContext,
		closeWordDetail,
		getWordDetailContext,
		openWordDetail
	} from './contexts/word-detail-context.svelte';
	import type { WordsViewMode } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import { cn } from '$lib/utils/cn';

	const LEARNING_PER_PAGE = 500;
	const PENDING_PER_PAGE = 50;
	const LIST_COLUMN_WIDTH_PX = 360;

	const initialUrlState = parseWordsInboxUrl(appPage.url.searchParams);

	createWordDetailContext();
	const wordDetailContext = getWordDetailContext();
	const filtersState = new WordsListFiltersState(appPage.url.searchParams);

	let listPage = $state(initialUrlState.page);
	let viewMode = $state<WordsViewMode>(initialUrlState.viewMode);
	let selectedWordIds = $state<string[]>([]);
	let listScrollContainer = $state<HTMLDivElement | undefined>();
	let previousFiltersKey = $state(filtersState.toQueryString());
	let canSyncUrl = $state(false);

	if (initialUrlState.wordId && initialUrlState.viewMode === 'learning') {
		openWordDetail(wordDetailContext, initialUrlState.wordId);
	}

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage);
	const useSearchQuery = $derived(filtersState.hasActiveFilters);

	const wordsQuery = createWordsQuery(() => {
		if (!learningLanguage || useSearchQuery) {
			return null;
		}

		const isPendingView = viewMode === 'pending';

		return {
			language: learningLanguage,
			page: isPendingView ? listPage : 0,
			perPage: isPendingView ? PENDING_PER_PAGE : LEARNING_PER_PAGE,
			hasProgress: !isPendingView
		};
	});

	const wordsSearchQuery = createWordsSearchQuery(() => {
		if (!learningLanguage || !useSearchQuery) {
			return null;
		}

		return filtersState.buildSearchPayload({
			language: learningLanguage,
			viewMode,
			page: listPage,
			learningPerPage: LEARNING_PER_PAGE,
			pendingPerPage: PENDING_PER_PAGE
		});
	});

	const activeWordsQuery = $derived(useSearchQuery ? wordsSearchQuery : wordsQuery);

	const wordOverviewQuery = createWordOverviewQuery(() =>
		learningLanguage ? { language: learningLanguage } : null
	);

	const pendingCount = $derived(wordOverviewQuery.data?.pendingCount ?? 0);
	const bookmarkedCount = $derived(wordOverviewQuery.data?.bookmarkedCount ?? 0);

	const headerDescription = $derived(
		viewMode === 'pending'
			? m['features.words.inbox.header.pending_description']()
			: m['features.words.inbox.header.description']()
	);

	afterNavigate((navigation) => {
		canSyncUrl = true;

		if (navigation.type !== 'popstate') {
			return;
		}

		applyInboxStateFromUrl(appPage.url.searchParams);
	});

	function applyInboxStateFromUrl(searchParams: Parameters<typeof parseWordsInboxUrl>[0]) {
		const parsed = parseWordsInboxUrl(searchParams);

		filtersState.applyFromSearchParams(searchParams);
		viewMode = parsed.viewMode;
		listPage = parsed.page;

		if (parsed.wordId && parsed.viewMode === 'learning') {
			if (!wordDetailContext.isOpened || wordDetailContext.selectedWordId !== parsed.wordId) {
				openWordDetail(wordDetailContext, parsed.wordId);
			}

			return;
		}

		if (wordDetailContext.isOpened) {
			closeWordDetail(wordDetailContext);
		}
	}

	function buildDesiredSearch(): string {
		const query = buildWordsInboxQueryString({
			filters: filtersState.filters,
			viewMode,
			wordId: wordDetailContext.isOpened ? wordDetailContext.selectedWordId : null,
			page: listPage
		});

		return query ? `?${query}` : '';
	}

	$effect(() => {
		if (!canSyncUrl) {
			return;
		}

		const desiredSearch = buildDesiredSearch();

		if (window.location.search === desiredSearch) {
			return;
		}

		replaceState(desiredSearch === '' ? '?' : desiredSearch, {});
	});

	$effect(() => {
		const nextFiltersKey = filtersState.toQueryString();

		if (nextFiltersKey !== previousFiltersKey) {
			listPage = 0;
			clearSelection();
			listScrollContainer?.scrollTo({ top: 0 });
		}

		previousFiltersKey = nextFiltersKey;
	});

	function clearSelection() {
		selectedWordIds = [];
	}

	function handlePageChange(nextPage: number) {
		listPage = nextPage;
		clearSelection();
	}

	function handleViewModeChange(mode: WordsViewMode) {
		viewMode = mode;
		listPage = 0;
		clearSelection();
		listScrollContainer?.scrollTo({ top: 0 });

		if (mode === 'pending') {
			closeWordDetail(wordDetailContext);
		}
	}
</script>

<svelte:head>
	<title>{m['features.words.inbox.header.title']()}</title>
</svelte:head>

<PageContentContainer
	class="h-full min-h-0 overflow-hidden"
	contentClass="h-full min-h-0 overflow-hidden"
>
	<ContentCard
		class="flex h-full min-h-0 flex-col overflow-hidden"
		data-testid={E2E_TEST_IDS.inbox.page}
	>
		<div class="shrink-0">
			<Breadcrumb
				class="mb-6"
				crumbs={[
					{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
					{ label: m['features.words.inbox.breadcrumb.words']() }
				]}
			/>

			<div
				class="mb-6 flex flex-col gap-3 border-b border-line-subtle pb-6 sm:flex-row sm:items-end sm:justify-between"
			>
				<div>
					<h1
						class="text-2xl font-bold tracking-tight text-ink"
						data-testid={E2E_TEST_IDS.inbox.heading}
					>
						{m['features.words.inbox.header.title']()}
					</h1>
					<p class="mt-1 text-sm text-ink-muted">
						{headerDescription}
					</p>
				</div>

				{#if learningLanguage}
					<WordsViewToggle {viewMode} {pendingCount} onViewModeChange={handleViewModeChange} />
				{/if}
			</div>
		</div>

		<div class="flex min-h-0 flex-1 gap-6 overflow-hidden">
			<div
				class="flex min-h-0 shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out"
				style:width={wordDetailContext.isOpened ? `${LIST_COLUMN_WIDTH_PX}px` : '100%'}
			>
				{#if learningLanguage}
					<div class="shrink-0">
						<WordListFiltersBar
							{filtersState}
							isSplitView={wordDetailContext.isOpened}
							{bookmarkedCount}
						/>
					</div>
				{/if}

				<div bind:this={listScrollContainer} class="min-h-0 flex-1 overflow-y-auto">
					<CapturedWordsList
						wordsQuery={activeWordsQuery}
						page={listPage}
						{viewMode}
						hasActiveFilters={filtersState.hasActiveFilters}
						bookmarkedOnlyFilter={filtersState.filters.bookmarkedOnly}
						hasLearningLanguage={learningLanguage !== undefined}
						bind:selectedIds={selectedWordIds}
						onPageChange={handlePageChange}
					/>
				</div>
			</div>

			<div
				class={cn(
					'flex min-h-0 min-w-0 flex-col overflow-hidden transition-[flex-grow,width] duration-300 ease-in-out',
					wordDetailContext.isOpened ? 'flex-1' : 'w-0 flex-none pointer-events-none'
				)}
			>
				<div
					class={cn(
						'h-full w-full transition-transform duration-300 ease-in-out',
						wordDetailContext.isOpened ? 'translate-x-0' : 'translate-x-full'
					)}
				>
					<WordDetailPanel bookmarkedOnlyFilter={filtersState.filters.bookmarkedOnly} />
				</div>
			</div>
		</div>
	</ContentCard>
</PageContentContainer>
