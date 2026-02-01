<script lang="ts">
	import { cn, Tooltip } from 'flowbite-svelte';
	import type { IconButtonProps } from './icon-button.types';
	import { formInputBaseClasses } from '../shared-styles';

	let {
		icon: Icon,
		ariaLabel,
		tooltip,
		disabled = false,
		class: className = '',
		iconClass = 'w-4 h-4',
		onClick
	}: IconButtonProps = $props();

	const buttonId = `icon-button-${crypto.randomUUID()}`;
</script>

{#if tooltip}
	<Tooltip triggeredBy={`#${buttonId}`}>
		{tooltip}
	</Tooltip>
{/if}

<button
	id={buttonId}
	{disabled}
	{ariaLabel}
	type="button"
	class={cn(
		formInputBaseClasses,
		'flex items-center justify-center w-[40px] p-0',
		disabled && 'cursor-not-allowed opacity-50',
		!disabled && 'cursor-pointer',
		className
	)}
	onclick={onClick}
>
	<Icon class={cn('text-gray-700 dark:text-gray-300', iconClass)} />
</button>
