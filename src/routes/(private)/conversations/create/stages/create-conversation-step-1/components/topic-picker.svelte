<script lang="ts">
	import { Button, cn, Input } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import _isEmpty from 'lodash/isEmpty';
	import { SvelteMap } from 'svelte/reactivity';
	import { suggestConversationTopics } from '$lib/api-client/conversation/see/suggest-conversation-topics';
	import ConversationTypeIcon from '$lib/components/features/conversation/conversation-type-icon.svelte';
	import { AiActionButton } from '$lib/components/utils/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/utils/ai-action-button/ai-action-button.types';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';
	import type { LanguageName } from '$lib/types/core/domain/languages';

	interface Props {
		selectedType: ConversationType | undefined;
		language: LanguageName | undefined;
		selectedTopic: string | undefined;
	}

	let {
		selectedType, //
		language,
		selectedTopic = $bindable()
	}: Props = $props();

	let amountOfSkeletons = $state(0);
	let clueForGeneration = $state('');
	let manualTopicInput = $state('');

	let generateButtonStatus = $state<AiActionButtonStatus>('default');

	const topics = new SvelteMap<ConversationType, string[]>([
		[
			'SMALL_TALK',
			[
				"What's your favorite way to spend a weekend?",
				'Have you seen any good movies lately?',
				'If you could travel anywhere, where would you go?'
			]
		]
	]);

	const currentTopics = $derived(selectedType ? topics.get(selectedType) || [] : []);

	function generateTopics() {
		if (!selectedType || !language) {
			return;
		}

		amountOfSkeletons = 3;

		generateButtonStatus = 'loading';

		suggestConversationTopics({
			conversationType: selectedType,
			language: language,
			clueFromUser: clueForGeneration || undefined
		}).subscribe({
			next: (topic) => {
				if (topic?.value) {
					amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);

					topics.set(selectedType, [...(topics.get(selectedType) || []), topic.value]);
				} else {
					console.error('Topic is not a string');
					console.error(topic, typeof topic);
				}
			},
			error: () => {
				generateButtonStatus = 'failed';
			},
			complete: () => {
				generateButtonStatus = 'success';
			}
		});
	}

	function removeTopic(topicToRemove: string) {
		if (!selectedType) {
			return;
		}

		const currentTopicsList = topics.get(selectedType) || [];
		const updatedTopics = currentTopicsList.filter((topic) => topic !== topicToRemove);

		topics.set(selectedType, updatedTopics);
	}

	function addTopic() {
		if (!selectedType || !manualTopicInput.trim()) {
			return;
		}

		const trimmedTopic = manualTopicInput.trim();
		const currentTopicsList = topics.get(selectedType) || [];

		// Don't add duplicate topics
		if (currentTopicsList.includes(trimmedTopic)) {
			return;
		}

		topics.set(selectedType, [...currentTopicsList, trimmedTopic]);
		manualTopicInput = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTopic();
		}
	}
</script>

<section class="flex flex-col gap-4 my-2 max-w-[800px]">
	<div class="flex items-center gap-2">
		<AiActionButton
			status={generateButtonStatus}
			onclick={generateTopics}
			disabled={!selectedType || !language}
		/>

		<Input
			placeholder="Give me a hint or idea to inspire your topics... (optional)"
			class="flex-1"
			bind:value={clueForGeneration}
		/>
	</div>

	<div class="flex min-h-[152px] flex-col gap-4">
		{#if _isEmpty(currentTopics) && amountOfSkeletons === 0}
			<div
				class="w-full flex-1 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center"
			>
				<ConversationTypeIcon
					conversationType={selectedType!}
					class="w-32 h-32 text-gray-300 dark:text-gray-600"
				/>
			</div>
		{/if}

		{#each currentTopics as topic, index}
			{@const isSelected = selectedTopic === topic}

			<SelectableCard
				onclick={() => {
					selectedTopic = topic;
				}}
				class="flex-row gap-4 justify-start p-0 overflow-hidden"
				{isSelected}
			>
				<span
					class={cn(
						'bg-gray-200 p-2 rounded-md text-gray-900 font-semibold h-full transition-all',
						'dark:text-gray-200 dark:bg-gray-700',
						isSelected && 'bg-primary-500! dark:bg-primary-500! text-white px-4'
					)}>{index + 1}.</span
				>

				<span
					class={cn(
						'text-sm flex-1 py-2', //
						isSelected && 'text-gray-900'
					)}>{topic}</span
				>

				{#if !isSelected}
					<button
						class={cn(
							'cursor-pointer text-gray-300 p-1 m-1', //
							'hover:text-red-300 hover:bg-red-50 rounded-full dark:hover:bg-transparent'
						)}
						onclick={(e) => {
							e.stopPropagation();
							removeTopic(topic);
						}}
					>
						<CloseOutline class="w-5 h-5" />
					</button>
				{/if}
			</SelectableCard>
		{/each}

		{#if amountOfSkeletons > 0}
			{#each Array.from({ length: amountOfSkeletons })}
				<Skeleton class="h-10" />
			{/each}
		{/if}
	</div>

	<div class="flex items-center gap-2">
		<Input
			placeholder="Enter a topic"
			class="flex-1"
			bind:value={manualTopicInput}
			onkeydown={handleKeydown}
			disabled={!selectedType}
		/>

		<Button onclick={addTopic} disabled={!selectedType || !manualTopicInput.trim()} class="shrink-0">
			Add
		</Button>
	</div>
</section>
