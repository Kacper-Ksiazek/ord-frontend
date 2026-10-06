<script lang="ts">
	import { tick } from 'svelte';
	import { Bookmark } from 'lucide-svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { StatusPanel } from '$lib/components/utils/status-panel';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';
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

	const hasSuggestedTopics = $derived(topicBuckets.unpinned.length > 0 || amountOfSkeletons > 0);

	const topicPickerTabs = $derived<Tab<TopicPickerTab>[]>([
		{
			id: 'create',
			label: m['features.conversation.create.step-3.topic_picker.tabs.create']()
		},
		{
			id: 'saved',
			label: m['features.conversation.create.step-3.topic_picker.tabs.saved_for_later'](),
			icon: Bookmark,
			count: topicBuckets.pinned.length > 0 ? topicBuckets.pinned.length : undefined
		}
	]);
</script>

<section
	class="flex min-h-0 flex-1 flex-col gap-4"
	data-testid={E2E_TEST_IDS.createConversation.topicPicker}
>
	<div class="shrink-0 border-b border-line">
		<Tabs
			dataTestId={E2E_TEST_IDS.createConversation.topicPickerTabs}
			tabs={topicPickerTabs}
			bind:activeTab={selectedTopicTab}
			activeColor="primary"
			variant="underline"
			class="!mt-0 min-w-0 !border-0"
		/>
	</div>

	<div class="relative min-h-0 flex-1 overflow-hidden">
		{#key selectedTopicTab}
			{#if selectedTopicTab === 'create'}
				<div
					class="absolute inset-0 flex min-h-0 flex-col gap-4 overflow-y-auto overflow-x-hidden"
					data-testid={E2E_TEST_IDS.createConversation.topicPickerCreatePanel}
				>
					<GenerateTopicsSuggestionsButton
						bind:amountOfSkeletons
						onStreamChunkReceive={scrollTopicListToEnd}
					/>

					{#if !hasSuggestedTopics}
						<StatusPanel
							variant="information"
							class="w-full shrink-0 rounded-[10px] border border-dashed border-line bg-surface py-10"
							header={m['features.conversation.create.step-3.topic_picker.no_topic_selected']()}
							description={m['features.conversation.create.step-3.description']()}
							descriptionClass="content-long"
						/>
					{:else}
						<div class="flex min-h-0 flex-col gap-2">
							<p class="text-sm font-medium text-ink-muted">
								{m['features.conversation.create.step-3.topic_picker.suggested_section_title']()}
							</p>
							<ScrollableWrapper
								bind:scrollContainer={topicListScrollEl}
								wrapperClass="max-h-[min(28rem,52vh)]"
								contentClass="gap-2"
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
										<Skeleton class="h-[3.75rem] shrink-0 rounded-[10px]" />
									{/each}
								{/if}
							</ScrollableWrapper>
						</div>
					{/if}

					<CustomTopicManagement />
				</div>
			{:else if selectedTopicTab === 'saved'}
				<div
					class="absolute inset-0 flex min-h-0 flex-col gap-2 overflow-y-auto overflow-x-hidden"
					data-testid={E2E_TEST_IDS.createConversation.topicPickerSavedPanel}
				>
					{#if topicBuckets.pinned.length === 0}
						<StatusPanel
							variant="information"
							class="w-full shrink-0 rounded-[10px] border border-dashed border-line bg-surface py-10"
							header={m['features.conversation.create.step-3.topic_picker.saved_empty.header']()}
							description={m['features.conversation.create.step-3.topic_picker.saved_empty.description']()}
							descriptionClass="content-long"
						/>
					{:else}
						<ScrollableWrapper wrapperClass="min-h-0 flex-1" contentClass="gap-2">
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
						</ScrollableWrapper>
					{/if}
				</div>
			{/if}
		{/key}
	</div>
</section>
