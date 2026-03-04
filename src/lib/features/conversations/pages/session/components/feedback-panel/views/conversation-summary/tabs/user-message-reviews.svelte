<script lang="ts">
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import type { UserMessageReviewFilters } from '../../../components/user-message-reviews-list-with-filters/lib/filters';
	import UserMessageReviewListWithFilters from '../../../components/user-message-reviews-list-with-filters/user-message-review-list-with-filters.svelte';

	const messagesContext = getMessagesContext();

	let filters = $state<UserMessageReviewFilters>({
		category: 'ALL',
		mistakeSeverity: 'ALL',
		suggestionType: 'ALL',
		searchQuery: ''
	});
</script>

<UserMessageReviewListWithFilters bind:filters messages={messagesContext.messages} />
