<script lang="ts">
	import {
		createActivateWordMutation,
		createBulkActivateWordsMutation,
		createBulkDeleteWordsMutation,
		createDeleteWordMutation,
		createWordsQuery
	} from '$words/api-client';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import type { WordListItem, WordsViewMode } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import CapturedWordsBulkActionsBar from './captured-words-bulk-actions-bar.svelte';
	import CapturedWordRowCheckbox from './captured-word-row-checkbox.svelte';
	import CapturedWordPendingActions from './captured-word-pending-actions.svelte';
	import WordListRow from './word-list-row.svelte';
	import WordsViewToggle from './words-view-toggle.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import { groupWordsByTimeBucket, type TimeBucket } from '../utils/group-words-by-time-bucket';
	import { getWordDetailContext, toggleWordDetail } from '../contexts/word-detail-context.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		wordsQuery: ReturnType<typeof createWordsQuery>;
		page: number;
		viewMode: WordsViewMode;
		hasLearningLanguage: boolean;
		selectedIds?: string[];
		scrollContainer?: HTMLDivElement;
		onPageChange: (page: number) => void;
		onViewModeChange: (mode: WordsViewMode) => void;
	}

	let {
		wordsQuery,
		page,
		viewMode,
		hasLearningLanguage,
		selectedIds = $bindable([]),
		scrollContainer = $bindable(),
		onPageChange,
		onViewModeChange
	}: Props = $props();

	const isPendingView = $derived(viewMode === 'pending');

	const activateMutation = createActivateWordMutation();
	const deleteMutation = createDeleteWordMutation();
	const bulkActivateMutation = createBulkActivateWordsMutation();
	const bulkDeleteMutation = createBulkDeleteWordsMutation();

	const items = $derived(wordsQuery.data?.data ?? []);
	const bucketGroups = $derived(viewMode === 'learning' ? groupWordsByTimeBucket(items) : []);
	const pageItemIds = $derived(items.flatMap((item) => (item.id ? [item.id] : [])));
	const totalPages = $derived(wordsQuery.data?.pagination?.totalPages ?? 1);
	const showPagination = $derived(isPendingView && totalPages > 1);
	const canGoPrevious = $derived(page > 0);
	const canGoNext = $derived(page < totalPages - 1);
	const isBulkBusy = $derived(bulkActivateMutation.isPending || bulkDeleteMutation.isPending);
	const wordDetailContext = getWordDetailContext();
	const isDetailPanelOpen = $derived(wordDetailContext.isOpened);

	function handleRowClick(itemId: string) {
		if (!itemId || isPendingView) {
			return;
		}

		toggleWordDetail(wordDetailContext, itemId);
	}

	function isDetailSelected(itemId: string) {
		return wordDetailContext.isOpened && wordDetailContext.selectedWordId === itemId;
	}

	function bucketLabel(bucket: TimeBucket) {
		switch (bucket) {
			case 'today':
				return m['features.words.inbox.buckets.today']();
			case 'yesterday':
				return m['features.words.inbox.buckets.yesterday']();
			case 'this_week':
				return m['features.words.inbox.buckets.this_week']();
			case 'last_week':
				return m['features.words.inbox.buckets.last_week']();
			default:
				return m['features.words.inbox.buckets.earlier']();
		}
	}

	function isActivating(itemId: string) {
		return activateMutation.isPending && activateMutation.variables === itemId;
	}

	function isDeleting(itemId: string) {
		return deleteMutation.isPending && deleteMutation.variables === itemId;
	}

	function isRowSelected(itemId: string) {
		return selectedIds.includes(itemId);
	}

	function setRowSelected(itemId: string, checked: boolean) {
		if (checked) {
			if (!selectedIds.includes(itemId)) {
				selectedIds = [...selectedIds, itemId];
			}

			return;
		}

		selectedIds = selectedIds.filter((id) => id !== itemId);
	}

	function rowCheckboxLabel(word: string) {
		return m['features.words.inbox.selection.select_row']({ word });
	}

	function clearSelection() {
		selectedIds = [];
	}

	function activateSelected() {
		if (selectedIds.length === 0) {
			return;
		}

		const ids = [...selectedIds];
		bulkActivateMutation.mutate(ids, { onSuccess: clearSelection });
	}

	function removeSelected() {
		if (selectedIds.length === 0) {
			return;
		}

		const ids = [...selectedIds];
		bulkDeleteMutation.mutate(ids, { onSuccess: clearSelection });
	}
</script>

