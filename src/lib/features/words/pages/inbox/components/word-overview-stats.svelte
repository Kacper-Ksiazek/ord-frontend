<script lang="ts">
	import { createWordOverviewQuery } from '$words/api-client';
	import { IconCard } from '$lib/components/cards/icon-card';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import type { WordOverviewResponse, WordStatusFilter } from '$words/types';
	import { BookOpen, CircleCheck, Clock3 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		overviewQuery: ReturnType<typeof createWordOverviewQuery>;
		statusFilter: WordStatusFilter;
		onStatusFilterChange: (filter: WordStatusFilter) => void;
	}

	let { overviewQuery, statusFilter, onStatusFilterChange }: Props = $props();

	const overview = $derived(overviewQuery.data);

	function toggleFilter(filter: WordStatusFilter) {
		onStatusFilterChange(statusFilter === filter ? 'all' : filter);
	}
</script>

{#snippet statCards(data: WordOverviewResponse)}
	<div
		class="flex flex-wrap gap-4"
		role="group"
		aria-label={m['features.words.inbox.overview.aria_label']()}
	>
		<IconCard
			title={m['features.words.inbox.overview.total']()}
			value={data.total ?? 0}
			variant="primary"
			isActive={statusFilter === 'all'}
			class="min-w-[140px] flex-1"
			aria-pressed={statusFilter === 'all'}
			onclick={() => toggleFilter('all')}
		>
			{#snippet icon({ className })}
				<BookOpen class={className} />
			{/snippet}
		</IconCard>

		<IconCard
			title={m['features.words.inbox.overview.active']()}
			value={data.activeCount ?? 0}
			variant="primary"
			isActive={statusFilter === 'active'}
			class="min-w-[140px] flex-1"
			aria-pressed={statusFilter === 'active'}
			onclick={() => toggleFilter('active')}
		>
			{#snippet icon({ className })}
				<CircleCheck class={className} />
			{/snippet}
		</IconCard>

		<IconCard
			title={m['features.words.inbox.overview.captured']()}
			value={data.capturedCount ?? 0}
			variant="primary"
			isActive={statusFilter === 'captured'}
			class="min-w-[140px] flex-1"
			aria-pressed={statusFilter === 'captured'}
			onclick={() => toggleFilter('captured')}
		>
			{#snippet icon({ className })}
				<Clock3 class={className} />
			{/snippet}
		</IconCard>
	</div>
{/snippet}

{#if overviewQuery.isPending}
	<div
		class="mb-6 flex min-h-[104px] items-center justify-center rounded-[10px] border border-line bg-surface"
		aria-busy="true"
		aria-label={m['features.words.inbox.overview.loading_aria_label']()}
	>
		<Loader wrapperClass="py-6" />
	</div>
{:else if overviewQuery.isError}
	<div
		class="mb-6 flex flex-col items-start gap-3 rounded-[10px] border border-danger/25 bg-danger/5 p-4"
		role="alert"
	>
		<p class="text-sm text-danger">
			{overviewQuery.error?.message ?? m['features.words.inbox.overview.error']()}
		</p>
		<Button type="OUTLINED" variant="PRIMARY" onClick={() => overviewQuery.refetch()}>
			{m['features.words.inbox.overview.try_again']()}
		</Button>
	</div>
{:else if overview}
	{@render statCards(overview)}
{/if}
