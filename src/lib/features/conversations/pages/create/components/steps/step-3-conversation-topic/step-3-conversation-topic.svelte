<script lang="ts">
	import { SelectedConversationTypeCard, TopicPicker } from './components';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
</script>

<div
	class="flex min-h-0 flex-1 flex-col h-full"
	data-testid={E2E_TEST_IDS.createConversation.stepTopic}
>
	<SelectedConversationTypeCard />
	<TopicPicker />
</div>
