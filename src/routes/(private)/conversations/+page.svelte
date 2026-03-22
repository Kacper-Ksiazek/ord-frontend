<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { createConversationsQuery } from '$lib/api-client/conversation/queries';
	import { Loader } from '$lib/components/utils/loader';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { Breadcrumbs } from '$lib/components/navigation/breadcrumbs';
	import { Alert, Button } from 'flowbite-svelte';
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import { ConversationListRow } from '$lib/features/conversations/pages/list';
	import { conversationListFiltersFromSearchParams } from '$lib/features/conversations/pages/list/conversation-list-filters';
	import {
		groupConversationsByRecencyBucket,
		RECENCY_BUCKET_LABEL
	} from '$lib/features/conversations/pages/list/group-conversations-by-recency-bucket';

	const conversationsQuery = createConversationsQuery(() =>
		conversationListFiltersFromSearchParams(page.url.searchParams)
	);
	const conversations = $derived(conversationsQuery.data ?? []);
	const sortedConversations = $derived(
		[...conversations].sort(
			(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		)
	);
	const groupedConversations = $derived(groupConversationsByRecencyBucket(sortedConversations));
	const isLoading = $derived(conversationsQuery.isLoading);
	const isError = $derived(conversationsQuery.isError);
	const error = $derived(conversationsQuery.error);

	const breadcrumbItems = $derived([
		{ label: m['features.conversation.create.form.breadcrumb.home'](), onClick: () => goto('/') },
		{ label: m['features.conversation.create.form.breadcrumb.conversations']() }
	]);
</script>

<svelte:head>
	<title>Conversations</title>
</svelte:head>

<PageContentContainer>
	<ContentCard class="p-6">
		<Breadcrumbs items={breadcrumbItems} class="mb-6" />

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

		{#if isLoading}
			<div class="flex items-center justify-center py-16">
				<Loader />
			</div>
		{:else if isError}
			<Alert color="red" class="mb-4">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<span class="font-medium">Couldn’t load conversations</span>
						<p class="mt-1 text-sm">{error?.message || 'Something went wrong. Try again.'}</p>
					</div>
					<Button color="red" outline onclick={() => conversationsQuery.refetch()}>Retry</Button>
				</div>
			</Alert>
		{:else if sortedConversations.length === 0}
			<div
				class="rounded-xl border border-primary-200 bg-primary-50 px-6 py-12 text-center dark:border-primary-800 dark:bg-primary-900/20"
			>
				<h2 class="text-lg font-semibold text-gray-900 dark:text-white">No conversations yet</h2>
				<p class="mx-auto mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
					Start a guided session to practice speaking and get feedback on your messages.
				</p>
				<Button class="mt-6" onclick={() => goto('/conversations/create')}
					>Create your first conversation</Button
				>
			</div>
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
