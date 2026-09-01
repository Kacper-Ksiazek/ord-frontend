<script lang="ts">
	import {
		createApproveQawMutation,
		createBulkApproveQawMutation,
		createBulkDeleteQawMutation,
		createDeleteQawMutation,
		createQuicklyAddedWordsQuery
	} from '$quicklyAddedWords/api-client';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { Badge } from '$lib/components/utils/badge';
	import { getWordTypeBadgeColor, getWordTypeLabel } from '$quicklyAddedWords/shared/constants';
	import type { QawListApprovalFilter } from '$quicklyAddedWords/types';
	import * as m from '$lib/paraglide/messages.js';
	import QawBulkActionsBar from './qaw-bulk-actions-bar.svelte';
	import QawListRowCheckbox from './qaw-list-row-checkbox.svelte';
	import QawPendingRowActions from './qaw-pending-row-actions.svelte';
	import QawUnconfirmedBadge from './qaw-unconfirmed-badge.svelte';
	import { E2E_TEST_IDS } from '$quicklyAddedWords/testing/test-ids';

	interface Props {
		qawQuery: ReturnType<typeof createQuicklyAddedWordsQuery>;
		page: number;
		approvalFilter: QawListApprovalFilter;
		hasLearningLanguage: boolean;
		selectedIds?: string[];
		scrollContainer?: HTMLDivElement;
		onPageChange: (page: number) => void;
	}

	let {
		qawQuery,
		page,
		approvalFilter,
		hasLearningLanguage,
		selectedIds = $bindable([]),
		scrollContainer = $bindable(),
		onPageChange
	}: Props = $props();

	const showBulkSelection = $derived(approvalFilter === 'pending');

	const approveMutation = createApproveQawMutation();
	const deleteMutation = createDeleteQawMutation();
	const bulkApproveMutation = createBulkApproveQawMutation();
	const bulkDeleteMutation = createBulkDeleteQawMutation();

	const items = $derived(qawQuery.data?.data ?? []);
	const pageItemIds = $derived(items.flatMap((item) => (item.id ? [item.id] : [])));
	const totalPages = $derived(qawQuery.data?.pagination?.totalPages ?? 1);
	const showPagination = $derived(totalPages > 1);
	const canGoPrevious = $derived(page > 0);
	const canGoNext = $derived(page < totalPages - 1);
	const isBulkBusy = $derived(bulkApproveMutation.isPending || bulkDeleteMutation.isPending);

	function isCaptured(status: string | undefined) {
		return status === 'CAPTURED';
	}

	function isApproving(itemId: string) {
		return approveMutation.isPending && approveMutation.variables === itemId;
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
		return m['features.quickly-added-words.list.selection.select_row']({ word });
	}

	function clearSelection() {
		selectedIds = [];
	}

	function approveSelected() {
		if (selectedIds.length === 0) {
			return;
		}

		const ids = [...selectedIds];
		bulkApproveMutation.mutate(ids, { onSuccess: clearSelection });
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
		header={m['features.quickly-added-words.list.empty.header']()}
		description={m['features.quickly-added-words.add-popover.save_no_language']()}
	/>
{:else if qawQuery.isLoading}
	<div class="flex items-center justify-center py-16">
		<Loader />
	</div>
{:else if qawQuery.isError}
	<StatusPanel
		variant="error"
		header={m['features.quickly-added-words.list.load_error.header']()}
		description={qawQuery.error?.message ||
			m['features.quickly-added-words.list.load_error.description']()}
		primaryButton={{
			label: m['features.quickly-added-words.list.load_error.try_again'](),
			onClick: () => qawQuery.refetch()
		}}
	/>
{:else if items.length === 0}
	<StatusPanel
		variant="information"
		header={m['features.quickly-added-words.list.empty.header']()}
		description={m['features.quickly-added-words.list.empty.description']()}
	/>
{:else}
	<div class="flex min-h-0 flex-1 flex-col">
		{#if showBulkSelection}
			<QawBulkActionsBar
				{pageItemIds}
				bind:selectedIds
				isBusy={isBulkBusy}
				onApproveSelected={approveSelected}
				onRemoveSelected={removeSelected}
			/>
		{/if}

		<ScrollableWrapper bind:scrollContainer wrapperClass="min-h-0" contentClass="gap-2">
			<ul
				class="flex flex-col gap-2 p-0"
				aria-label={m['features.quickly-added-words.list.list_aria_label']()}
				data-testid={E2E_TEST_IDS.list.root}
			>
				{#each items as item (item.id)}
					{@const itemId = item.id ?? ''}
					{@const sourceWord = item.sourceWord ?? ''}
					<li
						class="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-surface px-4 py-3"
						data-testid={E2E_TEST_IDS.list.row(itemId)}
					>
						{#if showBulkSelection && itemId}
							<QawListRowCheckbox
								checked={isRowSelected(itemId)}
								disabled={isBulkBusy || isApproving(itemId) || isDeleting(itemId)}
								ariaLabel={rowCheckboxLabel(sourceWord)}
								onCheckedChange={(checked) => setRowSelected(itemId, checked)}
							/>
						{/if}

						<div class="min-w-0 flex-1">
							<p class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
								<span class="inline-flex items-center gap-1.5">
									{#if isCaptured(item.status)}
										<QawUnconfirmedBadge {itemId} />
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
							<QawPendingRowActions
								{itemId}
								isApproving={isApproving(itemId) || isBulkBusy}
								isDeleting={isDeleting(itemId) || isBulkBusy}
								onApprove={(id) => approveMutation.mutate(id)}
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
					{m['features.quickly-added-words.list.pagination.previous']()}
				</Button>

				<p class="text-sm text-ink-muted">
					{m['features.quickly-added-words.list.pagination.page_of']({
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
					{m['features.quickly-added-words.list.pagination.next']()}
				</Button>
			</div>
		{/if}
	</div>
{/if}
