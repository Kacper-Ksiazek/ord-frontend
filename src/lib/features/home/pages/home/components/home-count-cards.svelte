<script lang="ts">
	import type { HomeActivityDay, HomeResponse } from '$home/types';
	import HomeCountCardEmptyFooter from './home-count-card-empty-footer.svelte';
	import HomeGamesComingSoonCard from './home-games-coming-soon-card.svelte';
	import HomeCountTrendChart from './home-count-trend-chart.svelte';
	import { WORD_TYPES } from '$words/shared/constants';
	import { getWordTypeBarFillClass, getWordTypeLabel } from '$words/shared/constants';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { cn } from '$lib/utils/cn';
	import { BookOpen, Gamepad2, MessageSquare } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		home: HomeResponse;
	}

	const { home }: Props = $props();
	const words = $derived(home.overviews?.words);
	const conversations = $derived(home.overviews?.conversations);
	const games = $derived(home.overviews?.games);

	const typeRows = $derived(
		WORD_TYPES.flatMap((type) => {
			const count = words?.byType?.[type];

			if (count === undefined || count <= 0) {
				return [];
			}

			return [{ type, count }];
		}).sort((a, b) => b.count - a.count)
	);

	const showGameCounts = $derived(games?.total != null && games?.last30Days != null);
	const isGamesComingSoon = $derived(games?.comingSoon || !showGameCounts);

	const isWordsCardEmpty = $derived((words?.total ?? 0) === 0);
	const isConversationsCardEmpty = $derived((conversations?.total ?? 0) === 0);
	const isGamesCardEmpty = $derived((games?.total ?? 0) === 0);

	const typeBarAriaLabel = $derived(
		typeRows.map((row) => `${getWordTypeLabel(row.type)}: ${row.count}`).join(', ')
	);

	function countCardSectionClass(isEmpty: boolean) {
		return cn(
			'flex min-h-[260px] min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4',
			isEmpty && 'h-full'
		);
	}

	const emptyFooterClass = 'min-h-0 flex-1';
</script>

