<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		isSelected?: boolean;
		disabled?: boolean;
		onclick: () => void;
		children: Snippet;
	}

	const {
		class: customClass = '',
		onclick,
		isSelected,
		disabled = false,
		children,
		...restProps
	}: Props = $props();
</script>

<div
	class={cn(
		'flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900 rounded-xl',
		'text-gray-500 dark:text-gray-200',
		!disabled && 'hover:bg-primary-50 cursor-pointer hover:dark:bg-primary-900',
		isSelected && 'bg-primary-200! dark:bg-primary-500! cursor-default',
		customClass
	)}
	role="button"
	tabindex="0"
	{onclick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onclick();
		}
	}}
	{...restProps}
>
	{@render children()}
</div>
