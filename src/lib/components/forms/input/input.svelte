<script lang="ts">
	import { detectPlatform, normalizeRegisterableHotkey } from '@tanstack/svelte-hotkeys';
	import { cn } from '$lib/utils/cn';
	import {
		getButtonHotkeyChipClasses,
		getButtonTextColorClasses,
		getOutlinedInputFieldClasses
	} from '$lib/styles/control-appearance';
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
		maxLength,
		isValid = $bindable(true),
		debounced = false,
		debounceDelay = 300,
		onInput,
		onChange,
		onFocus,
		onBlur,
		hotkey,
		dataTestId
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

	const lengthConstraintActive = $derived(maxLength !== undefined);

	/** Design tokens use `DELETE` for semantic error (invalid) chrome. */
	const appearanceVariant = $derived(
		lengthConstraintActive && !isValid ? ('DELETE' as const) : variant
	);

	const hotkeyChipClasses = $derived(
		getButtonHotkeyChipClasses('OUTLINED', appearanceVariant, disabled)
	);

	const showRightChrome = $derived(Boolean(rightAdornment) || (hotkey !== undefined && !readonly));

	const rightChromePadding = $derived.by(() => {
		const hasAdorn = Boolean(rightAdornment);
		const hasHotkey = hotkey !== undefined && !readonly;
		if (!hasAdorn && !hasHotkey) return '';
		if (hasAdorn && hasHotkey) return 'pr-16';

		return 'pr-10';
	});

	const fieldAppearanceClasses = $derived(
		getOutlinedInputFieldClasses(appearanceVariant, disabled, readonly)
	);
	const adornmentColorClasses = $derived(
		disabled ? 'text-ink-subtle' : getButtonTextColorClasses('OUTLINED', appearanceVariant)
	);

	let internalValue = $state(value ?? '');

	$effect(() => {
		// Avoid clobbering in-progress edits when the parent bindable hasn't flushed yet.
		if (document.activeElement === inputEl) return;

		internalValue = value ?? '';
	});

	$effect(() => {
		const limit = maxLength;
		if (limit === undefined) return;

		isValid = (internalValue ?? '').length <= limit;
	});

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;

	function propagateValue(event: Event, notify: 'input' | 'change') {
		if (!debounced) {
			value = internalValue;
			if (notify === 'input') onInput?.(event);
			else onChange?.(event);

			return;
		}

		clearTimeout(debounceTimer);

		debounceTimer = setTimeout(() => {
			value = internalValue;
			if (notify === 'input') onInput?.(event);
			else onChange?.(event);
		}, debounceDelay);
	}

	function handleInput(event: Event) {
		propagateValue(event, 'input');
	}

	function handleChange(event: Event) {
		propagateValue(event, 'change');
	}
</script>

<div class={cn('relative', className)}>
	{#if readonly}
		<span
			data-testid={dataTestId}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedBy}
			aria-invalid={lengthConstraintActive && !isValid ? true : undefined}
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
			<span class={cn('min-w-0 truncate', !internalValue && 'text-ink-subtle font-normal')}>
				{internalValue || placeholder || '\u00a0'}
			</span>
		</span>
	{:else}
		<input
			bind:this={inputEl}
			data-testid={dataTestId}
			{type}
			bind:value={internalValue}
			{placeholder}
			{disabled}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedBy}
			aria-invalid={lengthConstraintActive && !isValid ? true : undefined}
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
			onchange={handleChange}
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
