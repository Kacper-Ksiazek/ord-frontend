<script lang="ts">
	import { goto } from '$app/navigation';
	import { createConversationsQuery } from '$lib/api-client/conversation/queries';
	import { Loader } from '$lib/components/feedback/loader';
	import ConversationListRow from './components/conversation-list-row.svelte';
	import {
		groupConversationsByRecencyBucket,
		RECENCY_BUCKET_LABEL
	} from './utils/group-conversations-by-recency-bucket';
	import type { ConversationListFiltersState } from '$lib/features/conversations/pages/list/state/conversation-list-state.svelte';
	import { StatusScreen } from '$lib/components/feedback/status-screen';
	import type { RecencyBucket } from '$lib/types/conversation/domain/conversation';

	interface Props {
		conversationsQuery: ReturnType<typeof createConversationsQuery>;
		filtersState: ConversationListFiltersState;
	}

	let { conversationsQuery, filtersState }: Props = $props();

	const groupedConversations = $derived(
		groupConversationsByRecencyBucket(conversationsQuery.data ?? [])
	);
</script>

{#snippet recencyBucketLabel(section: RecencyBucket)}
	<h2
		id="conversations-section-{section}"
		class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
	>
		{RECENCY_BUCKET_LABEL[section]}
	</h2>
{/snippet}

{#if conversationsQuery.isLoading}
	<div class="flex items-center justify-center py-16">
		<Loader />
	</div>
{:else if conversationsQuery.data?.length === 0}
	{#if filtersState.hasActiveFilters}
		<StatusScreen
			variant="information"
			header="No conversations match your filters"
			description="Try adjusting or clearing your filters to see more results."
			primaryButton={{
				label: 'Clear filters',
				onClick: () => filtersState.clearFilters()
			}}
		/>
	{:else}
		<StatusScreen
			variant="information"
			header="No conversations yet"
			description="Start a guided session to practice speaking and get feedback on your messages."
		/>
	{/if}
{:else}
	<div class="flex flex-col gap-8" aria-label="Your conversations">
		{#each groupedConversations as { section, items } (section)}
			<section class="min-w-0" aria-labelledby="conversations-section-{section}">
				{@render recencyBucketLabel(section)}

				<ul class="flex flex-col gap-3 p-0">
					{#each items as conversation (conversation.id)}
						<ConversationListRow
							{conversation}
							onclick={() => goto(`/conversations/${conversation.id}`)}
						/>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
{/if}
