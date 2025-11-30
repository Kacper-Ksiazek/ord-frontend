<script lang="ts">
	import { GenerateAIInterlocutor } from './components';
	import { SelectedConversationTypeCard } from '../step-2-conversation-topic/components';
	import { getCreateConversationPayload } from '../../stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const payload = getCreateConversationPayload();
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-3.description']()}
</p>

<SelectedConversationTypeCard />

{#if payload.topic}
	<div
		class="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
	>
		<div class="flex flex-col gap-1">
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
				{m['features.conversation.create.step-3.selected_topic.label']()}
			</p>
			<p class="text-base font-semibold text-gray-900 dark:text-gray-50">{payload.topic}</p>
		</div>
	</div>
{/if}

<GenerateAIInterlocutor />
