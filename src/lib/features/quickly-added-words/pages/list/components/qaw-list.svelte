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
	import { groupQawByWeek } from '../utils/group-qaw-by-week';
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
		selectedIds?: string[];
		scrollContainer?: HTMLDivElement;
		onPageChange: (page: number) => void;
	}

	let {
		qawQuery,
		page,
		approvalFilter,
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
	const pageItemIds = $derived(items.map((item) => item.id));
	const weekSectionLabels = $derived({
		thisWeek: m['features.quickly-added-words.list.week_sections.this_week'](),
		lastWeek: m['features.quickly-added-words.list.week_sections.last_week']()
	});
	const groupedItems = $derived(groupQawByWeek(items, { labels: weekSectionLabels }));
	const totalPages = $derived(qawQuery.data?.pagination.totalPages ?? 1);
	const showPagination = $derived(totalPages > 1);
	const canGoPrevious = $derived(page > 0);
	const canGoNext = $derived(page < totalPages - 1);
	const isBulkBusy = $derived(bulkApproveMutation.isPending || bulkDeleteMutation.isPending);

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

{#snippet weekSectionLabel(label: string, sectionKey: string)}
	<h2
		id="qaw-section-{sectionKey}"
		class="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ink-muted"
	>
		{label}
	</h2>
{/snippet}

{#if qawQuery.isLoading}
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

		<ScrollableWrapper bind:scrollContainer wrapperClass="min-h-0" contentClass="gap-6">
			<div
				class="flex flex-col gap-6"
				aria-label={m['features.quickly-added-words.list.list_aria_label']()}
				data-testid={E2E_TEST_IDS.list.root}
			>
				{#each groupedItems as { sectionKey, label, items: sectionItems } (sectionKey)}
					<section class="min-w-0" aria-labelledby="qaw-section-{sectionKey}">
						{@render weekSectionLabel(label, sectionKey)}

						<ul class="flex flex-col gap-2 p-0">
							{#each sectionItems as item (item.id)}
								<li
									class="flex items-center justify-between gap-4 rounded-[10px] border border-line bg-surface px-4 py-3"
									data-testid={E2E_TEST_IDS.list.row(item.id)}
								>
									{#if showBulkSelection}
										<QawListRowCheckbox
											checked={isRowSelected(item.id)}
											disabled={isBulkBusy || isApproving(item.id) || isDeleting(item.id)}
											ariaLabel={rowCheckboxLabel(item.word)}
											onCheckedChange={(checked) => setRowSelected(item.id, checked)}
										/>
									{/if}

									<div class="min-w-0 flex-1">
										<p class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
											<span class="inline-flex items-center gap-1.5">
												{#if !item.isApproved}
													<QawUnconfirmedBadge itemId={item.id} />
												{/if}

												<span class="font-medium text-ink">{item.word}</span>

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

										{#if item.definition}
											<p class="mt-2.5 text-sm text-ink-muted">{item.definition}</p>
										{/if}
									</div>

									{#if !item.isApproved}
										<QawPendingRowActions
											itemId={item.id}
											isApproving={isApproving(item.id) || isBulkBusy}
											isDeleting={isDeleting(item.id) || isBulkBusy}
											onApprove={(id) => approveMutation.mutate(id)}
											onDelete={(id) => deleteMutation.mutate(id)}
										/>
									{/if}
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
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