{#snippet cardHeader(title: string, Icon: LucideIcon)}
	<div class="flex min-w-0 items-center gap-2">
		<Icon class="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
		<h2 class="text-base font-semibold tracking-tight text-ink">{title}</h2>
	</div>
{/snippet}

{#snippet heroMetric(value: number, disabled: boolean)}
	<p
		class={cn(
			'text-4xl font-bold tabular-nums leading-none tracking-tight',
			disabled ? 'text-ink-subtle' : 'text-ink'
		)}
		aria-label={String(value)}
	>
		{value}
	</p>
{/snippet}

{#snippet dotStat(label: string, value: number)}
	<div class="flex items-center justify-between gap-3">
		<span class="flex min-w-0 items-center gap-2 text-sm capitalize text-ink-muted">
			<span class="size-1.5 shrink-0 rounded-full bg-ink-muted" aria-hidden="true"></span>
			{label}
		</span>
		<span class="text-sm font-bold tabular-nums text-ink">{value}</span>
	</div>
{/snippet}

{#snippet cardSummaryTop(
	title: string,
	Icon: LucideIcon,
	value: number,
	trendDays: HomeActivityDay[],
	trendAriaLabel: string,
	trendChartTestId: string,
	trendChartDisabled: boolean
)}
	<div class="grid min-w-0 grid-cols-[minmax(0,3fr)_minmax(0,7fr)] items-stretch gap-3">
		<div class="flex min-w-0 flex-col justify-between gap-2">
			{@render cardHeader(title, Icon)}
			{@render heroMetric(value, trendChartDisabled)}
		</div>
		<HomeCountTrendChart
			days={trendDays}
			ariaLabel={trendAriaLabel}
			disabled={trendChartDisabled}
			data-testid={trendChartTestId}
			class="min-w-0 w-full p-1"
		/>
	</div>
{/snippet}

<div class="grid w-full grid-cols-3 items-stretch gap-3">
	<section class={countCardSectionClass(isWordsCardEmpty)} data-testid={E2E_TEST_IDS.home.wordsCard}>
		{@render cardSummaryTop(
			m['features.home.home.words_title'](),
			BookOpen,
			words?.total ?? 0,
			words?.trend ?? [],
			m['features.home.home.words_trend_chart_aria'](),
			E2E_TEST_IDS.home.wordsTrendChart,
			isWordsCardEmpty
		)}
		{#if isWordsCardEmpty}
			<HomeCountCardEmptyFooter
				title={m['features.home.home.count_card_empty.words_title']()}
				description={m['features.home.home.count_card_empty.words_description']()}
				class={emptyFooterClass}
				data-testid={E2E_TEST_IDS.home.wordsCardEmpty}
			/>
		{:else}
			<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
				{#if typeRows.length === 0}
					<p class="text-sm text-ink-subtle">{m['features.home.home.words_by_type_empty']()}</p>
				{:else}
					<div class="flex flex-col gap-2">
						<div class="flex h-2.5 w-full gap-1" role="img" aria-label={typeBarAriaLabel}>
							{#each typeRows as row (row.type)}
								<div
									class="h-full min-w-[3px] rounded-full {getWordTypeBarFillClass(row.type)}"
									style={`flex: ${row.count} 1 0`}
									title={`${getWordTypeLabel(row.type)}: ${row.count}`}
								></div>
							{/each}
						</div>
						<ul
							class="flex flex-wrap gap-x-3 gap-y-1.5"
							aria-label={typeBarAriaLabel}
							data-testid={E2E_TEST_IDS.home.wordsTypeLegend}
						>
							{#each typeRows as row (row.type)}
								<li class="flex list-none items-center gap-1.5">
									<span
										class="size-2 shrink-0 rounded-full {getWordTypeBarFillClass(row.type)}"
										aria-hidden="true"
									></span>
									<span class="text-xs text-ink-muted">{getWordTypeLabel(row.type)}</span>
									<span class="text-xs font-semibold tabular-nums text-ink">{row.count}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
			<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
				{@render dotStat(m['features.home.home.this_month_stat'](), words?.addedLast30Days ?? 0)}
			</div>
		{/if}
	</section>

	<section
		class={countCardSectionClass(isConversationsCardEmpty)}
		data-testid={E2E_TEST_IDS.home.conversationsCard}
	>
		{@render cardSummaryTop(
			m['features.home.home.conversations_title'](),
			MessageSquare,
			conversations?.total ?? 0,
			conversations?.createdTrend ?? [],
			m['features.home.home.conversations_trend_chart_aria'](),
			E2E_TEST_IDS.home.conversationsTrendChart,
			isConversationsCardEmpty
		)}
		{#if isConversationsCardEmpty}
			<HomeCountCardEmptyFooter
				title={m['features.home.home.count_card_empty.conversations_title']()}
				description={m['features.home.home.count_card_empty.conversations_description']()}
				class={emptyFooterClass}
				data-testid={E2E_TEST_IDS.home.conversationsCardEmpty}
			/>
		{:else}
			<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
				{@render dotStat(
					m['features.home.home.this_month_stat'](),
					conversations?.createdLast30Days ?? 0
				)}
				{@render dotStat(m['features.home.home.messages_total'](), conversations?.messagesTotal ?? 0)}
				{@render dotStat(
					m['features.home.home.messages_last_30'](),
					conversations?.messagesLast30Days ?? 0
				)}
			</div>
		{/if}
	</section>

	<section
		class={cn(countCardSectionClass(isGamesComingSoon || isGamesCardEmpty), 'h-full')}
		data-testid={E2E_TEST_IDS.home.gamesCard}
	>
		{#if isGamesComingSoon}
			<HomeGamesComingSoonCard />
		{:else}
			<div
				class={cn('flex flex-col gap-3', isGamesCardEmpty && 'min-h-0 flex-1')}
				data-testid={E2E_TEST_IDS.home.gamesCounts}
			>
				{@render cardSummaryTop(
					m['features.home.home.games_title'](),
					Gamepad2,
					games?.total ?? 0,
					games?.trend ?? [],
					m['features.home.home.games_trend_chart_aria'](),
					E2E_TEST_IDS.home.gamesTrendChart,
					isGamesCardEmpty
				)}
				{#if isGamesCardEmpty}
					<HomeCountCardEmptyFooter
						title={m['features.home.home.count_card_empty.games_title']()}
						description={m['features.home.home.count_card_empty.games_description']()}
						class={emptyFooterClass}
						data-testid={E2E_TEST_IDS.home.gamesCardEmpty}
					/>
				{:else}
					<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
						{@render dotStat(m['features.home.home.this_month_stat'](), games?.last30Days ?? 0)}
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>
