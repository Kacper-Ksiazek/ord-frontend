<script lang="ts">
	import type { HomeActivityDay, HomeResponse } from '$home/types';
	import HomeCountTrendChart from './home-count-trend-chart.svelte';
	import { WORD_TYPES } from '$words/shared/constants';
	import { getWordTypeBarFillClass, getWordTypeLabel } from '$words/shared/constants';
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { BookOpen, Gamepad2, MessageSquare } from 'lucide-svelte';
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
		}).sort((a, b) => b.count - a.count)
	);

	const showGameCounts = $derived(home.games.total != null && home.games.last30Days != null);

	const typeBarAriaLabel = $derived(
		typeRows.map((row) => `${getWordTypeLabel(row.type)}: ${row.count}`).join(', ')
	);
</script>

{#snippet cardHeader(title: string, Icon: LucideIcon)}
	<div class="flex min-w-0 items-center gap-2">
		<Icon class="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
		<h2 class="text-base font-semibold tracking-tight text-ink">{title}</h2>
	</div>
{/snippet}

{#snippet heroMetric(value: number)}
	<p
		class="text-4xl font-bold tabular-nums leading-none tracking-tight text-ink"
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
	trendChartTestId: string
)}
	<div class="flex min-w-0 items-stretch gap-8">
		<div class="flex min-w-0 flex-1 flex-col justify-between gap-2">
			{@render cardHeader(title, Icon)}
			{@render heroMetric(value)}
		</div>
		<HomeCountTrendChart
			days={trendDays}
			ariaLabel={trendAriaLabel}
			data-testid={trendChartTestId}
			class="w-[220px] shrink-0 p-1"
		/>
	</div>
{/snippet}

<div class="grid w-full grid-cols-3 gap-3">
	<section
		class="flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		data-testid={E2E_TEST_IDS.home.wordsCard}
	>
		{@render cardSummaryTop(
			m['features.home.home.words_title'](),
			BookOpen,
			home.words.total ?? 0,
			home.trends?.wordsAdded ?? [],
			m['features.home.home.words_trend_chart_aria'](),
			E2E_TEST_IDS.home.wordsTrendChart
		)}
		<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
			{@render dotStat(m['features.home.home.this_month_stat'](), home.words.addedLast30Days ?? 0)}
		</div>
		{#if typeRows.length === 0}
			<p class="text-sm text-ink-subtle">{m['features.home.home.words_by_type_empty']()}</p>
		{:else}
			<div class="flex h-2.5 w-full gap-1" role="img" aria-label={typeBarAriaLabel}>
				{#each typeRows as row (row.type)}
					<div
						class="h-full min-w-[3px] rounded-full {getWordTypeBarFillClass(row.type)}"
						style={`flex: ${row.count} 1 0`}
						title={`${getWordTypeLabel(row.type)}: ${row.count}`}
					></div>
				{/each}
			</div>
		{/if}
	</section>

	<section
		class="flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		data-testid={E2E_TEST_IDS.home.conversationsCard}
	>
		{@render cardSummaryTop(
			m['features.home.home.conversations_title'](),
			MessageSquare,
			home.conversations.total ?? 0,
			home.trends?.conversationsCreated ?? [],
			m['features.home.home.conversations_trend_chart_aria'](),
			E2E_TEST_IDS.home.conversationsTrendChart
		)}
		<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
			{@render dotStat(
				m['features.home.home.this_month_stat'](),
				home.conversations.createdLast30Days ?? 0
			)}
			{@render dotStat(
				m['features.home.home.messages_total'](),
				home.conversations.messagesTotal ?? 0
			)}
			{@render dotStat(
				m['features.home.home.messages_last_30'](),
				home.conversations.messagesLast30Days ?? 0
			)}
		</div>
	</section>

	<section
		class="relative flex min-w-0 flex-col gap-3 rounded-[10px] border border-line bg-surface p-4"
		data-testid={E2E_TEST_IDS.home.gamesCard}
	>
		<span
			class="pointer-events-none absolute right-3 top-3 label-small shrink-0 whitespace-nowrap rounded-md border border-line bg-surface px-2.5 py-1 text-ink-muted"
			role="status"
			data-testid={E2E_TEST_IDS.home.gamesComingSoon}
		>
			{m['features.home.home.games_coming_soon']()}
		</span>

		{#if showGameCounts}
			<div class="flex flex-col gap-3" data-testid={E2E_TEST_IDS.home.gamesCounts}>
				{@render cardSummaryTop(
					m['features.home.home.games_title'](),
					Gamepad2,
					home.games.total ?? 0,
					home.trends?.gamesFinished ?? [],
					m['features.home.home.games_trend_chart_aria'](),
					E2E_TEST_IDS.home.gamesTrendChart
				)}
				<div class="flex flex-col gap-2 border-t border-line-subtle pt-3">
					{@render dotStat(m['features.home.home.this_month_stat'](), home.games.last30Days ?? 0)}
				</div>
			</div>
		{:else}
			{@render cardSummaryTop(
				m['features.home.home.games_title'](),
				Gamepad2,
				0,
				home.trends?.gamesFinished ?? [],
				m['features.home.home.games_trend_chart_aria'](),
				E2E_TEST_IDS.home.gamesTrendChart
			)}
		{/if}
	</section>
</div>
