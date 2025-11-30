<script lang="ts">
	import { MultiStepForm } from '$lib/components/utils/multi-step-form';
	import type { StepConfig } from '$lib/components/utils/multi-step-form';
	import { Loader } from '$lib/components/utils/loader';
	import { Step1ConversationType } from './steps/step-1-conversation-type';
	import { Step2ConversationTopic } from './steps/step-2-conversation-topic';
	import { Step3Summary } from './steps/step-3-summary';
	import { getCreateConversationPayload } from './stores/create-conversation-payload.svelte';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages.js';

	let currentStep = $state(0);
	let isLoading = $state(false);

	const steps: StepConfig[] = [
		{
			id: 'select-type',
			header: m['features.conversation.create.step-1.header'](),
			validate: () => {
				const payload = getCreateConversationPayload();
				return !!payload.type;
			}
		},
		{
			id: 'select-topic',
			header: m['features.conversation.create.step-2.header'](),
			validate: () => {
				const payload = getCreateConversationPayload();
				return !!payload.topic;
			}
		},
		{
			id: 'generate-interlocutor',
			header: m['features.conversation.create.step-3.header']()
		}
	];

	function handleStepChange(stepIndex: number) {
		currentStep = stepIndex;
	}

	function handleFinalStepClick() {
		const payload = getCreateConversationPayload();
		console.log('Final step clicked. Payload:', payload);
		isLoading = true;
	}
</script>

{#if isLoading}
	<Loader wrapperClass="flex-1 items-center justify-center" />
{:else}
	<Breadcrumb class="mb-6">
		<BreadcrumbItem href="/" home
			>{m['features.conversation.create.form.breadcrumb.home']()}</BreadcrumbItem
		>
		<BreadcrumbItem href="/conversations"
			>{m['features.conversation.create.form.breadcrumb.conversations']()}</BreadcrumbItem
		>
		<BreadcrumbItem>
			<span class="text-black dark:text-white"
				>{m['features.conversation.create.form.breadcrumb.create_new']()}</span
			></BreadcrumbItem
		>
	</Breadcrumb>

	<MultiStepForm
		{steps}
		bind:currentStep
		onStepChange={handleStepChange}
		finalStepButtonText={m['features.conversation.create.form.continue_button']()}
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
{/if}
