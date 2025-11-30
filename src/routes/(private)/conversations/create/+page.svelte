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

<section
	class="w-full h-full max-w-[1200px] mx-auto bg-slate-50 dark:bg-slate-800 pt-16 px-8 rounded-2xl"
>
	{#if currentStep === 'step-1-select-type'}
		<CreateConversationStep1 />
	{/if}
</section>
