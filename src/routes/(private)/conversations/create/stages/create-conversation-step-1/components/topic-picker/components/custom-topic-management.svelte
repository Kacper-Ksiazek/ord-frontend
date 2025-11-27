<script lang="ts">
	import { Button, Input } from 'flowbite-svelte';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';
	import type { SvelteMap } from 'svelte/reactivity';

	interface CustomTopicManagementProps {
		selectedType: ConversationType | undefined;
		topics: SvelteMap<ConversationType, string[]>;
	}

	let { selectedType, topics }: CustomTopicManagementProps = $props();

	let userTopicInput = $state('');

	function addTopic() {
		if (!selectedType || !userTopicInput.trim()) {
			return;
		}

		const trimmedTopic = userTopicInput.trim();
		const currentTopicsList = topics.get(selectedType) || [];

		// Don't add duplicate topics
		if (currentTopicsList.includes(trimmedTopic)) {
			return;
		}

		topics.set(selectedType, [...currentTopicsList, trimmedTopic]);
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
		placeholder="Enter a topic"
		class="flex-1"
		bind:value={userTopicInput}
		onkeydown={handleKeydown}
		disabled={!selectedType}
	/>

	<Button onclick={addTopic} disabled={!selectedType || !userTopicInput.trim()} class="shrink-0">
		Add
	</Button>
</div>
