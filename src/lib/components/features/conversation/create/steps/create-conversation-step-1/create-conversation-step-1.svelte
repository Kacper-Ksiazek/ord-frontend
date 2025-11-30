<script lang="ts">
	import { MultiStepForm } from '$lib/components/utils/multi-step-form';
	import type { StepConfig } from '$lib/components/utils/multi-step-form';
	import ConversationTypeCard from './components/conversation-type-card.svelte';
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
			id: 'select-type-and-topic',
			header: 'Select conversation type and topic',
			validate: () => {
				const payload = getCreateConversationPayload();
				return !!(payload.type && payload.topic);
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
</script>

<h1 class="text-2xl font-bold">New Conversation</h1>

<MultiStepForm {steps} bind:currentStep onStepChange={handleStepChange}>
	{#snippet children(stepIndex)}
		{#if stepIndex === 0}
			<h2 class="text-lg font-bold">Select a conversation type</h2>
			<section class="flex flex-wrap gap-4">
				{#each conversationTypes as { type, label, description }}
					{@const isSelected = selectedType.type === type}

					<ConversationTypeCard
						{type}
						{label}
						{description}
						{isSelected}
						onclick={() => setCreateConversationPayload({ type })}
					/>
				{/each}
			</section>

			---

			<h2 class="text-lg font-bold">Select conversation topic</h2>

			<TopicPicker />
		{:else if stepIndex === 1}
			<CreateConversationStep2 />
		{/if}
	{/snippet}
</MultiStepForm>
