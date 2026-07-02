<script lang="ts">
	import { tick } from 'svelte';
	import { ScrollableWrapper } from '$lib/components/surfaces/scrollable-wrapper';
	import { StatusScreen } from '$lib/components/feedback/status-screen';
	import { Skeleton } from '$lib/components/feedback/skeleton';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { topicPickerStore } from './topic-picker.store.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	let amountOfSkeletons = $state(0);
	let topicListScrollEl = $state<HTMLDivElement | undefined>(undefined);

	async function scrollTopicListToEnd() {
		await tick();
		topicListScrollEl?.scrollTo({
			top: topicListScrollEl.scrollHeight,
			behavior: 'smooth'
		});
	}

	const topicBuckets = $derived.by(() => {
		const payload = getCreateConversationPayload();
		if (!payload.type) {
			return { pinned: [] as string[], unpinned: [] as string[] };
		}

		return topicPickerStore.topics.get(payload.type) ?? { pinned: [], unpinned: [] };
	});

	const hasAnyTopicsOrSkeletons = $derived(
		topicBuckets.pinned.length > 0 || topicBuckets.unpinned.length > 0 || amountOfSkeletons > 0
	);
</script>

<section
	class="my-2 flex min-h-0 flex-1 flex-col gap-6"
	data-testid={E2E_TEST_IDS.createConversation.topicPicker}
>
	<GenerateTopicsSuggestionsButton
		bind:amountOfSkeletons
		onStreamChunkReceive={scrollTopicListToEnd}
	/>

	{#if !hasAnyTopicsOrSkeletons}
		<StatusScreen
			variant="information"
			class="w-full shrink-0 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8 dark:border-gray-700 dark:bg-gray-800/50 h-full"
			header={m['features.conversation.create.step-3.topic_picker.no_topic_selected']()}
			description={m['features.conversation.create.step-3.description']()}
			descriptionClass="content-long"
		/>
	{:else}
		<div class="flex min-h-0 flex-1 flex-col gap-6">
			{#if topicBuckets.pinned.length > 0}
				<div class="flex shrink-0 flex-col gap-2">
					<p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
						{m['features.conversation.create.step-3.topic_picker.pinned_section_title']()}
					</p>
					<div class="flex flex-col gap-3">
						{#each topicBuckets.pinned as topic, i (topic)}
							{@const payload = getCreateConversationPayload()}
							<TopicRow
								index={i}
								{topic}
								isPinned={true}
								selectionDisabled={topicPickerStore.useOwnTopic}
								isSelected={payload.topic === topic}
								onclick={() => setCreateConversationPayload({ topic })}
							/>
						{/each}
					</div>
				</div>
			{/if}

			{#if topicBuckets.unpinned.length > 0 || amountOfSkeletons > 0}
				<div class="flex min-h-0 flex-1 flex-col gap-2">
					<p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
						{m['features.conversation.create.step-3.topic_picker.suggested_section_title']()}
					</p>
					<ScrollableWrapper
						bind:scrollContainer={topicListScrollEl}
						wrapperClass="min-h-0 flex-1"
						contentClass="gap-3"
					>
						{#each topicBuckets.unpinned as topic, i (topic)}
							{@const payload = getCreateConversationPayload()}
							<TopicRow
								index={topicBuckets.pinned.length + i}
								{topic}
								isPinned={false}
								selectionDisabled={topicPickerStore.useOwnTopic}
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
				</div>
			{/if}
		</div>
	{/if}

	<CustomTopicManagement />
</section>
