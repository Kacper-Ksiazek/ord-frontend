<script lang="ts">
	import {
		createActivateWordMutation,
		createBulkActivateWordsMutation,
		createBulkDeleteWordsMutation,
		createDeleteWordMutation,
		createWordsQuery,
		createWordsSearchQuery
	} from '$words/api-client';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import type { WordListItem, WordsViewMode } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import CapturedWordsBulkActionsBar from './captured-words-bulk-actions-bar.svelte';
	import CapturedWordRowCheckbox from './captured-word-row-checkbox.svelte';
	import CapturedWordPendingActions from './captured-word-pending-actions.svelte';
	import WordListRow from './word-list-row.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import { groupWordsByTimeBucket, type TimeBucket } from '../utils/group-words-by-time-bucket';
	import { getWordDetailContext, toggleWordDetail } from '../contexts/word-detail-context.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		wordsQuery: ReturnType<typeof createWordsQuery> | ReturnType<typeof createWordsSearchQuery>;
		page: number;
		viewMode: WordsViewMode;
		hasActiveFilters: boolean;
		hasLearningLanguage: boolean;
		selectedIds?: string[];
		onPageChange: (page: number) => void;
	}

	let {
		wordsQuery,
		page,
		viewMode,
		hasActiveFilters,
		hasLearningLanguage,
		selectedIds = $bindable([]),
		onPageChange
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
	<li class="list-none">
		<div
			class={cn(
				'flex w-full items-stretch rounded-[10px] border border-line bg-surface transition-colors',
				isDetailPanelOpen ? 'px-3 py-2.5' : 'px-3 py-3',
				isPendingView
					? ''
					: cn('cursor-pointer', isDetailSelected(itemId) ? 'bg-highlight/35' : 'hover:bg-accent-soft')
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
		</div>
	</li>
{/snippet}

{#snippet bucketHeading(bucket: TimeBucket)}
	<h2 class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
		{bucketLabel(bucket)}
	</h2>
{/snippet}

{#if !hasLearningLanguage}
	<StatusPanel
		variant="information"
		header={m['features.words.inbox.empty.header']()}
		description={m['features.words.capture-popover.save_no_language']()}
	/>
{:else if wordsQuery.isLoading}
	<div class="flex items-center justify-center py-16">
		<Loader />
	</div>
{:else if wordsQuery.isError}
	<StatusPanel
		variant="error"
		header={m['features.words.inbox.load_error.header']()}
		description={wordsQuery.error?.message || m['features.words.inbox.load_error.description']()}
		primaryButton={{
			label: m['features.words.inbox.load_error.try_again'](),
			onClick: () => wordsQuery.refetch()
		}}
	/>
{:else if items.length === 0}
	<StatusPanel
		variant="information"
		header={hasActiveFilters
			? m['features.words.inbox.empty.filtered_header']()
			: isPendingView
				? m['features.words.inbox.empty.pending_header']()
				: m['features.words.inbox.empty.header']()}
		description={hasActiveFilters
			? m['features.words.inbox.empty.filtered_description']()
			: isPendingView
				? m['features.words.inbox.empty.pending_description']()
				: m['features.words.inbox.empty.description']()}
	/>
{:else}
	{#if isPendingView}
		<div class="mb-6">
			<CapturedWordsBulkActionsBar
				{pageItemIds}
				bind:selectedIds
				isBusy={isBulkBusy}
				onActivateSelected={activateSelected}
				onRemoveSelected={removeSelected}
			/>
		</div>
	{/if}

	{#if isPendingView}
		<ul
			class={cn('flex flex-col gap-2 p-0')}
			aria-label={m['features.words.inbox.list_aria_label']()}
			data-testid={E2E_TEST_IDS.inbox.root}
		>
			{#each items as item (item.id)}
				{@render wordRow(item)}
			{/each}
		</ul>
	{:else}
		<div
			class="flex flex-col gap-6"
			aria-label={m['features.words.inbox.list_aria_label']()}
			data-testid={E2E_TEST_IDS.inbox.root}
		>
			{#each bucketGroups as group (group.bucket)}
				<section class="min-w-0">
					{@render bucketHeading(group.bucket)}
					<ul class="flex flex-col gap-2 p-0">
						{#each group.items as item (item.id)}
							{@render wordRow(item)}
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/if}

	{#if showPagination}
		<div class="mt-6 flex items-center justify-between gap-4">
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
{/if}
