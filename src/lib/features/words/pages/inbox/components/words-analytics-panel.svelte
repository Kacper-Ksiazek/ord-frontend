<script lang="ts">
	import type { CreateQueryResult } from '@tanstack/svelte-query';
	import type { WordOverviewResponse } from '$words/types';
	import { IconCard } from '$lib/components/cards/icon-card';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import { Bookmark, BookOpen } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$words/testing/test-ids';

	interface Props {
		overviewQuery: CreateQueryResult<WordOverviewResponse, Error>;
		hasLearningLanguage: boolean;
	}

	let { overviewQuery, hasLearningLanguage }: Props = $props();

	const totalWords = $derived(overviewQuery.data?.total ?? 0);
	const bookmarkedCount = $derived(overviewQuery.data?.bookmarkedCount ?? 0);
</script>

<div class="min-h-0 flex-1 overflow-y-auto" data-testid={E2E_TEST_IDS.inbox.analyticsPanel}>
	{#if !hasLearningLanguage}
		<StatusPanel
			variant="information"
			header={m['features.words.inbox.empty.header']()}
			description={m['features.words.capture-popover.save_no_language']()}
		/>
	{:else if overviewQuery.isLoading}
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="h-28 animate-pulse rounded-2xl bg-surface-muted"></div>
			<div class="h-28 animate-pulse rounded-2xl bg-surface-muted"></div>
		</div>
	{:else if overviewQuery.isError}
		<StatusPanel
			variant="error"
			header={m['features.words.inbox.analytics.load_error.header']()}
			description={overviewQuery.error?.message ||
				m['features.words.inbox.analytics.load_error.description']()}
			primaryButton={{
				label: m['features.words.inbox.load_error.try_again'](),
				onClick: () => overviewQuery.refetch()
			}}
		/>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2">
			<IconCard
				title={m['features.words.inbox.analytics.total_words']()}
				value={totalWords}
				variant="primary"
				data-testid={E2E_TEST_IDS.inbox.analyticsTotalWords}
			>
				{#snippet icon({ className })}
					<BookOpen class={className} />
				{/snippet}
			</IconCard>

			<IconCard
				title={m['features.words.inbox.analytics.bookmarked_words']()}
				value={bookmarkedCount}
				variant="blue"
				data-testid={E2E_TEST_IDS.inbox.analyticsBookmarkedWords}
			>
				{#snippet icon({ className })}
					<Bookmark class={className} />
				{/snippet}
			</IconCard>
		</div>
	{/if}
</div>
