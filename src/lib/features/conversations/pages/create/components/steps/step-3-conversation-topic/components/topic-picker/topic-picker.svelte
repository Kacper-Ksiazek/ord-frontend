<script lang="ts">
	import _isEmpty from 'lodash/isEmpty';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { topics } from './topic-picker.store.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let amountOfSkeletons = $state(0);

	const topicsForSelectedConversationType = $derived.by(() => {
		const payload = getCreateConversationPayload();

		return payload.type ? topics.get(payload.type) || [] : [];
	});
</script>

<section class="flex flex-col gap-6 my-2 flex-1">
	<GenerateTopicsSuggestionsButton bind:amountOfSkeletons />

	<div class="flex min-h-[200px] flex-col gap-3">
		{#if _isEmpty(topicsForSelectedConversationType) && amountOfSkeletons === 0}
			<div
				class="w-full flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-4 p-8"
			>
				<ConversationTypeIcon
					conversationType={getCreateConversationPayload().type!}
					class="w-24 h-24 text-gray-300 dark:text-gray-600"
				/>
				<div class="text-center">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">
						{m['features.conversation.create.step-3.topic_picker.no_topic_selected']()}
					</p>
					<p class="text-xs font-light text-gray-500 dark:text-gray-500 mt-1">
						{m['features.conversation.create.step-3.description']()}
					</p>
				</div>
			</div>
		{/if}

		{#each topicsForSelectedConversationType as topic, index}
			{@const payload = getCreateConversationPayload()}
			<TopicRow
				{index}
				{topic}
				isSelected={payload.topic === topic}
				onclick={() => setCreateConversationPayload({ topic })}
			/>
		{/each}

		{#if amountOfSkeletons > 0}
			{#each Array.from({ length: amountOfSkeletons })}
				<Skeleton class="h-12 rounded-lg" />
			{/each}
		{/if}
	</div>

	<CustomTopicManagement />
</section>
