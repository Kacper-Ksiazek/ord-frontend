<script lang="ts">
	import { SelectedConversationTypeCard, TopicPicker } from './components';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
</script>

<div class="flex h-full min-h-0 flex-col" data-testid={E2E_TEST_IDS.createConversation.stepTopic}>
	<SelectedConversationTypeCard />

	<div class="flex min-h-0 flex-1 flex-col">
		<TopicPicker />
	</div>
</div>
