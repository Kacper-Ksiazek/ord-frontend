<script lang="ts">
	import { MultiStepForm } from '$lib/components/utils/multi-step-form';
	import type { StepConfig } from '$lib/components/utils/multi-step-form';
	import { Step1ConversationType } from './steps/step-1-conversation-type';
	import { Step2ConversationTopic } from './steps/step-2-conversation-topic';
	import { Step3Summary } from './steps/step-3-summary';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from './stores/create-conversation-payload.svelte';

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
			<Step1ConversationType />
		{:else if stepIndex === 1}
			<Step2ConversationTopic />
		{:else if stepIndex === 2}
			<Step3Summary />
		{/if}
	{/snippet}
</MultiStepForm>
