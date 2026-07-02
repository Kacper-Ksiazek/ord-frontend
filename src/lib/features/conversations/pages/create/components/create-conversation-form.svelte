<script lang="ts">
	import { browser } from '$app/environment';
	import { MultiStepForm } from '$lib/components/navigation/multi-step-form';
	import type { StepConfig } from '$lib/components/navigation/multi-step-form';
	import { Loader } from '$lib/components/feedback/loader';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../stores/create-conversation-payload.svelte';
	import { topicPickerStore } from '$lib/features/conversations/pages/create/components/steps/step-3-conversation-topic/components/topic-picker/topic-picker.store.svelte';
	import { readDefaultConversationTypeFromStorage } from '$lib/features/conversations/pages/create/utils/default-conversation-type-storage';
	import { readDefaultConversationToneFromStorage } from '$lib/features/conversations/pages/create/utils/default-conversation-tone-storage';
	import { Breadcrumb } from '$lib/components/navigation/breadcrumb';
	import * as m from '$lib/paraglide/messages.js';
	import { createCreateConversationMutation } from '$lib/api-client/conversation/mutations/use-create-conversation';
	import { goto } from '$app/navigation';
	import { AxiosError } from 'axios';
	import type { CreateConversationRequest } from '$lib/types/conversation/api/requests';
	import {
		Step1ConversationType,
		Step2ConversationTone,
		Step3ConversationTopic,
		Step4Summary
	} from './steps';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	function hydrateStoredDefaultsAndGetInitialStep(): number {
		if (!browser) {
			return 0;
		}

		const typeDefault = readDefaultConversationTypeFromStorage();
		const toneDefault = readDefaultConversationToneFromStorage();
		const payload = getCreateConversationPayload();

		if (typeDefault && payload.type === undefined) {
			setCreateConversationPayload({ type: typeDefault });
			topicPickerStore.resetCustomState();
		}

		if (toneDefault && getCreateConversationPayload().tone === undefined) {
			setCreateConversationPayload({ tone: toneDefault });
		}

		if (typeDefault && toneDefault) {
			return 2;
		}
		if (typeDefault) {
			return 1;
		}

		return 0;
	}

	let currentStep = $state(hydrateStoredDefaultsAndGetInitialStep());
	let error = $state<string | null>(null);

	const createConversationMutation = createCreateConversationMutation();
	const isLoading = $derived(createConversationMutation.isPending);

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
			id: 'select-tone',
			header: m['features.conversation.create.step-2.header'](),
			validate: () => {
				const payload = getCreateConversationPayload();

				return !!payload.tone;
			}
		},
		{
			id: 'select-topic',
			header: m['features.conversation.create.step-3.header'](),
			validate: () => {
				const payload = getCreateConversationPayload();

				return !!payload.topic && payload.topic.length <= 255;
			}
		},
		{
			id: 'generate-interlocutor',
			header: m['features.conversation.create.step-4.header']()
		}
	];

	function handleStepChange(stepIndex: number) {
		currentStep = stepIndex;
	}

	async function handleFinalStepClick() {
		const payload = getCreateConversationPayload();
		error = null;

		// Validate required fields
		if (!payload.type || !payload.topic || !payload.language) {
			error = 'Please complete all required fields';

			return;
		}

		// Transform payload to CreateConversationRequest
		const request = {
			type: payload.type,
			topic: payload.topic,
			language: payload.language,
			...(payload.tone && { tone: payload.tone }),
			...(payload.additionalContext && { additionalContext: payload.additionalContext }),
			...(payload.aiInterlocutorName && { aiInterlocutorName: payload.aiInterlocutorName }),
			...(payload.aiInterlocutorAvatarId && { aiInterlocutorAvatarId: payload.aiInterlocutorAvatarId })
		} as CreateConversationRequest;

		try {
			const conversation = await createConversationMutation.mutateAsync(request);
			// Navigate to the conversation detail page or conversations list
			if (conversation.id) {
				goto(`/conversations/${conversation.id}`);
			} else {
				goto('/conversations');
			}
		} catch (err: unknown) {
			if (err instanceof AxiosError) {
				error = err.response?.data?.message || 'Failed to create conversation';
			} else {
				error = 'An unexpected error occurred';
			}
			console.error('Failed to create conversation:', err);
		}
	}
</script>

{#if isLoading}
	<Loader wrapperClass="flex-1 items-center justify-center" />
{:else}
	{#if error}
		<div
			class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
			data-testid={E2E_TEST_IDS.createConversation.error}
		>
			<p class="text-sm text-red-800 dark:text-red-200">{error}</p>
		</div>
	{/if}
	<Breadcrumb
		class="mb-6"
		crumbs={[
			{ label: m['features.conversation.create.form.breadcrumb.home'](), href: '/' },
			{
				label: m['features.conversation.create.form.breadcrumb.conversations'](),
				href: '/conversations'
			},
			{ label: m['features.conversation.create.form.breadcrumb.create_new']() }
		]}
	/>

	<MultiStepForm
		{steps}
		bind:currentStep
		dataTestIdPrefix="create-conversation"
		onStepChange={handleStepChange}
		finalStepButtonText={m['features.conversation.create.form.start_conversation_button']()}
		onFinalStepClick={handleFinalStepClick}
	>
		{#snippet children(stepIndex)}
			{#if stepIndex === 0}
				<Step1ConversationType />
			{:else if stepIndex === 1}
				<Step2ConversationTone />
			{:else if stepIndex === 2}
				<Step3ConversationTopic />
			{:else if stepIndex === 3}
				<Step4Summary
					onEditTopic={() => {
						const newStep = 2;
						currentStep = newStep;
						handleStepChange(newStep);
					}}
				/>
			{/if}
		{/snippet}
	</MultiStepForm>
{/if}
