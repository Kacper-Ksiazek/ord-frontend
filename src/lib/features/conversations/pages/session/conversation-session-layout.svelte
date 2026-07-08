<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { createConversationQuery } from '$conversations/api-client/queries';
	import { createConversationContext } from './contexts/conversation-context.svelte';
	import { createMessagesContext } from './contexts/messages-context.svelte';
	import { createSidepanelContext } from './contexts/sidepanel-context.svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();

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
