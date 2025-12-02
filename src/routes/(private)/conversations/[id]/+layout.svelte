<script lang="ts">
	import { page } from '$app/state';
	import { createConversationQuery } from '$lib/api-client/conversation/queries';
	import { conversationStore } from '$lib/features/conversations/pages/session/stores';

	const { children } = $props();

	const conversationQuery = createConversationQuery(page.params.id);

	$effect(() => {
		if (conversationQuery.data) {
			conversationStore.initialize(conversationQuery.data);
		}
	});
</script>

{@render children()}
