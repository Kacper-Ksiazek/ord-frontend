<script lang="ts">
	import _isNil from 'lodash/isNil';
	import { CreateConversationStep1 } from '$lib/components/features/conversation/create';

	let currentStep = $state<'step-1-select-type'>('step-1-select-type');
</script>

<svelte:head>
	<title>New Conversation</title>
</svelte:head>

<section
	class="w-full flex-1 max-w-[1200px] mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-8 my-8 flex flex-col"
>
	{#if currentStep === 'step-1-select-type'}
		<CreateConversationStep1 />
	{/if}
</section>
