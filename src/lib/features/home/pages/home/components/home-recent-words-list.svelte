<script lang="ts">
	import { goto } from '$app/navigation';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { getWordBookmarked } from '$words/api-client/utils/normalize-word-list-item';
	import WordBookmarkButton from '$words/pages/inbox/components/word-bookmark-button.svelte';
	import { WordListRow } from '$words/shared/components/word-list-row';
	import type { WordListItem } from '$words/types';
	import { ChevronRight } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		items: WordListItem[];
	}

	const { items }: Props = $props();
</script>

<ul class="flex flex-col gap-2">
	{#each items as item (item.id)}
		{@const itemId = item.id ?? ''}
		{@const sourceWord = item.sourceWord ?? ''}
		<li class="list-none">
			<div
				class="group flex w-full items-stretch gap-2 rounded-[10px] border border-line bg-surface px-3 py-3 transition-colors hover:bg-accent-soft"
				data-testid={E2E_TEST_IDS.home.recentWordRow(itemId)}
			>
				{#if itemId}
					<div class="flex shrink-0 self-center">
						<WordBookmarkButton
							bookmarked={getWordBookmarked(item)}
							disabled
							ariaLabel={getWordBookmarked(item)
								? m['features.words.inbox.row.remove_bookmark']({ word: sourceWord })
								: m['features.words.inbox.row.add_bookmark']({ word: sourceWord })}
							onToggle={() => {}}
						/>
					</div>
				{/if}

				<button
					type="button"
					class="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/15"
					onclick={() => goto('/words')}
				>
					<span class="min-w-0 flex-1">
						<WordListRow {item} {itemId} definitionLineClamp={1} />
					</span>
					<ChevronRight
						class="size-4 shrink-0 text-ink-subtle transition-colors group-hover:text-ink-muted"
						aria-hidden="true"
					/>
				</button>
			</div>
		</li>
	{/each}
</ul>
