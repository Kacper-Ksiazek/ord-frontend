<script lang="ts">
	import {
		createApproveQawMutation,
		createDeleteQawMutation
	} from '$lib/api-client/quickly-added-words/mutations';
	import { createQuicklyAddedWordsQuery } from '$lib/api-client/quickly-added-words/queries';
	import { Button } from '$lib/components/actions/button';
	import { Loader } from '$lib/components/feedback/loader';
	import { StatusScreen } from '$lib/components/feedback/status-screen';
	import { ScrollableWrapper } from '$lib/components/surfaces/scrollable-wrapper';
	import { getWordTypeChipClasses, getWordTypeLabel } from '$lib/types/word';
	import { groupQawByWeek } from '../utils/group-qaw-by-week';
	import QawListRowMenu from './qaw-list-row-menu.svelte';
	import QawPendingRowActions from './qaw-pending-row-actions.svelte';
	import QawUnconfirmedBadge from './qaw-unconfirmed-badge.svelte';

	interface Props {
		qawQuery: ReturnType<typeof createQuicklyAddedWordsQuery>;
		page: number;
		onPageChange: (page: number) => void;
	}

	let { qawQuery, page, onPageChange }: Props = $props();

	const approveMutation = createApproveQawMutation();
	const deleteMutation = createDeleteQawMutation();

	const items = $derived(qawQuery.data?.data ?? []);
	const groupedItems = $derived(groupQawByWeek(items));
	const totalPages = $derived(qawQuery.data?.pagination.totalPages ?? 1);
	const canGoPrevious = $derived(page > 1);
	const canGoNext = $derived(page < totalPages);

	function isApproving(itemId: string) {
		return approveMutation.isPending && approveMutation.variables === itemId;
	}

	function isDeleting(itemId: string) {
		return deleteMutation.isPending && deleteMutation.variables === itemId;
	}
</script>

{#snippet weekSectionLabel(label: string, sectionKey: string)}
	<h2
		id="qaw-section-{sectionKey}"
		class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
	>
		{label}
	</h2>
{/snippet}

{#if qawQuery.isLoading}
	<div class="flex items-center justify-center py-16">
		<Loader />
	</div>
{:else if qawQuery.isError}
	<StatusScreen
		variant="error"
		header="Couldn't load quickly added words"
		description={qawQuery.error?.message || 'Something went wrong. Try again.'}
		primaryButton={{ label: 'Try again', onClick: () => qawQuery.refetch() }}
	/>
{:else if items.length === 0}
	<StatusScreen
		variant="information"
		header="No quickly added words yet"
		description="Words you add will appear here."
	/>
{:else}
	<div class="flex min-h-0 flex-1 flex-col">
		<ScrollableWrapper wrapperClass="min-h-0" contentClass="gap-8">
			<div class="flex flex-col gap-8" aria-label="Your quickly added words">
				{#each groupedItems as { sectionKey, label, items: sectionItems } (sectionKey)}
					<section class="min-w-0" aria-labelledby="qaw-section-{sectionKey}">
						{@render weekSectionLabel(label, sectionKey)}

						<ul class="flex flex-col gap-3 p-0">
							{#each sectionItems as item (item.id)}
								<li
									class="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
								>
									<div class="min-w-0 flex-1">
										<p class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
											<span class="inline-flex items-center gap-1.5">
												{#if !item.isApproved}
													<QawUnconfirmedBadge itemId={item.id} />
												{/if}

												<span class="font-medium text-gray-900 dark:text-white">{item.word}</span>

												{#if item.type}
													<span class={getWordTypeChipClasses(item.type)}>
														{getWordTypeLabel(item.type)}
													</span>
												{/if}
											</span>

											{#if item.translation}
												<span class="text-sm text-gray-400 dark:text-gray-500" aria-hidden="true"> - </span>
												<span class="text-sm text-gray-600 dark:text-gray-400">{item.translation}</span>
											{/if}
										</p>

										{#if item.definition}
											<p class="mt-2.5 text-sm text-gray-500 dark:text-gray-500">{item.definition}</p>
										{/if}
									</div>

									{#if !item.isApproved}
										<QawPendingRowActions
											itemId={item.id}
											isApproving={isApproving(item.id)}
											isDeleting={isDeleting(item.id)}
											onApprove={(id) => approveMutation.mutate(id)}
											onDelete={(id) => deleteMutation.mutate(id)}
										/>
									{:else}
										<QawListRowMenu itemId={item.id} />
									{/if}
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		</ScrollableWrapper>

		<div class="mt-6 flex shrink-0 items-center justify-between gap-4">
			<Button
				type="OUTLINED"
				variant="PRIMARY"
				disabled={!canGoPrevious}
				onClick={() => onPageChange(page - 1)}
			>
				Previous
			</Button>

			<p class="text-sm text-gray-600 dark:text-gray-400">
				Page {page} of {totalPages}
			</p>

			<Button
				type="OUTLINED"
				variant="PRIMARY"
				disabled={!canGoNext}
				onClick={() => onPageChange(page + 1)}
			>
				Next
			</Button>
		</div>
	</div>
{/if}
