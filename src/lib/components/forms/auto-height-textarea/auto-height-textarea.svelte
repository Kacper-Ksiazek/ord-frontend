<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getOutlinedInputFieldClasses } from '$lib/styles/control-appearance';
	import type { AutoHeightTextareaProps } from './auto-height-textarea.types';
	import '../forms.css';

	let {
		value = $bindable(''),
		placeholder = '',
		className = '',
		formField = false,
		disabled = false,
		variant = 'TEXT',
		maxLength,
		isValid = $bindable(true),
		LINE_HEIGHT = 26,
		VERTICAL_PADDING = 12,
		onkeydown,
		onfocus,
		onblur,
		onInput
	}: AutoHeightTextareaProps = $props();

	const lengthConstraintActive = $derived(maxLength !== undefined);

	/** Design tokens use `DELETE` for semantic error (invalid) chrome. */
	const appearanceVariant = $derived(
		lengthConstraintActive && !isValid ? ('DELETE' as const) : variant
	);

	let textareaElement: HTMLTextAreaElement | undefined = $state();

	const MIN_ROWS = 1;
	const MAX_ROWS = 10;

	function totalHeightPx(rows: number) {
		return rows * LINE_HEIGHT + VERTICAL_PADDING;
	}

	function adjustTextareaHeight() {
		if (!textareaElement) return;

		textareaElement.style.height = 'auto';

		const scrollHeight = textareaElement.scrollHeight;
		const measuredRows = Math.ceil(Math.max(1, scrollHeight - VERTICAL_PADDING) / LINE_HEIGHT);

		let rowsForHeight = measuredRows;

		if (!value.trim()) {
			rowsForHeight = MIN_ROWS;
		}

		const clampedRows = Math.max(MIN_ROWS, Math.min(rowsForHeight, MAX_ROWS));

		textareaElement.style.height = `${totalHeightPx(clampedRows)}px`;

		if (measuredRows > MAX_ROWS) {
			textareaElement.style.overflowY = 'auto';
		} else {
			textareaElement.style.overflowY = 'hidden';
		}
	}

	function handleInput(e: Event) {
		adjustTextareaHeight();
		onInput?.(e);
	}

	$effect(() => {
		void value;
		if (textareaElement) {
			adjustTextareaHeight();
		}
	});

	$effect(() => {
		const limit = maxLength;
		if (limit === undefined) return;

		isValid = (value ?? '').length <= limit;
	});

	function handleKeyDown(e: KeyboardEvent) {
		onkeydown?.(e);
	}

	function resetHeight() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
		}
	}

	export { resetHeight };
</script>

<div
	class={cn(
		'w-full',
		formField &&
			cn(
				getOutlinedInputFieldClasses(appearanceVariant, disabled, false),
				disabled && 'cursor-not-allowed opacity-50',
				'text-sm border rounded-lg text-gray-800 dark:text-gray-200'
			),
		!formField && [
			'border-none bg-transparent hover:bg-transparent focus:bg-transparent',
			'focus:border-none focus:outline-none focus:ring-0',
			'placeholder:text-gray-500/90 dark:placeholder:text-gray-400/80',
			'custom-scrollbar'
		],
		className
	)}
>
	<textarea
		bind:this={textareaElement}
		bind:value
		{disabled}
		aria-invalid={lengthConstraintActive && !isValid ? true : undefined}
		{onfocus}
		{onblur}
		onkeydown={handleKeyDown}
		oninput={handleInput}
		{placeholder}
		rows={MIN_ROWS}
		class={cn(
			'w-full resize-none rounded-lg px-3 py-1.5 outline-none transition-colors duration-200',
			'custom-scrollbar',
			formField
				? 'border-none bg-transparent hover:bg-transparent focus:bg-transparent ring-0!'
				: [
						'border-none bg-transparent hover:bg-transparent focus:bg-transparent',
						'focus:border-none focus:outline-none focus:ring-0',
						'placeholder:text-gray-500/90 dark:placeholder:text-gray-400/80'
					],
			formField &&
				'text-sm font-medium text-gray-800 dark:text-gray-200 placeholder:font-normal placeholder:text-gray-500/90 dark:placeholder:text-gray-400/80',
			!formField &&
				lengthConstraintActive &&
				!isValid &&
				'ring-2 ring-inset ring-red-600/60 dark:ring-red-400/60'
		)}
		style="min-height: {totalHeightPx(MIN_ROWS)}px; max-height: {totalHeightPx(MAX_ROWS)}px;"
	></textarea>

	<style>
		textarea.custom-scrollbar::-webkit-scrollbar {
			width: 8px;
		}

		textarea.custom-scrollbar::-webkit-scrollbar-track {
			background: transparent;
			border-radius: 4px;
		}

		textarea.custom-scrollbar::-webkit-scrollbar-thumb {
			background: rgb(203 213 225);
			border-radius: 4px;
			transition: background 0.2s ease;
		}

		textarea.custom-scrollbar::-webkit-scrollbar-thumb:hover {
			background: rgb(148 163 184);
		}

		textarea.custom-scrollbar {
			scrollbar-width: thin;
			scrollbar-color: rgb(203 213 225) transparent;
		}
	</style>
</div>
