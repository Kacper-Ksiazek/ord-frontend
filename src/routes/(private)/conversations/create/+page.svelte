<script lang="ts">
import _isNil from 'lodash/isNil';
import { authStore } from '$lib/stores/auth.svelte';
import type { CreateConversationRequest } from '$lib/types/conversation/api/requests';
import CreateConversationStep1 from './stages/create-conversation-step-1/create-conversation-step-1.svelte';

let currentStep = $state<'step-1-select-type'>('step-1-select-type');

const createConversationPayload = $state<Partial<CreateConversationRequest>>({
	language: authStore.user!.selectedLearningLanguage!,
	tone: undefined,
	topic: undefined,
	additionalContext: undefined,
	aiInterlocutorName: undefined,
	aiInterlocutorAvatarId: undefined,
	type: undefined
});
</script>

<svelte:head>
  <title>New Conversation</title>
</svelte:head>

{JSON.stringify(createConversationPayload)}

{#if currentStep === "step-1-select-type"}
  <CreateConversationStep1
    selectedType={createConversationPayload.type}
    onSelectType={(type) => (createConversationPayload.type = type)}
    language={createConversationPayload.language}
  />
{/if}
