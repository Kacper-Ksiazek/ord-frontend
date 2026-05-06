<script lang="ts">
	import { cn } from 'flowbite-svelte';
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
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl',
		'text-gray-500 dark:text-gray-200',
		'border border-gray-200 dark:border-slate-600',
		!disabled && 'hover:bg-primary-50 cursor-pointer hover:dark:bg-primary-900',
		isSelected && 'bg-primary-200! dark:bg-primary-500! border-primary-300 dark:border-primary-400',
		isSelected && 'cursor-default',
		disabled &&
			!isSelected &&
			cn(
				'cursor-not-allowed',
				locked && 'bg-gray-100! dark:bg-slate-800! border-gray-300 dark:border-slate-500 opacity-65',
				!locked && 'opacity-60'
			),
		customClass
	)}
	role="button"
	tabindex={disabled ? -1 : 0}
	aria-disabled={disabled}
	onclick={() => {
		if (!disabled) onclick();
	}}
	onkeydown={(e) => {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			onclick();
		}
	}}
	{...restProps}
>
	{@render children()}
</div>
