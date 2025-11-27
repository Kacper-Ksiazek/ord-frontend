<script lang="ts">
	import _isNil from 'lodash/isNil';
	import { CreateConversationStep1 } from '$lib/components/features/conversation/create';
	import { getCreateConversationPayload } from '$lib/components/features/conversation/create/stores/create-conversation-payload.svelte';

	let currentStep = $state<'step-1-select-type'>('step-1-select-type');
</script>

<svelte:head>
	<title>New Conversation</title>
</svelte:head>

<span class="dark:text-white">{JSON.stringify(getCreateConversationPayload())}</span>

{#if currentStep === 'step-1-select-type'}
	<CreateConversationStep1 />
{/if}
