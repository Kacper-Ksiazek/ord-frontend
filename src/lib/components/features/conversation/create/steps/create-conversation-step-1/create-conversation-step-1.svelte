<script lang="ts">
	import { MultiStepForm } from '$lib/components/utils/multi-step-form';
	import type { StepConfig } from '$lib/components/utils/multi-step-form';
	import ConversationTypeCard from './components/conversation-type-card.svelte';
	import { SelectedConversationTypeCard } from './components/selected-conversation-type-card';
	import { TopicPicker } from './components/topic-picker';
	import { conversationTypes } from './create-conversation-step-1.constants';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../../stores/create-conversation-payload.svelte';
	import CreateConversationStep2 from '../create-conversation-step-2/create-conversation-step-2.svelte';

	let selectedType = $derived(getCreateConversationPayload());
	let currentStep = $state(0);

	const steps: StepConfig[] = [
		{
			id: 'select-type',
			header: 'Select conversation type',
			validate: () => {
				const payload = getCreateConversationPayload();
				return !!payload.type;
			}
		},
		{
			id: 'select-topic',
			header: 'Select conversation topic',
			validate: () => {
				const payload = getCreateConversationPayload();
				return !!payload.topic;
			}
		},
		{
			id: 'generate-interlocutor',
			header: 'Generate AI Interlocutor'
		}
	];

	function handleStepChange(stepIndex: number) {
		currentStep = stepIndex;
	}

	function handleFinalStepClick() {
		const payload = getCreateConversationPayload();
		console.log('Final step clicked. Payload:', payload);
	}
</script>

<MultiStepForm
	{steps}
	bind:currentStep
	onStepChange={handleStepChange}
	finalStepButtonText="Continue"
	onFinalStepClick={handleFinalStepClick}
>
	{#snippet children(stepIndex)}
		{#if stepIndex === 0}
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
				Choose the type of conversation you'd like to practice. Each type offers a different learning
				experience.
			</p>
			<section class="flex flex-wrap gap-4">
				{#each conversationTypes as { type, label, description }}
					{@const isSelected = selectedType.type === type}

					<ConversationTypeCard
						{type}
						{label}
						{description}
						{isSelected}
						onclick={() => {
							const currentPayload = getCreateConversationPayload();
							// Reset topic only if the type is actually changing
							if (currentPayload.type !== type) {
								setCreateConversationPayload({ type, topic: undefined });
							} else {
								setCreateConversationPayload({ type });
							}
						}}
					/>
				{/each}
			</section>
		{:else if stepIndex === 1}
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
				Select a topic for your conversation. You can generate suggestions with AI or add your own
				custom topic.
			</p>
			<SelectedConversationTypeCard />
			<TopicPicker />
		{:else if stepIndex === 2}
			<CreateConversationStep2 />
		{/if}
	{/snippet}
</MultiStepForm>
