<script lang="ts">
	import { Button, Spinner, cn } from 'flowbite-svelte';
	import { Send } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface Props {
		disabled?: boolean;
		pending?: boolean;
		isFocused?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { disabled = false, pending = false, isFocused = false, onclick }: Props = $props();
</script>

<Button
	data-testid={E2E_TEST_IDS.session.sendButton}
	class={cn(
		'p-3 rounded-xl bg-transparent dark:bg-transparent transition-all duration-200',
		disabled && 'cursor-not-allowed opacity-30 hover:bg-transparent hover:dark:bg-transparent',
		pending && 'bg-gray-400 cursor-wait',
		!disabled && 'hover:bg-gray-100 dark:hover:bg-gray-700'
	)}
	{disabled}
	{onclick}
>
	{#if pending}
		<Spinner size="4" class="fill-gray-700 dark:fill-gray-300" />
	{:else}
		<Send
			class={cn(
				'w-5 h-5 text-gray-700 dark:text-gray-300', //
				isFocused && 'text-primary-600 dark:text-primary-400'
			)}
		/>
	{/if}
</Button>
