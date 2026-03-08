<script lang="ts">
	import { UserMessageReviewsList } from '../../../../shared/components/user-message-reviews-list';
	import { aggregateFeedback } from '../../../../shared/utils/aggregate-feedback';
	import { DEFAULT_FEEDBACK_FILTERS } from '../../../../components/user-message-reviews-list-with-filters/lib/constants';
	import type { UserMessageReviewFilters } from '../../../../components/user-message-reviews-list-with-filters/lib/filters';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';

	interface FeedbackTabProps {
		feedback: ConversationUserMessageFeedbackDTO;
		messageCreatedAt: string | null;
	}

	const { feedback, messageCreatedAt }: FeedbackTabProps = $props();

	let filters = $state<UserMessageReviewFilters>(DEFAULT_FEEDBACK_FILTERS);

	const syntheticMessage: CompactConversationUserMessage = $derived({
		sender: 'USER',
		content: '',
		feedback,
		createdAt: messageCreatedAt ?? new Date().toISOString()
	});

	const aggregatedFeedback = $derived(aggregateFeedback([syntheticMessage]));

	function clearFilters() {
		filters = DEFAULT_FEEDBACK_FILTERS;
	}
</script>

<UserMessageReviewsList {filters} feedbacks={aggregatedFeedback} {clearFilters} />
