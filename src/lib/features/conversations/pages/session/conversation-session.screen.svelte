<script lang="ts">
	import { onDestroy } from 'svelte';
	import { FeedbackPanel, MessagesPanel } from './components';
	import { stopSpeaking } from '$lib/utils/speak-text';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import { useInitializeConversation } from './services/use-initialize-conversation.svelte';

	useInitializeConversation();

	onDestroy(() => {
		stopSpeaking();
	});
</script>

<div
	class="w-full flex-1 mx-auto flex h-full justify-between"
	data-testid={E2E_TEST_IDS.session.page}
>
	<MessagesPanel />

	<FeedbackPanel />
</div>
