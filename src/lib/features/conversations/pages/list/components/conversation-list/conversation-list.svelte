<script lang="ts">
	import { goto } from '$app/navigation';
	import { createConversationsQuery } from '$conversations/api-client/queries';
	import { Loader } from '$lib/components/utils/loader';
	import ConversationListRow from './components/conversation-list-row.svelte';
	import { groupConversationsByRecencyBucket } from './utils/group-conversations-by-recency-bucket';
	import type { ConversationListFiltersState } from '$conversations/pages/list/state/conversation-list-state.svelte';
	import { StatusScreen } from '$lib/components/utils/status-screen';
	import type { RecencyBucket } from '$conversations/types';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		conversationsQuery: ReturnType<typeof createConversationsQuery>;
		filtersState: ConversationListFiltersState;
	}

	let { conversationsQuery, filtersState }: Props = $props();

	const groupedConversations = $derived(
		groupConversationsByRecencyBucket(conversationsQuery.data ?? [])
	);

	function recencyLabel(section: RecencyBucket): string {
		const key = `features.conversation.list.filters.recency.${section}` as keyof typeof m;
		const messageFn = m[key] as (() => string) | undefined;

		return messageFn?.() ?? section;
	}
</script>

{#snippet recencyBucketLabel(section: RecencyBucket)}
	<h2
		id="conversations-section-{section}"
		class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
	>
		{recencyLabel(section)}
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
			header={m['features.conversation.list.empty.no_matches.header']()}
			description={m['features.conversation.list.empty.no_matches.description']()}
			primaryButton={{
				label: m['features.conversation.list.empty.no_matches.clear_filters'](),
				onClick: () => filtersState.clearFilters()
			}}
		/>
	{:else}
		<StatusScreen
			variant="information"
			header={m['features.conversation.list.empty.no_conversations.header']()}
			description={m['features.conversation.list.empty.no_conversations.description']()}
		/>
	{/if}
{:else}
	<div
		class="flex flex-col gap-8"
		aria-label={m['features.conversation.list.empty.list_aria']()}
		data-testid={E2E_TEST_IDS.conversations.list}
	>
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
