<script lang="ts">
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import LearningTipsListWithFilters from '../../../components/learning-tips-list-with-filters/learning-tips-list-with-filters.svelte';

	const messagesContext = getMessagesContext();
</script>

<LearningTipsListWithFilters data={messagesContext.messages} />
