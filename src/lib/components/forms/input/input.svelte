<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { InputProps } from './input.types';
	import '../forms.css';

	interface Props extends InputProps {
		value?: string;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		disabled = false,
		readonly = false,
		class: className = '',
		inputClass = '',
		leftAdornment,
		rightAdornment,
		adornmentClass = 'w-4 h-4',
		ariaLabel,
		ariaDescribedBy,
		debounced = false,
		debounceDelay = 300,
		onInput,
		onChange,
		onFocus,
		onBlur
	}: Props = $props();

	// eslint-disable-next-line svelte/prefer-writable-derived
	let internalValue = $state(value ?? '');

	$effect(() => {
		internalValue = value ?? '';
	});

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function handleInput(event: Event) {
		const inputEl = event.target as HTMLInputElement;
		internalValue = inputEl.value;

		if (!debounced) {
			value = internalValue;
			onInput?.(event);

			return;
		}

		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {
			value = internalValue;
			onInput?.(event);
		}, debounceDelay);
	}
</script>

<div class={cn('relative', className)}>
	<input
		{type}
		value={internalValue}
		{placeholder}
		{disabled}
		{readonly}
		aria-label={ariaLabel}
		aria-describedby={ariaDescribedBy}
		class={cn(
			'form-input-base form-input-text',
			'w-full',
			leftAdornment && 'pl-10',
			rightAdornment && 'pr-10',
			disabled && 'cursor-not-allowed opacity-50',
			readonly && 'cursor-default',
			inputClass
		)}
		oninput={handleInput}
		onchange={onChange}
		onfocus={onFocus}
		onblur={onBlur}
	/>

	{#if leftAdornment}
		{@const LeftIcon = leftAdornment}

		<div class="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
			<LeftIcon class={cn('text-gray-500 dark:text-gray-400', adornmentClass)} />
		</div>
	{/if}

	{#if rightAdornment}
		{@const RightIcon = rightAdornment}

		<div class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
			<RightIcon class={cn('text-gray-500 dark:text-gray-400', adornmentClass)} />
		</div>
	{/if}
</div>
