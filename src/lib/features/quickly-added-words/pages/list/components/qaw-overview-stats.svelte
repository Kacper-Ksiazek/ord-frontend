<script lang="ts">
	import { createQawOverviewQuery } from '$quicklyAddedWords/api-client';
	import { IconCard } from '$lib/components/cards/icon-card';
	import { Button } from '$lib/components/buttons/button';
	import { Loader } from '$lib/components/utils/loader';
	import type { QAWOverviewResponse, QawListApprovalFilter } from '$quicklyAddedWords/types';
	import { BookOpen, CheckCircle2, Clock3 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		overviewQuery: ReturnType<typeof createQawOverviewQuery>;
		approvalFilter: QawListApprovalFilter;
		onApprovalFilterChange: (filter: QawListApprovalFilter) => void;
	}

	let { overviewQuery, approvalFilter, onApprovalFilterChange }: Props = $props();

	const overview = $derived(overviewQuery.data);

	function toggleFilter(filter: QawListApprovalFilter) {
		onApprovalFilterChange(approvalFilter === filter ? 'all' : filter);
	}
</script>

{#snippet statCards(data: QAWOverviewResponse)}
	<div
		class="flex flex-wrap gap-4"
		role="group"
		aria-label={m['features.quickly-added-words.list.overview.aria_label']()}
	>
		<IconCard
			title={m['features.quickly-added-words.list.overview.total']()}
			value={data.total}
			variant="primary"
			isActive={approvalFilter === 'all'}
			class="min-w-[140px] flex-1"
			aria-pressed={approvalFilter === 'all'}
			onclick={() => toggleFilter('all')}
		>
			{#snippet icon({ className })}
				<BookOpen class={className} />
			{/snippet}
		</IconCard>

		<IconCard
			title={m['features.quickly-added-words.list.overview.approved']()}
			value={data.approvedCount}
			variant="primary"
			isActive={approvalFilter === 'approved'}
			class="min-w-[140px] flex-1"
			aria-pressed={approvalFilter === 'approved'}
			onclick={() => toggleFilter('approved')}
		>
			{#snippet icon({ className })}
				<CheckCircle2 class={className} />
			{/snippet}
		</IconCard>

		<IconCard
			title={m['features.quickly-added-words.list.overview.pending']()}
			value={data.unapprovedCount}
			variant="primary"
			isActive={approvalFilter === 'pending'}
			class="min-w-[140px] flex-1"
			aria-pressed={approvalFilter === 'pending'}
			onclick={() => toggleFilter('pending')}
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
		aria-label={m['features.quickly-added-words.list.overview.loading_aria_label']()}
	>
		<Loader wrapperClass="py-6" />
	</div>
{:else if overviewQuery.isError}
	<div
		class="mb-6 flex flex-col items-start gap-3 rounded-[10px] border border-danger/25 bg-danger/5 p-4"
		role="alert"
	>
		<p class="text-sm text-danger">
			{overviewQuery.error?.message ?? m['features.quickly-added-words.list.overview.error']()}
		</p>
		<Button type="OUTLINED" variant="PRIMARY" onClick={() => overviewQuery.refetch()}>
			{m['features.quickly-added-words.list.overview.try_again']()}
		</Button>
	</div>
{:else if overview}
	{@render statCards(overview)}
{/if}
