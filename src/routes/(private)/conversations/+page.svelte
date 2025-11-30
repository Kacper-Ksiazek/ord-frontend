<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { goto } from '$app/navigation';
	import { createConversationsQuery } from '$lib/api-client/conversation/queries';
	import { Loader } from '$lib/components/utils/loader';
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import { Alert, Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';
	import ContentCard from '$lib/components/utils/content-card.svelte';

	const conversationsQuery = createConversationsQuery();
	const conversations = $derived(conversationsQuery.data ?? []);
	const isLoading = $derived(conversationsQuery.isLoading);
	const isError = $derived(conversationsQuery.isError);
	const error = $derived(conversationsQuery.error);
</script>

<svelte:head>
	<title>Conversations</title>
</svelte:head>

<PageContentContainer>
	<ContentCard class="p-6">
		<Breadcrumb>
			<BreadcrumbItem href="/" home
				>{m['features.conversation.create.form.breadcrumb.home']()}</BreadcrumbItem
			>
			<BreadcrumbItem>
				<span class="text-black dark:text-white"
					>{m['features.conversation.create.form.breadcrumb.conversations']()}</span
				></BreadcrumbItem
			>
		</Breadcrumb>

		<div class="mb-6 flex justify-between items-center">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Conversations</h1>
			<Button onclick={() => goto('/conversations/create')}>New Conversation</Button>
		</div>
		{#if isLoading}
			<div class="flex justify-center items-center py-12">
				<Loader />
			</div>
		{:else if isError}
			<Alert color="red" class="mb-4">
				<span class="font-medium">Error loading conversations</span>
				{error?.message || 'An unexpected error occurred'}
			</Alert>
		{:else if conversations.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-600 dark:text-gray-400 mb-4">No conversations yet</p>
				<Button onclick={() => goto('/conversations/create')}>Create your first conversation</Button>
			</div>
		{:else}
			<div class="space-y-4">
				{#each conversations as conversation (conversation.id)}
					<button
						type="button"
						class="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer transition-colors"
						onclick={() => goto(`/conversations/${conversation.id}`)}
					>
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
									{conversation.topic}
								</h3>
								<div class="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
									<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
										{conversation.type.replace(/_/g, ' ')}
									</span>
									<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
										{conversation.language}
									</span>
									{#if conversation.aiInterlocutorName}
										<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
											{conversation.aiInterlocutorName}
										</span>
									{/if}
								</div>
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-400 ml-4">
								{new Date(conversation.createdAt).toLocaleDateString()}
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</ContentCard>
</PageContentContainer>
