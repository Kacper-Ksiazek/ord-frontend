<script lang="ts">
	import type { HomeResponse } from '$home/types';
	import type { WordType } from '$words/types';
	import { WORD_TYPES } from '$words/shared/constants';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		home: HomeResponse;
	}

	const { home }: Props = $props();

	const typeRows = $derived(
		WORD_TYPES.flatMap((type) => {
			const count = home.words.byType?.[type];

			if (count === undefined || count <= 0) {
				return [];
			}

			return [{ type, count }];
		})
	);

	const showGameCounts = $derived(home.games.total != null && home.games.last30Days != null);

	function wordTypeLabel(type: WordType): string {
		switch (type) {
			case 'NOUN':
				return m['features.home.home.word_type.noun']();
			case 'VERB':
				return m['features.home.home.word_type.verb']();
			case 'ADJECTIVE':
				return m['features.home.home.word_type.adjective']();
			case 'ADVERB':
				return m['features.home.home.word_type.adverb']();
			case 'IDIOM':
				return m['features.home.home.word_type.idiom']();
			case 'PHRASE':
				return m['features.home.home.word_type.phrase']();
		}
	}
</script>

{#snippet stat(label: string, value: number)}
	<div class="flex items-baseline justify-between gap-3">
		<span class="text-sm text-ink-muted">{label}</span>
		<span class="text-sm font-medium tabular-nums text-ink">{value}</span>
	</div>
{/snippet}

<div class="grid w-full grid-cols-3 gap-3">
	<section
		class="flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		data-testid={E2E_TEST_IDS.home.wordsCard}
	>
		<h2 class="text-sm font-medium text-ink-muted">{m['features.home.home.words_title']()}</h2>
		<p class="text-2xl font-semibold tabular-nums text-ink">{home.words.total ?? 0}</p>
		{@render stat(
			m['features.home.home.words_added_last_30'](),
			home.words.addedLast30Days ?? 0
		)}
		{#if typeRows.length === 0}
			<p class="text-sm text-ink-subtle">{m['features.home.home.words_by_type_empty']()}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each typeRows as row (row.type)}
					<li class="flex items-baseline justify-between gap-3 text-sm">
						<span class="text-ink-muted">{wordTypeLabel(row.type)}</span>
						<span class="font-medium tabular-nums text-ink">{row.count}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<section
		class="flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		data-testid={E2E_TEST_IDS.home.conversationsCard}
	>
		<h2 class="text-sm font-medium text-ink-muted">
			{m['features.home.home.conversations_title']()}
		</h2>
		{@render stat(m['features.home.home.conversations_total'](), home.conversations.total ?? 0)}
		{@render stat(m['features.home.home.messages_total'](), home.conversations.messagesTotal ?? 0)}
		{@render stat(
			m['features.home.home.conversations_last_30'](),
			home.conversations.createdLast30Days ?? 0
		)}
		{@render stat(
			m['features.home.home.messages_last_30'](),
			home.conversations.messagesLast30Days ?? 0
		)}
	</section>

	<section
		class="flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		data-testid={E2E_TEST_IDS.home.gamesCard}
	>
		<h2 class="text-sm font-medium text-ink-muted">{m['features.home.home.games_title']()}</h2>
		<p class="text-sm text-ink" data-testid={E2E_TEST_IDS.home.gamesComingSoon}>
			{m['features.home.home.games_coming_soon']()}
		</p>
		{#if showGameCounts}
			<div class="flex flex-col gap-3" data-testid={E2E_TEST_IDS.home.gamesCounts}>
				{@render stat(m['features.home.home.games_total'](), home.games.total ?? 0)}
				{@render stat(m['features.home.home.games_last_30'](), home.games.last30Days ?? 0)}
			</div>
		{/if}
	</section>
</div>
