<script lang="ts">
	import { GenerateAIInterlocutor } from '../create-conversation-step-1/components/generate-ai-interlocutor';
	import { conversationTypes } from '../create-conversation-step-1/create-conversation-step-1.constants';
	import { getCreateConversationPayload } from '../../stores/create-conversation-payload.svelte';

	const payload = getCreateConversationPayload();
	const selectedTypeLabel = $derived.by(() => {
		if (!payload.type) return null;
		return conversationTypes.find((t) => t.type === payload.type)?.label ?? null;
	});
</script>

<h2 class="text-lg font-bold">Summary</h2>
<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
	<div class="flex flex-col gap-2">
		{#if selectedTypeLabel}
			<div>
				<span class="font-semibold text-gray-700 dark:text-gray-300">Conversation Type: </span>
				<span class="text-gray-600 dark:text-gray-400">{selectedTypeLabel}</span>
			</div>
		{/if}
		{#if payload.topic}
			<div>
				<span class="font-semibold text-gray-700 dark:text-gray-300">Topic: </span>
				<span class="text-gray-600 dark:text-gray-400">{payload.topic}</span>
			</div>
		{/if}
	</div>
</div>

---

<h2 class="text-lg font-bold">Generate AI Interlocutor</h2>

<GenerateAIInterlocutor />
