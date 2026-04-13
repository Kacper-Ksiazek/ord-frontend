<script lang="ts">
	import { formatForDisplay, getHotkeyManager } from '@tanstack/svelte-hotkeys';
	import { cn } from 'flowbite-svelte';
	import type { HotkeyKbdProps } from './hotkey-kbd.types';

	let {
		hotkey,
		disabled = false,
		onActivate,
		class: className = '',
		hotkeyClass = ''
	}: HotkeyKbdProps = $props();

	const hotkeyDisplay = $derived(formatForDisplay(hotkey));

	$effect(() => {
		if (onActivate === undefined || typeof document === 'undefined') return;

		const handle = getHotkeyManager().register(
			hotkey,
			() => {
				onActivate();
			},
			{ enabled: !disabled }
		);

		return () => handle.unregister();
	});

	function isCharacterALetterOrNumber(char: string) {
		return /^[a-zA-Z0-9]$/.test(char);
	}
</script>

<kbd
	class={cn('inline-flex shrink-0 items-center justify-center gap-1', className)}
	aria-hidden="true"
	data-disabled={disabled || undefined}
>
	{#each hotkeyDisplay.split(' ') as part, index (index)}
		<span
			class={cn(
				hotkeyClass
					? hotkeyClass
					: cn(
							'size-5 rounded-md flex items-center justify-center font-light leading-none border border-current/50',
							'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
							disabled && 'opacity-50'
						),
				isCharacterALetterOrNumber(part) ? 'text-xs' : 'text-lg'
			)}>{part}</span
		>
	{/each}
</kbd>
