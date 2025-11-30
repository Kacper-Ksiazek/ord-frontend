<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import { getCreateConversationPayload } from '$lib/components/features/conversation/create/stores/create-conversation-payload.svelte';
	import { topics } from '../topic-picker.store.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let userTopicInput = $state('');

	function addTopic() {
		const payload = getCreateConversationPayload();
		if (!payload.type || !userTopicInput.trim()) {
			return;
		}

		const trimmedTopic = userTopicInput.trim();
		const currentTopicsList = topics.get(payload.type) || [];

		// Don't add duplicate topics
		if (currentTopicsList.includes(trimmedTopic)) {
			return;
		}

		topics.set(payload.type, [...currentTopicsList, trimmedTopic]);
		userTopicInput = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTopic();
		}
	}
</script>

<div class="flex items-center gap-2">
	<Input
		placeholder={m[
			'features.conversation.create.step-3.topic_picker.custom_topic.input_placeholder'
		]()}
		class="flex-1"
		bind:value={userTopicInput}
		onkeydown={handleKeydown}
		disabled={!getCreateConversationPayload().type}
	/>

	<Button
		onclick={addTopic}
		disabled={!getCreateConversationPayload().type || !userTopicInput.trim()}
		class="shrink-0"
	>
		{m['features.conversation.create.step-3.topic_picker.custom_topic.add_button']()}
	</Button>
</div>
