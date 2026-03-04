<script lang="ts">
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import UserMessageReviewsFilters from '../../../components/user-message-reviews-filters/user-message-review-filters.svelte';
	import type { UserMessageReviewFilters } from '../../../components/user-message-reviews-filters/lib/filters';

	const messagesContext = getMessagesContext();

	let filters = $state<UserMessageReviewFilters>({
		category: 'ALL',
		mistakeSeverity: 'ALL',
		suggestionType: 'ALL',
		searchQuery: ''
	});
</script>

<UserMessageReviewsFilters bind:filters messages={messagesContext.messages} />
