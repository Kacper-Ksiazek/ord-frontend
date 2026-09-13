<script lang="ts">
	import {
		createToggleWordBookmarkMutation,
		createWordsQuery,
		createWordsSearchQuery
	} from '$words/api-client';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import type { WordListItem } from '$words/types';
	import * as m from '$lib/paraglide/messages.js';
	import WordListRow from './word-list-row.svelte';
	import WordBookmarkButton from './word-bookmark-button.svelte';
	import CapturedWordsListSkeleton from './captured-words-list-skeleton.svelte';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';
	import { groupWordsByTimeBucket, type TimeBucket } from '../utils/group-words-by-time-bucket';
	import { getWordDetailContext, toggleWordDetail } from '../contexts/word-detail-context.svelte';
	import { cn } from '$lib/utils/cn';
	import { getWordBookmarked } from '$words/api-client/utils/normalize-word-list-item';

	interface Props {
		wordsQuery: ReturnType<typeof createWordsQuery> | ReturnType<typeof createWordsSearchQuery>;
		hasActiveFilters: boolean;
		bookmarkedOnlyFilter: boolean;
		hasLearningLanguage: boolean;
	}

	let { wordsQuery, hasActiveFilters, bookmarkedOnlyFilter, hasLearningLanguage }: Props = $props();

	const bookmarkMutation = createToggleWordBookmarkMutation();

	const items = $derived(wordsQuery.data?.data ?? []);
	const bucketGroups = $derived(groupWordsByTimeBucket(items));
	const wordDetailContext = getWordDetailContext();
	const isDetailPanelOpen = $derived(wordDetailContext.isOpened);

	function handleRowClick(itemId: string, item: WordListItem) {
		if (!itemId) {
			return;
		}

		toggleWordDetail(wordDetailContext, itemId, item);
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

	function isBookmarkToggling(itemId: string) {
		return bookmarkMutation.isPending && bookmarkMutation.variables?.wordId === itemId;
	}
</script>

{#snippet wordRow(item: WordListItem)}
	{@const itemId = item.id ?? ''}
	{@const sourceWord = item.sourceWord ?? ''}
	<li class="list-none">
		<div
			class={cn(
				'flex w-full items-stretch gap-2 rounded-[10px] border border-line bg-surface transition-colors',
				isDetailPanelOpen ? 'px-3 py-2.5' : 'px-3 py-3',
				isDetailSelected(itemId) ? 'bg-highlight/35' : 'hover:bg-accent-soft'
			)}
			data-testid={E2E_TEST_IDS.inbox.row(itemId)}
		>
			{#if itemId}
				<div class="flex shrink-0 self-center">
					<WordBookmarkButton
						bookmarked={getWordBookmarked(item)}
						disabled={isBookmarkToggling(itemId)}
						ariaLabel={getWordBookmarked(item)
							? m['features.words.inbox.row.remove_bookmark']({ word: sourceWord })
							: m['features.words.inbox.row.add_bookmark']({ word: sourceWord })}
						dataTestId={E2E_TEST_IDS.inbox.rowBookmark(itemId)}
						onToggle={() => {
							bookmarkMutation.mutate({ wordId: itemId, bookmarkedOnlyFilter });
						}}
					/>
				</div>
			{/if}

			<div
				class="min-w-0 flex-1 cursor-pointer"
				role="button"
				tabindex="0"
				aria-pressed={isDetailSelected(itemId)}
				onclick={() => handleRowClick(itemId, item)}
				onkeydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						handleRowClick(itemId, item);
					}
				}}
			>
				<WordListRow {item} {itemId} compact={isDetailPanelOpen} />
			</div>
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
	<CapturedWordsListSkeleton compact={isDetailPanelOpen} />
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
			: m['features.words.inbox.empty.header']()}
		description={hasActiveFilters
			? m['features.words.inbox.empty.filtered_description']()
			: m['features.words.inbox.empty.description']()}
	/>
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
