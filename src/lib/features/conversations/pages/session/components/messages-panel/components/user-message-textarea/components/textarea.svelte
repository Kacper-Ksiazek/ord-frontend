<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let {
		value = $bindable(''),
		placeholder = '',
		onkeydown
	}: {
		value?: string;
		placeholder?: string;
		onkeydown?: (e: KeyboardEvent) => void;
	} = $props();

	let textareaElement: HTMLTextAreaElement | undefined = $state();

	onMount(() => {
		textareaElement?.scrollIntoView();
	});

	const MIN_ROWS = 3;
	const MAX_ROWS = 10;
	const LINE_HEIGHT = 24; // Approximate line height in pixels

	function adjustTextareaHeight() {
		if (!textareaElement) return;

		// Reset height to auto to get the correct scrollHeight
		textareaElement.style.height = 'auto';

		// Calculate the number of rows needed
		const scrollHeight = textareaElement.scrollHeight;
		const rows = Math.ceil(scrollHeight / LINE_HEIGHT);
		const clampedRows = Math.max(MIN_ROWS, Math.min(rows, MAX_ROWS));

		// Set the height based on rows
		textareaElement.style.height = `${clampedRows * LINE_HEIGHT}px`;

		// Enable scrolling if content exceeds max rows
		if (rows > MAX_ROWS) {
			textareaElement.style.overflowY = 'auto';
		} else {
			textareaElement.style.overflowY = 'hidden';
		}
	}

	$effect(() => {
		if (textareaElement) {
			adjustTextareaHeight();
		}
	});

	$effect(() => {
		// Adjust height when value changes
		if (value !== undefined && textareaElement) {
			adjustTextareaHeight();
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (onkeydown) {
			onkeydown(e);
		}
	}

	function resetHeight() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
		}
	}

	// Expose resetHeight function for parent component
	export { resetHeight };
</script>

<textarea
	bind:this={textareaElement}
	bind:value
	onkeydown={handleKeyDown}
	oninput={adjustTextareaHeight}
	{placeholder}
	rows={MIN_ROWS}
	class={cn(
		'w-full resize-none border-none outline-none rounded-lg px-3 py-2',
		'bg-gray-50 dark:bg-slate-700',
		'hover:bg-gray-100 dark:hover:bg-slate-600',
		'focus:bg-gray-100 dark:focus:bg-slate-600',
		'focus:outline-none focus:ring-0 focus:border-none',
		'transition-colors duration-200',
		'text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500',
		'text-lg leading-6 custom-scrollbar'
	)}
	style="min-height: {LINE_HEIGHT}px; max-height: {MAX_ROWS * LINE_HEIGHT}px;"
></textarea>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgb(203 213 225); /* gray-300 */
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgb(148 163 184); /* gray-400 */
	}

	.dark .custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgb(71 85 105); /* slate-600 */
	}

	.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgb(100 116 139); /* slate-500 */
	}

	/* Firefox */
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgb(203 213 225) transparent;
	}

	.dark .custom-scrollbar {
		scrollbar-color: rgb(71 85 105) transparent;
	}
</style>
