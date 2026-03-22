<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { ServerCrash, RotateCcw, Home } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { goto } from '$app/navigation';

	interface Props {
		header?: string;
		errorCode?: string | number;
		description?: string;
		onRetry?: () => void;
		class?: string;
	}

	const {
		header = 'Something went wrong',
		errorCode,
		description = 'An unexpected error occurred. Please try again or return to the home page.',
		onRetry,
		class: customClass = ''
	}: Props = $props();

	function handleHome() {
		goto('/');
	}
</script>

<div
	class={cn('flex flex-col items-center justify-center gap-6 py-16 px-8 text-center', customClass)}
>
	<div class="rounded-full bg-red-50 dark:bg-red-950/30 p-4">
		<ServerCrash class="w-8 h-8 text-red-400 dark:text-red-500" />
	</div>

	<div class="flex flex-col items-center gap-2 max-w-md">
		{#if errorCode}
			<span
				class="text-xs font-mono font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase"
			>
				Error {errorCode}
			</span>
		{/if}

		<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
			{header}
		</h2>

		{#if description}
			<p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
				{description}
			</p>
		{/if}
	</div>

	<div class="flex items-center gap-3">
		{#if onRetry}
			<Button type="OUTLINED" variant="TEXT" onClick={onRetry}>
				<RotateCcw class="w-4 h-4" />
				Try again
			</Button>
		{/if}

		<Button type="FILLED" variant="TEXT" onClick={handleHome}>
			<Home class="w-4 h-4" />
			Go home
		</Button>
	</div>
</div>
