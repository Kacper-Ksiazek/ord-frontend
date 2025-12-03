<script lang="ts">
	import { page } from '$app/state';
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import {
		conversationStore,
		conversationMessagesStore
	} from '$lib/features/conversations/pages/session/stores';

	const { children } = $props();

	const conversationQuery = createConversationQuery(page.params.id);

	$effect(() => {
		const data = conversationQuery.data;

		if (data) {
			conversationStore.create(data);
			conversationMessagesStore.create(data);
		}
	});

	const pageTitle = $derived(
		conversationQuery.data ? conversationQuery.data.topic : 'Loading conversation...'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#if !conversationStore.isLoaded}
	<span>Loading conversation...</span>
{:else}
	{@render children()}
{/if}
