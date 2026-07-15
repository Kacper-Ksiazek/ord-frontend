<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { createConversationQuery } from '$conversations/api-client/queries';
	import { Loader } from '$lib/components/utils/loader';
	import { StatusScreen } from '$lib/components/utils/status-screen';
	import * as m from '$lib/paraglide/messages.js';
	import { createConversationContext } from './contexts/conversation-context.svelte';
	import { createMessagesContext } from './contexts/messages-context.svelte';
	import { createSidepanelContext } from './contexts/sidepanel-context.svelte';

	type Props = {
		children: Snippet;
	};

	const { children }: Props = $props();

	let isLoaded = $state(false);
	const conversationId = $derived(page.params.id);
	const conversationQuery = $derived(createConversationQuery(conversationId));

	$effect(() => {
		const id = conversationId;
		isLoaded = false;

		const data = conversationQuery.data;

		if (data && data.id === id) {
			createMessagesContext(data);
			createConversationContext(data);
			createSidepanelContext();

			isLoaded = true;
		}
	});

	const pageTitle = $derived(
		conversationQuery.data
			? conversationQuery.data.topic
			: m['features.conversation.session.loading_title']()
	);
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#if conversationQuery.isError}
	<StatusScreen
		variant="error"
		header={m['features.conversation.session.load_error.header']()}
		description={conversationQuery.error?.message ||
			m['features.conversation.session.load_error.description_fallback']()}
		primaryButton={{
			label: m['features.conversation.session.load_error.try_again'](),
			onClick: () => conversationQuery.refetch()
		}}
	/>
{:else if !isLoaded}
	<Loader wrapperClass="flex-1 items-center justify-center" />
{:else}
	{@render children()}
{/if}
