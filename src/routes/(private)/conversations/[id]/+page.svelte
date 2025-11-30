<script lang="ts">
	import { page } from '$app/stores';
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { Loader } from '$lib/components/utils/loader';
	import { Alert, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	const conversationId = $derived($page.params.id);
	const conversationQuery = createConversationQuery(conversationId);
	const conversation = $derived(conversationQuery.data);
	const isLoading = $derived(conversationQuery.isLoading);
	const isError = $derived(conversationQuery.isError);
	const error = $derived(conversationQuery.error);

	const jsonString = $derived(conversation ? JSON.stringify(conversation, null, 2) : null);
</script>

<svelte:head>
	<title>Conversation {conversationId}</title>
</svelte:head>

<div class="p-6">
	<div class="mb-6 flex justify-between items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Conversation: {conversationId}
		</h1>
		<Button onclick={() => goto('/conversations')}>Back to Conversations</Button>
	</div>

	{#if isLoading}
		<div class="flex justify-center items-center py-12">
			<Loader />
		</div>
	{:else if isError}
		<Alert color="red" class="mb-4">
			<span class="font-medium">Error loading conversation</span>
			{error?.message || 'An unexpected error occurred'}
		</Alert>
	{:else if conversation && jsonString}
		<div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Raw JSON Response</h2>
			<pre
				class="overflow-auto p-4 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-800 dark:text-gray-200"><code
					>{jsonString}</code
				></pre>
		</div>
	{:else}
		<div class="text-center py-12">
			<p class="text-gray-600 dark:text-gray-400">No conversation data available</p>
		</div>
	{/if}
</div>
