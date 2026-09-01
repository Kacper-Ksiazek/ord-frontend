<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		isSelected?: boolean;
		disabled?: boolean;
		/** Solid muted surface for unavailable options (e.g. locked conversation types). Other disabled cards keep dimmed opacity. */
		locked?: boolean;
		onclick: () => void;
		children: Snippet;
	}

	const {
		class: customClass = '',
		onclick,
		isSelected,
		disabled = false,
		locked = false,
		children,
		...restProps
	}: Props = $props();

	function isFromNestedButton(target: EventTarget | null): boolean {
		if (!target || typeof (target as { closest?: (sel: string) => unknown }).closest !== 'function') {
			return false;
		}

		return Boolean((target as unknown as { closest: (sel: string) => unknown }).closest('button'));
	}
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center rounded-[10px] border border-line bg-surface p-2',
		'text-ink-muted',
		!disabled && 'cursor-pointer hover:bg-accent-soft',
		isSelected && 'border-ink bg-accent-soft! text-ink',
		isSelected && 'cursor-default',
		disabled &&
			!isSelected &&
			cn(
				'cursor-not-allowed',
				locked && 'bg-accent-soft! text-ink-subtle opacity-70',
				!locked && 'opacity-60'
			),
		customClass
	)}
	role="button"
	tabindex={disabled ? -1 : 0}
	aria-disabled={disabled}
	onclick={(e) => {
		if (disabled || isFromNestedButton(e.target)) return;
		onclick();
	}}
	onkeydown={(e) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			if (isFromNestedButton(e.target)) return;
			onclick();
		}
	}}
	{...restProps}
>
	{@render children()}
</div>
