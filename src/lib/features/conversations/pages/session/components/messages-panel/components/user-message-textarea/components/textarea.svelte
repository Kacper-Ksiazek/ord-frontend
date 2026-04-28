<script lang="ts">
	import { cn } from 'flowbite-svelte';

	let {
		value = $bindable(''),
		placeholder = '',
		className = '',
		onkeydown,
		onfocus,
		onblur
	}: {
		value?: string;
		placeholder?: string;
		className?: string;
		onfocus?: (e: FocusEvent) => void;
		onblur?: (e: FocusEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	} = $props();

	let textareaElement: HTMLTextAreaElement | undefined = $state();

	const MIN_ROWS = 1;
	const MAX_ROWS = 10;
	// Match `content-long` / Tailwind `leading-8` (2rem at default root)
	const LINE_HEIGHT = 32;
	// Must stay in sync with vertical padding class on `<textarea>` (`py-1.5` → 12px total)
	const VERTICAL_PADDING = 12;

	function totalHeightPx(rows: number) {
		return rows * LINE_HEIGHT + VERTICAL_PADDING;
	}

	function adjustTextareaHeight() {
		if (!textareaElement) return;

		// Reset height to auto to get the correct scrollHeight
		textareaElement.style.height = 'auto';

		const scrollHeight = textareaElement.scrollHeight;
		const measuredRows = Math.ceil(Math.max(0, scrollHeight - VERTICAL_PADDING) / LINE_HEIGHT);
		let rowsForHeight = measuredRows;
		// Empty: single row; scrollHeight can still read as ~2 “lines” in some browsers
		if (!value.trim()) {
			rowsForHeight = MIN_ROWS;
		}
		const clampedRows = Math.max(MIN_ROWS, Math.min(rowsForHeight, MAX_ROWS));

		// Include vertical padding so placeholder/text aren’t clipped (border-box height)
		textareaElement.style.height = `${totalHeightPx(clampedRows)}px`;

		if (measuredRows > MAX_ROWS) {
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
	{onfocus}
	{onblur}
	onkeydown={handleKeyDown}
	oninput={adjustTextareaHeight}
	{placeholder}
	rows={MIN_ROWS}
	class={cn(
		'w-full resize-none border-none outline-none rounded-lg px-3 py-1.5',
		'bg-transparent',
		'hover:bg-transparent',
		'focus:bg-transparent',
		'focus:outline-none focus:ring-0 focus:border-none',
		'transition-colors duration-200',
		'placeholder:text-gray-400 dark:placeholder:text-gray-500',
		'custom-scrollbar',
		className
	)}
	style="min-height: {totalHeightPx(MIN_ROWS)}px; max-height: {totalHeightPx(MAX_ROWS)}px;"
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

	/* Firefox */
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: rgb(203 213 225) transparent;
	}
</style>
