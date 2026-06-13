<script lang="ts">
	import { createQAWOverviewQuery } from '$lib/api-client/quickly-added-words/queries';
	import { IconCard } from '$lib/components/data-display/icon-card';
	import { Button } from '$lib/components/actions/button';
	import { Loader } from '$lib/components/feedback/loader';
	import type { QAWOverviewResponse } from '$lib/types/quickly-added-word/api/overview';
	import type { QawListApprovalFilter } from '$lib/types/quickly-added-word/api/list-quickly-added-words';
	import { BookOpen, CheckCircle2, Clock3 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		overviewQuery: ReturnType<typeof createQAWOverviewQuery>;
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
		class="flex min-h-[104px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700/50"
		aria-busy="true"
		aria-label={m['features.quickly-added-words.list.overview.loading_aria_label']()}
	>
		<Loader wrapperClass="py-6" />
	</div>
{:else if overviewQuery.isError}
	<div
		class="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20"
		role="alert"
	>
		<p class="text-sm text-red-800 dark:text-red-200">
			{overviewQuery.error?.message ?? m['features.quickly-added-words.list.overview.error']()}
		</p>
		<Button type="OUTLINED" variant="PRIMARY" onClick={() => overviewQuery.refetch()}>
			{m['features.quickly-added-words.list.overview.try_again']()}
		</Button>
	</div>
{:else if overview}
	{@render statCards(overview)}
{/if}
