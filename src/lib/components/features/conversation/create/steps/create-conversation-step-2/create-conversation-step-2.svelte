<script lang="ts">
	import { GenerateAIInterlocutor } from '../create-conversation-step-1/components/generate-ai-interlocutor';
	import { SelectedConversationTypeCard } from '../create-conversation-step-1/components/selected-conversation-type-card';
	import { getCreateConversationPayload } from '../../stores/create-conversation-payload.svelte';

	const payload = getCreateConversationPayload();
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	Review your selections and generate an AI interlocutor to start your conversation. You can add
	optional context to personalize the AI's personality.
</p>

<h2 class="text-lg font-bold mb-4">Summary</h2>

<SelectedConversationTypeCard />

{#if payload.topic}
	<div
		class="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
	>
		<div class="flex flex-col gap-1">
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Selected topic</p>
			<p class="text-base font-semibold text-gray-900 dark:text-gray-50">{payload.topic}</p>
		</div>
	</div>
{/if}

<GenerateAIInterlocutor />
