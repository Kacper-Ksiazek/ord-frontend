<script lang="ts">
	import { detectPlatform, normalizeRegisterableHotkey } from '@tanstack/svelte-hotkeys';
	import { cn } from 'flowbite-svelte';
	import {
		getButtonHotkeyChipClasses,
		getButtonTextColorClasses,
		getOutlinedInputFieldClasses
	} from '$lib/components/control-appearance';
	import { HotkeyKbd } from '$lib/components/keyboard/hotkey-kbd';
	import type { InputProps } from './input.types';
	import '../forms.css';

	interface Props extends InputProps {
		value?: string;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		variant = 'TEXT',
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
		onBlur,
		hotkey
	}: Props = $props();

	let inputEl: HTMLInputElement | undefined = $state();

	const ariaKeyShortcuts = $derived(
		hotkey !== undefined && !readonly
			? normalizeRegisterableHotkey(hotkey, detectPlatform())
			: undefined
	);

	function handleHotkeyActivate() {
		inputEl?.focus();
	}

	const hotkeyChipClasses = $derived(getButtonHotkeyChipClasses('OUTLINED', variant, disabled));

	const showRightChrome = $derived(Boolean(rightAdornment) || (hotkey !== undefined && !readonly));

	const rightChromePadding = $derived.by(() => {
		const hasAdorn = Boolean(rightAdornment);
		const hasHotkey = hotkey !== undefined && !readonly;
		if (!hasAdorn && !hasHotkey) return '';
		if (hasAdorn && hasHotkey) return 'pr-16';

		return 'pr-10';
	});

	const fieldAppearanceClasses = $derived(getOutlinedInputFieldClasses(variant, disabled, readonly));
	const adornmentColorClasses = $derived(
		disabled ? 'text-gray-400 dark:text-gray-500' : getButtonTextColorClasses('OUTLINED', variant)
	);

	// eslint-disable-next-line svelte/prefer-writable-derived
	let internalValue = $state(value ?? '');

	$effect(() => {
		internalValue = value ?? '';
	});

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		internalValue = target.value;

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
	{#if readonly}
		<span
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedBy}
			class={cn(
				'form-input-base form-input-text',
				'flex w-full min-w-0 items-center transition-colors',
				fieldAppearanceClasses,
				leftAdornment && 'pl-10',
				rightChromePadding,
				disabled && 'cursor-not-allowed opacity-50',
				'cursor-default',
				inputClass
			)}
		>
			<span
				class={cn(
					'min-w-0 truncate',
					!internalValue && 'text-gray-400/55 font-normal dark:text-gray-500/45'
				)}
			>
				{internalValue || placeholder || '\u00a0'}
			</span>
		</span>
	{:else}
		<input
			bind:this={inputEl}
			{type}
			value={internalValue}
			{placeholder}
			{disabled}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedBy}
			aria-keyshortcuts={ariaKeyShortcuts}
			class={cn(
				'form-input-base form-input-text',
				'w-full transition-colors',
				fieldAppearanceClasses,
				leftAdornment && 'pl-10',
				rightChromePadding,
				disabled && 'cursor-not-allowed opacity-50',
				inputClass
			)}
			oninput={handleInput}
			onchange={onChange}
			onfocus={onFocus}
			onblur={onBlur}
		/>
	{/if}

	{#if leftAdornment}
		{@const LeftIcon = leftAdornment}

		<div class="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
			<LeftIcon class={cn(adornmentColorClasses, adornmentClass)} />
		</div>
	{/if}

	{#if showRightChrome}
		<div
			class="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-1.5 pointer-events-none"
		>
			{#if hotkey !== undefined && !readonly}
				<HotkeyKbd
					{hotkey}
					{disabled}
					onActivate={handleHotkeyActivate}
					hotkeyClass={hotkeyChipClasses}
				/>
			{/if}
			{#if rightAdornment}
				{@const RightIcon = rightAdornment}

				<RightIcon class={cn(adornmentColorClasses, adornmentClass)} />
			{/if}
		</div>
	{/if}
</div>
