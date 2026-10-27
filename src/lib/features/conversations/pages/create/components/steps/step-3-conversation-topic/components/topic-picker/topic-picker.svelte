<script lang="ts">
	import { tick } from 'svelte';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';
	import TopicPickerTabs from './components/topic-picker-tabs.svelte';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	type TopicPickerTab = 'create' | 'saved';

	let amountOfSkeletons = $state(0);
	let topicListScrollEl = $state<HTMLDivElement | undefined>(undefined);
	let selectedTopicTab = $state<TopicPickerTab>('create');
	/** Pinned topics frozen while the saved tab is open; refreshed when entering that tab. */
	let savedTabTopicsSnapshot = $state<string[]>([]);

	function handleTopicPickerTabChange(tab: TopicPickerTab) {
		if (tab === 'saved' && topicBuckets.pinned.length === 0) {
			return;
		}

		if (tab === 'saved') {
			savedTabTopicsSnapshot = [...topicBuckets.pinned];
		}
		selectedTopicTab = tab;
	}

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

		return topicPickerStore.topics.get(payload.type) ?? { pinned: [], unpinned: [], order: [] };
	});

	const createTabTopics = $derived.by(() => {
		const payload = getCreateConversationPayload();
		if (!payload.type) {
			return [] as { topic: string; isPinned: boolean }[];
		}

		return topicPickerStore.getTopicsInDisplayOrder(payload.type);
	});

	const hasSuggestedTopics = $derived(createTabTopics.length > 0 || amountOfSkeletons > 0);

	const savedTopicsCount = $derived(topicBuckets.pinned.length);

	const isSavedTabDisabled = $derived(topicBuckets.pinned.length === 0);
</script>

<section
	class="flex min-h-0 flex-1 flex-col gap-4"
	data-testid={E2E_TEST_IDS.createConversation.topicPicker}
>
	<TopicPickerTabs
		activeTab={selectedTopicTab}
		savedCount={savedTopicsCount}
		savedTabDisabled={isSavedTabDisabled}
		onTabChange={handleTopicPickerTabChange}
	/>

	<div class="relative min-h-0 flex-1 overflow-hidden">
		{#key selectedTopicTab}
			{#if selectedTopicTab === 'create'}
				<div
					class="absolute inset-0 flex h-full min-h-0 flex-col gap-4 overflow-hidden"
					data-testid={E2E_TEST_IDS.createConversation.topicPickerCreatePanel}
				>
					<div class="flex min-h-0 flex-1 flex-col gap-2">
						<p class="text-sm font-medium text-ink-muted">
							{m['features.conversation.create.step-3.topic_picker.suggested_section_title']()}
						</p>

						<GenerateTopicsSuggestionsButton
							bind:amountOfSkeletons
							onStreamChunkReceive={scrollTopicListToEnd}
						/>

						<ScrollableWrapper
							bind:scrollContainer={topicListScrollEl}
							wrapperClass="min-h-0 flex-1"
							contentClass="gap-2"
						>
							{#if !hasSuggestedTopics}
								<StatusPanel
									variant="information"
									class="w-full shrink-0 rounded-[10px] border border-dashed border-line bg-surface py-10"
									header={m['features.conversation.create.step-3.topic_picker.suggested_empty.header']()}
									description={m[
										'features.conversation.create.step-3.topic_picker.suggested_empty.description'
									]()}
									descriptionClass="content-long"
								/>
							{:else}
								{#each createTabTopics as item, i (item.topic)}
									{@const payload = getCreateConversationPayload()}
									<TopicRow
										index={i}
										topic={item.topic}
										isPinned={item.isPinned}
										isSelected={payload.topic === item.topic}
										onclick={() => {
											topicPickerStore.useOwnTopic = false;
											setCreateConversationPayload({ topic: item.topic });
										}}
									/>
								{/each}

								{#if amountOfSkeletons > 0}
									{#each Array.from({ length: amountOfSkeletons })}
										<Skeleton class="h-12 shrink-0 rounded-[10px]" />
									{/each}
								{/if}
							{/if}

							<CustomTopicManagement />
						</ScrollableWrapper>
					</div>
				</div>
			{:else if selectedTopicTab === 'saved'}
				<div
					class="absolute inset-0 flex min-h-0 flex-col gap-2 overflow-y-auto overflow-x-hidden"
					data-testid={E2E_TEST_IDS.createConversation.topicPickerSavedPanel}
				>
					{#if savedTabTopicsSnapshot.length === 0}
						<StatusPanel
							variant="information"
							class="w-full shrink-0 rounded-[10px] border border-dashed border-line bg-surface py-10"
							header={m['features.conversation.create.step-3.topic_picker.saved_empty.header']()}
							description={m['features.conversation.create.step-3.topic_picker.saved_empty.description']()}
							descriptionClass="content-long"
						/>
					{:else}
						<ScrollableWrapper wrapperClass="min-h-0 flex-1" contentClass="gap-2">
							{#each savedTabTopicsSnapshot as topic, i (topic)}
								{@const payload = getCreateConversationPayload()}
								{@const isPinned = topicBuckets.pinned.includes(topic)}
								<TopicRow
									index={i}
									{topic}
									{isPinned}
									isSelected={payload.topic === topic}
									onclick={() => {
										topicPickerStore.useOwnTopic = false;
										setCreateConversationPayload({ topic });
									}}
								/>
							{/each}
						</ScrollableWrapper>
					{/if}
				</div>
			{/if}
		{/key}
	</div>
</section>
