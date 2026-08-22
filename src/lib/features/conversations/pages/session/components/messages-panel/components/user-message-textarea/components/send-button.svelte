<script lang="ts">
	import { Send } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import { Spinner } from '$lib/components/utils/spinner';
	import { cn } from '$lib/utils/cn';

	interface Props {
		disabled?: boolean;
		pending?: boolean;
		onclick?: (e: MouseEvent) => void;
	}

	let { disabled = false, pending = false, onclick }: Props = $props();
</script>

<button
	type="button"
	data-testid={E2E_TEST_IDS.session.sendButton}
	class={cn(
		'flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-transparent p-0 transition-colors',
		disabled && 'cursor-not-allowed opacity-30',
		pending && 'cursor-wait',
		!disabled && 'hover:bg-accent-soft'
	)}
	{disabled}
	{onclick}
>
	{#if pending}
		<Spinner class="text-ink" />
	{:else}
		<Send class="size-4 text-ink" />
	{/if}
</button>
