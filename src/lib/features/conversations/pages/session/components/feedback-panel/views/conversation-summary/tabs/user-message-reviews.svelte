<script lang="ts">
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import UserMessageReviewListWithFilters from '../../../components/user-message-review-list-with-filters/user-message-review-list-with-filters.svelte';

	const messagesContext = getMessagesContext();
</script>

<UserMessageReviewListWithFilters
	data={messagesContext.messages.filter((msg) => msg.sender === 'USER')}
/>
