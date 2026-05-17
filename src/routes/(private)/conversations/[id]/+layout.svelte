<script lang="ts">
	import { page } from '$app/state';
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { createConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import { createMessagesContext } from '$lib/features/conversations/pages/session/contexts/messages-context.svelte';
	import { createSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';

	const { children } = $props();

	let isLoaded = $state(false);
	const conversationQuery = createConversationQuery(page.params.id);

	$effect(() => {
		const data = conversationQuery.data;

		if (data) {
			createMessagesContext(data);
			createConversationContext(data);
			createSidepanelContext();

			isLoaded = true;
		}
	});

	const pageTitle = $derived(
		conversationQuery.data ? conversationQuery.data.topic : 'Loading conversation...'
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#if !isLoaded}
	<span>Loading conversation...</span>
{:else}
	{@render children()}
{/if}
