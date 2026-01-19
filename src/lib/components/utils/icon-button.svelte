<script lang="ts">
	import { cn, Tooltip } from 'flowbite-svelte';
	import type { Component } from 'svelte';

	interface IconButtonProps {
		icon: Component<Record<string, unknown>> | LucideIcon;
		ariaLabel: string;
		tooltip?: string;
		onClick?: (e: Event) => void;
		class?: string;
		id?: string;
		iconClass?: string;
	}

	let {
		icon: Icon,
		ariaLabel,
		tooltip,
		onClick,
		class: customClass = '',
		id,
		iconClass
	}: IconButtonProps = $props();

	function handleClick(e: Event) {
		e.stopPropagation();
		e.preventDefault();
		onClick?.(e);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			handleClick(e);
		}
	}
</script>

<button
	{id}
	class={cn(
		'flex items-center justify-center p-1.5 rounded-md transition-colors cursor-pointer',
		'hover:bg-gray-100 dark:hover:bg-gray-800',
		'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
		customClass
	)}
	onclick={handleClick}
	onkeydown={handleKeydown}
	aria-label={ariaLabel}
	type="button"
>
	<Icon
		class={cn(
			'w-4 h-4 text-gray-700 dark:text-gray-300', //
			iconClass
		)}
	/>
</button>

{#if tooltip}
	<Tooltip>
		{tooltip}
	</Tooltip>
{/if}
