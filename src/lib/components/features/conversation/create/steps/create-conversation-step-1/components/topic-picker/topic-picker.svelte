<script lang="ts">
	import _isEmpty from 'lodash/isEmpty';
	import ConversationTypeIcon from '$lib/components/features/conversation/conversation-type-icon.svelte';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/components/features/conversation/create/stores/create-conversation-payload.svelte';
	import { topics } from './topic-picker.store.svelte';

	let amountOfSkeletons = $state(0);

	const topicsForSelectedConversationType = $derived.by(() => {
		const payload = getCreateConversationPayload();

		return payload.type ? topics.get(payload.type) || [] : [];
	});
</script>

<section class="flex flex-col gap-4 my-2 max-w-[800px]">
	<GenerateTopicsSuggestionsButton bind:amountOfSkeletons />

	<div class="flex min-h-[152px] flex-col gap-4">
		{#if _isEmpty(topicsForSelectedConversationType) && amountOfSkeletons === 0}
			<div
				class="w-full flex-1 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center"
			>
				<ConversationTypeIcon
					conversationType={getCreateConversationPayload().type!}
					class="w-32 h-32 text-gray-300 dark:text-gray-600"
				/>
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
				<Skeleton class="h-10" />
			{/each}
		{/if}
	</div>

	<CustomTopicManagement />
</section>
