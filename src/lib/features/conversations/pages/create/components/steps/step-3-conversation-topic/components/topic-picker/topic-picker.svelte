<script lang="ts">
	import _isEmpty from 'lodash/isEmpty';
	import { tick } from 'svelte';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { StatusScreen } from '$lib/components/utils/status-screen';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { topics, topicPickerUi } from './topic-picker.store.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let amountOfSkeletons = $state(0);
	let topicListScrollEl = $state<HTMLDivElement | undefined>(undefined);

	async function scrollTopicListToEnd() {
		await tick();
		topicListScrollEl?.scrollTo({
			top: topicListScrollEl.scrollHeight,
			behavior: 'smooth'
		});
	}

	const topicsForSelectedConversationType = $derived.by(() => {
		const payload = getCreateConversationPayload();

		return payload.type ? topics.get(payload.type) || [] : [];
	});
</script>

<section class="my-2 flex min-h-0 flex-1 flex-col gap-6">
	<GenerateTopicsSuggestionsButton
		bind:amountOfSkeletons
		onStreamChunkReceive={scrollTopicListToEnd}
	/>

	{#if _isEmpty(topicsForSelectedConversationType) && amountOfSkeletons === 0}
		<StatusScreen
			variant="information"
			class="w-full shrink-0 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8 dark:border-gray-700 dark:bg-gray-800/50 h-full"
			header={m['features.conversation.create.step-3.topic_picker.no_topic_selected']()}
			description={m['features.conversation.create.step-3.description']()}
			descriptionClass="content-long"
		/>
	{:else}
		<ScrollableWrapper
			bind:scrollContainer={topicListScrollEl}
			wrapperClass="min-h-0 flex-1"
			contentClass="gap-3"
		>
			{#each topicsForSelectedConversationType as topic, index (index)}
				{@const payload = getCreateConversationPayload()}
				<TopicRow
					{index}
					{topic}
					selectionDisabled={topicPickerUi.useOwnTopic}
					isSelected={payload.topic === topic}
					onclick={() => setCreateConversationPayload({ topic })}
				/>
			{/each}

			{#if amountOfSkeletons > 0}
				{#each Array.from({ length: amountOfSkeletons })}
					<Skeleton class="h-10 shrink-0 rounded-lg" />
				{/each}
			{/if}
		</ScrollableWrapper>
	{/if}

	<CustomTopicManagement />
</section>
