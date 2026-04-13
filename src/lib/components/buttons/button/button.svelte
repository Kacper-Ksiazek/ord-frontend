<script lang="ts">
	import { detectPlatform, normalizeRegisterableHotkey } from '@tanstack/svelte-hotkeys';
	import { cn } from 'flowbite-svelte';
	import { HotkeyKbd } from '$lib/components/keyboard/hotkey-kbd';
	import type { ButtonProps } from './button.types';
	import '$lib/components/forms/forms.css';
	import {
		getButtonHotkeyChipClasses,
		getButtonTextColorClasses,
		getButtonTypeVariantClasses
	} from '../shared-button-styles';

	let {
		type = 'FILLED',
		variant = 'PRIMARY',
		disabled = false,
		class: className = '',
		onClick,
		ariaLabel,
		title,
		hotkey,
		children
	}: ButtonProps = $props();

	let buttonEl: HTMLButtonElement | undefined = $state();

	const ariaKeyShortcuts = $derived(
		hotkey !== undefined ? normalizeRegisterableHotkey(hotkey, detectPlatform()) : undefined
	);

	function handleHotkeyActivate() {
		buttonEl?.click();
	}

	const baseClasses = $derived.by(() =>
		cn(
			'px-4 h-[40px] rounded-lg transition-colors flex items-center gap-1 border',
			'focus:outline-none focus:ring-2 focus:ring-offset-2',
			'form-input-text',
			disabled && 'cursor-not-allowed opacity-50',
			!disabled && 'cursor-pointer'
		)
	);

	const typeVariantClasses = $derived(getButtonTypeVariantClasses(type, variant, disabled));
	const textColorClasses = $derived(getButtonTextColorClasses(type, variant));
	const hotkeyChipClasses = $derived(getButtonHotkeyChipClasses(type, variant, disabled));
</script>

<button
	bind:this={buttonEl}
	{disabled}
	type="button"
	aria-label={ariaLabel}
	aria-keyshortcuts={ariaKeyShortcuts}
	{title}
	class={cn(baseClasses, typeVariantClasses, textColorClasses, className)}
	onclick={onClick}
>
	<span class="min-h-0 grow text-center">
		{@render children()}
	</span>

	{#if hotkey !== undefined}
		<HotkeyKbd
			{hotkey}
			{disabled}
			onActivate={handleHotkeyActivate}
			class="ml-2"
			hotkeyClass={hotkeyChipClasses}
		/>
	{/if}
</button>