{#snippet wordRow(item: WordListItem)}
	{@const itemId = item.id ?? ''}
	{@const sourceWord = item.sourceWord ?? ''}
	<li
		class={cn(
			'flex items-start gap-4 rounded-xl border bg-surface shadow-sm',
			isDetailPanelOpen ? 'px-3 py-2.5' : 'px-5 py-4',
			isPendingView
				? 'border-line'
				: cn(
						'cursor-pointer transition-[background-color,border-color,box-shadow] duration-150',
						isDetailSelected(itemId)
							? 'border-line bg-highlight/35 shadow-md'
							: 'border-line hover:border-ink/15 hover:bg-highlight/20 hover:shadow-md'
					)
		)}
		data-testid={E2E_TEST_IDS.inbox.row(itemId)}
		role={isPendingView ? undefined : 'button'}
		tabindex={isPendingView ? undefined : 0}
		aria-pressed={isPendingView ? undefined : isDetailSelected(itemId)}
		onclick={isPendingView ? undefined : () => handleRowClick(itemId)}
		onkeydown={isPendingView
			? undefined
			: (event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						handleRowClick(itemId);
					}
				}}
	>
		{#if isPendingView && itemId}
			<CapturedWordRowCheckbox
				checked={isRowSelected(itemId)}
				disabled={isBulkBusy || isActivating(itemId) || isDeleting(itemId)}
				ariaLabel={rowCheckboxLabel(sourceWord)}
				onCheckedChange={(checked) => setRowSelected(itemId, checked)}
			/>
		{/if}

		<WordListRow {item} {itemId} variant={viewMode} compact={isDetailPanelOpen && !isPendingView} />

		{#if isPendingView && itemId}
			<CapturedWordPendingActions
				{itemId}
				isActivating={isActivating(itemId) || isBulkBusy}
				isDeleting={isDeleting(itemId) || isBulkBusy}
				onActivate={(id) => activateMutation.mutate(id)}
				onDelete={(id) => deleteMutation.mutate(id)}
			/>
		{/if}
	</li>
{/snippet}

{#snippet listToolbar()}
	{#if hasLearningLanguage}
		<div class="shrink-0 border-b border-line-subtle bg-canvas pb-3">
			<WordsViewToggle {viewMode} {onViewModeChange} />
		</div>
	{/if}
{/snippet}

{#if !hasLearningLanguage}
	<StatusPanel
		variant="information"
		header={m['features.words.inbox.empty.header']()}
		description={m['features.words.capture-popover.save_no_language']()}
	/>
{:else if wordsQuery.isLoading}
	<div class="flex min-h-0 flex-1 flex-col">
		{@render listToolbar()}
		<div class="flex flex-1 items-center justify-center py-16">
			<Loader />
		</div>
	</div>
{:else if wordsQuery.isError}
	<div class="flex min-h-0 flex-1 flex-col">
		{@render listToolbar()}
		<StatusPanel
			variant="error"
			header={m['features.words.inbox.load_error.header']()}
			description={wordsQuery.error?.message || m['features.words.inbox.load_error.description']()}
			primaryButton={{
				label: m['features.words.inbox.load_error.try_again'](),
				onClick: () => wordsQuery.refetch()
			}}
		/>
	</div>
{:else if items.length === 0}
	<div class="flex min-h-0 flex-1 flex-col">
		{@render listToolbar()}
		<StatusPanel
			variant="information"
			header={isPendingView
				? m['features.words.inbox.empty.pending_header']()
				: m['features.words.inbox.empty.header']()}
			description={isPendingView
				? m['features.words.inbox.empty.pending_description']()
				: m['features.words.inbox.empty.description']()}
		/>
	</div>
{:else}
	<div class="flex min-h-0 flex-1 flex-col">
		{@render listToolbar()}

		{#if isPendingView}
			<CapturedWordsBulkActionsBar
				{pageItemIds}
				bind:selectedIds
				isBusy={isBulkBusy}
				onActivateSelected={activateSelected}
				onRemoveSelected={removeSelected}
			/>
		{/if}

		<ScrollableWrapper
			bind:scrollContainer
			wrapperClass="min-h-0"
			contentClass={isDetailPanelOpen ? 'gap-3' : 'gap-4'}
		>
			{#if isPendingView}
				<ul
					class={isDetailPanelOpen ? 'flex flex-col gap-3 p-0' : 'flex flex-col gap-4 p-0'}
					aria-label={m['features.words.inbox.list_aria_label']()}
					data-testid={E2E_TEST_IDS.inbox.root}
				>
					{#each items as item (item.id)}
						{@render wordRow(item)}
					{/each}
				</ul>
			{:else}
				<div
					class={isDetailPanelOpen ? 'flex flex-col gap-6' : 'flex flex-col gap-8'}
					aria-label={m['features.words.inbox.list_aria_label']()}
					data-testid={E2E_TEST_IDS.inbox.root}
				>
					{#each bucketGroups as group (group.bucket)}
						<section class={isDetailPanelOpen ? 'flex flex-col gap-3' : 'flex flex-col gap-4'}>
							<h2 class="text-sm font-medium text-ink-muted">
								{bucketLabel(group.bucket)}
							</h2>
							<ul class={isDetailPanelOpen ? 'flex flex-col gap-3 p-0' : 'flex flex-col gap-4 p-0'}>
								{#each group.items as item (item.id)}
									{@render wordRow(item)}
								{/each}
							</ul>
						</section>
					{/each}
				</div>
			{/if}
		</ScrollableWrapper>

		{#if showPagination}
			<div class="mt-6 flex shrink-0 items-center justify-between gap-4">
				<Button
					type="OUTLINED"
					variant="PRIMARY"
					disabled={!canGoPrevious}
					onClick={() => onPageChange(page - 1)}
				>
					{m['features.words.inbox.pagination.previous']()}
				</Button>

				<p class="text-sm text-ink-muted">
					{m['features.words.inbox.pagination.page_of']({
						page: page + 1,
						totalPages
					})}
				</p>

				<Button
					type="OUTLINED"
					variant="PRIMARY"
					disabled={!canGoNext}
					onClick={() => onPageChange(page + 1)}
				>
					{m['features.words.inbox.pagination.next']()}
				</Button>
			</div>
		{/if}
	</div>
{/if}
