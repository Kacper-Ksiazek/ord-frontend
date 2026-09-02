<script lang="ts">
	import {
		createActivateWordMutation,
		createBulkActivateWordsMutation,
		createBulkDeleteWordsMutation,
		createDeleteWordMutation,
		createCapturedWordsQuery
	} from '$words/api-client';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { Badge } from '$lib/components/utils/badge';
	import { getWordTypeBadgeColor, getWordTypeLabel } from '$words/shared/constants';
	import type { WordStatusFilter } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import CapturedWordsBulkActionsBar from './captured-words-bulk-actions-bar.svelte';
	import CapturedWordRowCheckbox from './captured-word-row-checkbox.svelte';
	import CapturedWordPendingActions from './captured-word-pending-actions.svelte';
	import CapturedStatusBadge from './captured-status-badge.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		capturedWordsQuery: ReturnType<typeof createCapturedWordsQuery>;
		page: number;
		statusFilter: WordStatusFilter;
		hasLearningLanguage: boolean;
		selectedIds?: string[];
		scrollContainer?: HTMLDivElement;
		onPageChange: (page: number) => void;
	}

	let {
		capturedWordsQuery,
		page,
		statusFilter,
		hasLearningLanguage,
		selectedIds = $bindable([]),
		scrollContainer = $bindable(),
		onPageChange
	}: Props = $props();

	const showBulkSelection = $derived(statusFilter === 'captured');

	const activateMutation = createActivateWordMutation();
	const deleteMutation = createDeleteWordMutation();
	const bulkActivateMutation = createBulkActivateWordsMutation();
	const bulkDeleteMutation = createBulkDeleteWordsMutation();

	const items = $derived(capturedWordsQuery.data?.data ?? []);
	const pageItemIds = $derived(items.flatMap((item) => (item.id ? [item.id] : [])));
	const totalPages = $derived(capturedWordsQuery.data?.pagination?.totalPages ?? 1);
	const showPagination = $derived(totalPages > 1);
	const canGoPrevious = $derived(page > 0);
	const canGoNext = $derived(page < totalPages - 1);
	const isBulkBusy = $derived(bulkActivateMutation.isPending || bulkDeleteMutation.isPending);

	function isCaptured(status: string | undefined) {
		return status === 'CAPTURED';
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

{#if !hasLearningLanguage}
	<StatusPanel
		variant="information"
		header={m['features.words.inbox.empty.header']()}
		description={m['features.words.capture-popover.save_no_language']()}
	/>
{:else if capturedWordsQuery.isLoading}
	<div class="flex items-center justify-center py-16">
		<Loader />
	</div>
{:else if capturedWordsQuery.isError}
	<StatusPanel
		variant="error"
		header={m['features.words.inbox.load_error.header']()}
		description={capturedWordsQuery.error?.message ||
			m['features.words.inbox.load_error.description']()}
		primaryButton={{
			label: m['features.words.inbox.load_error.try_again'](),
			onClick: () => capturedWordsQuery.refetch()
		}}
	/>
{:else if items.length === 0}
	<StatusPanel
		variant="information"
		header={m['features.words.inbox.empty.header']()}
		description={m['features.words.inbox.empty.description']()}
	/>
{:else}
	<div class="flex min-h-0 flex-1 flex-col">
		{#if showBulkSelection}
			<CapturedWordsBulkActionsBar
				{pageItemIds}
				bind:selectedIds
				isBusy={isBulkBusy}
				onActivateSelected={activateSelected}
				onRemoveSelected={removeSelected}
			/>
		{/if}

		<ScrollableWrapper bind:scrollContainer wrapperClass="min-h-0" contentClass="gap-2">
			<ul
				class="flex flex-col gap-2 p-0"
				aria-label={m['features.words.inbox.list_aria_label']()}
				data-testid={E2E_TEST_IDS.inbox.root}
			>
				{#each items as item (item.id)}
					{@const itemId = item.id ?? ''}
					{@const sourceWord = item.sourceWord ?? ''}
					<li
						class="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-surface px-4 py-3"
						data-testid={E2E_TEST_IDS.inbox.row(itemId)}
					>
						{#if showBulkSelection && itemId}
							<CapturedWordRowCheckbox
								checked={isRowSelected(itemId)}
								disabled={isBulkBusy || isActivating(itemId) || isDeleting(itemId)}
								ariaLabel={rowCheckboxLabel(sourceWord)}
								onCheckedChange={(checked) => setRowSelected(itemId, checked)}
							/>
						{/if}

						<div class="min-w-0 flex-1">
							<p class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
								<span class="inline-flex items-center gap-1.5">
									{#if isCaptured(item.status)}
										<CapturedStatusBadge {itemId} />
									{/if}

									<span class="font-medium text-ink">{sourceWord}</span>

									{#if item.type}
										<Badge color={getWordTypeBadgeColor(item.type)}>
											{getWordTypeLabel(item.type)}
										</Badge>
									{/if}
								</span>

								{#if item.translation}
									<span class="text-sm text-ink-subtle" aria-hidden="true">-</span>
									<span class="text-sm text-ink-muted">{item.translation}</span>
								{/if}
							</p>
						</div>

						{#if isCaptured(item.status) && itemId}
							<CapturedWordPendingActions
								{itemId}
								isActivating={isActivating(itemId) || isBulkBusy}
								isDeleting={isDeleting(itemId) || isBulkBusy}
								onActivate={(id) => activateMutation.mutate(id)}
								onDelete={(id) => deleteMutation.mutate(id)}
							/>
						{/if}
					</li>
				{/each}
			</ul>
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
