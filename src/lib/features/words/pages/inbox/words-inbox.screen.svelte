<script lang="ts">
	import { createWordsQuery } from '$words/api-client';
	import { authStore } from '$auth/stores';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import CapturedWordsList from './components/captured-words-list.svelte';
	import WordDetailPanel from './components/word-detail-panel.svelte';
	import {
		createWordDetailContext,
		closeWordDetail,
		getWordDetailContext
	} from './contexts/word-detail-context.svelte';
	import type { WordsViewMode } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	const LEARNING_PER_PAGE = 500;
	const PENDING_PER_PAGE = 50;
	const LIST_COLUMN_WIDTH_PX = 360;
	const SPLIT_GAP_PX = 24;

	createWordDetailContext();
	const wordDetailContext = getWordDetailContext();

	let page = $state(0);
	let viewMode = $state<WordsViewMode>('learning');
	let selectedWordIds = $state<string[]>([]);
	let listScrollContainer = $state<HTMLDivElement | undefined>();

	const learningLanguage = $derived(authStore.user?.selectedLearningLanguage);

	const wordsQuery = createWordsQuery(() => {
		if (!learningLanguage) {
			return null;
		}

		const isPendingView = viewMode === 'pending';

		return {
			language: learningLanguage,
			page: isPendingView ? page : 0,
			perPage: isPendingView ? PENDING_PER_PAGE : LEARNING_PER_PAGE,
			hasProgress: !isPendingView
		};
	});

	const headerDescription = $derived(
		viewMode === 'pending'
			? m['features.words.inbox.header.pending_description']()
			: m['features.words.inbox.header.description']()
	);

	function clearSelection() {
		selectedWordIds = [];
	}

	function handlePageChange(nextPage: number) {
		page = nextPage;
		clearSelection();
	}

	function handleViewModeChange(mode: WordsViewMode) {
		viewMode = mode;
		page = 0;
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

<PageContentContainer>
	<ContentCard class="flex min-h-0 flex-1 flex-col" data-testid={E2E_TEST_IDS.inbox.page}>
		<div class="shrink-0 px-6 pt-6">
			<Breadcrumb
				class="mb-6"
				crumbs={[
					{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
					{ label: m['features.words.inbox.breadcrumb.words']() }
				]}
			/>

			<div class="border-b border-line-subtle pb-6">
				<h1 class="text-2xl font-bold tracking-tight text-ink" data-testid={E2E_TEST_IDS.inbox.heading}>
					{m['features.words.inbox.header.title']()}
				</h1>
				<p class="mt-1 text-sm text-ink-muted">
					{headerDescription}
				</p>
			</div>
		</div>

		<div class="flex min-h-0 flex-1 overflow-hidden px-6 pb-6 pt-6">
			<div
				class="flex min-h-0 shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out"
				style:width={wordDetailContext.isOpened ? `${LIST_COLUMN_WIDTH_PX}px` : '100%'}
			>
				<CapturedWordsList
					{wordsQuery}
					{page}
					{viewMode}
					hasLearningLanguage={learningLanguage !== undefined}
					bind:selectedIds={selectedWordIds}
					bind:scrollContainer={listScrollContainer}
					onPageChange={handlePageChange}
					onViewModeChange={handleViewModeChange}
				/>
			</div>

			<div
				class="flex min-h-0 shrink-0 flex-col overflow-hidden transition-[width,margin-left] duration-300 ease-in-out"
				style:width={wordDetailContext.isOpened
					? `calc(100% - ${LIST_COLUMN_WIDTH_PX}px - ${SPLIT_GAP_PX}px)`
					: '0px'}
				style:margin-left={wordDetailContext.isOpened ? `${SPLIT_GAP_PX}px` : '0px'}
			>
				<WordDetailPanel />
			</div>
		</div>
	</ContentCard>
</PageContentContainer>
