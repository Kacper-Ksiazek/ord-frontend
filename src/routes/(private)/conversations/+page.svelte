<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { createConversationsQuery } from '$lib/api-client/conversation/queries';
	import { Loader } from '$lib/components/utils/loader';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import {
		ConversationListFiltersBar,
		ConversationListRow
	} from '$lib/features/conversations/pages/list';
	import {
		groupConversationsByRecencyBucket,
		RECENCY_BUCKET_LABEL
	} from '$lib/features/conversations/pages/list/group-conversations-by-recency-bucket';
	import { ConversationListFiltersState } from '$conversations/pages/list/state/conversation-list-state.svelte';
	import { StatusScreen } from '$lib/components/utils/status-screen';

	const filtersState = new ConversationListFiltersState(page.url.searchParams);

	const conversationsQuery = createConversationsQuery(() => filtersState.queryPayload);

	const groupedConversations = $derived(
		groupConversationsByRecencyBucket(conversationsQuery.data ?? [])
	);
</script>

<svelte:head>
	<title>Conversations</title>
</svelte:head>

{#if conversationsQuery.isError}
	<StatusScreen
		variant="error"
		header="Couldn't load conversations"
		description={conversationsQuery.error?.message || 'Something went wrong. Try again.'}
		primaryButton={{ label: 'Try again', onClick: () => conversationsQuery.refetch() }}
	/>
{:else}
	<PageContentContainer>
		<ContentCard class="p-6">
			<Breadcrumb class="mb-6">
				<BreadcrumbItem href="/" home>
					{m['features.conversation.create.form.breadcrumb.home']()}
				</BreadcrumbItem>

				<BreadcrumbItem>
					{m['features.conversation.create.form.breadcrumb.conversations']()}
				</BreadcrumbItem>
			</Breadcrumb>

			<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Conversations</h1>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
						Continue a practice chat or start a new one.
					</p>
				</div>
				<Button class="w-full shrink-0 sm:w-auto" onclick={() => goto('/conversations/create')}
					>New conversation</Button
				>
			</div>

			<ConversationListFiltersBar {filtersState} />

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
						primaryButton={{ label: 'Clear filters', onClick: () => filtersState.clearFilters() }}
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
							<h2
								id="conversations-section-{section}"
								class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
							>
								{RECENCY_BUCKET_LABEL[section]}
							</h2>
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
		</ContentCard>
	</PageContentContainer>
{/if}
