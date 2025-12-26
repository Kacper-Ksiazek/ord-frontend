<script lang="ts">
	import { PageContentContainer } from '$lib/components/utils/page-content-container';
	import {
		FeedbackPanel,
		MessagesPanel
	} from '$lib/features/conversations/pages/session/components';
	import { onMount } from 'svelte';
	import isEmpty from 'lodash/isEmpty';
	import { getMessagesContext } from '$lib/features/conversations/pages/session/contexts/messages-context.svelte';
	import { initializeConversationByAI } from '$lib/api-client/ongoing-conversation/sse/initialize-conversation-by-ai';
	import { page } from '$app/state';

	onMount(() => {
		const messagesContext = getMessagesContext();

		if (isEmpty(messagesContext.messages)) {
			messagesContext.isGenerating = true;
			messagesContext.messages.push({ sender: 'AI', content: '' });

			initializeConversationByAI(page.params.id).subscribe({
				next: (data) => {
					messagesContext.messages[0].content += data;
				},
				complete: () => {
					messagesContext.isGenerating = false;
				},
				error: () => {
					messagesContext.isGenerating = false;
				}
			});
		}
	});
</script>

<PageContentContainer layout="superwide" contentClass="gap-0">
	<MessagesPanel />

	<FeedbackPanel />
</PageContentContainer>
