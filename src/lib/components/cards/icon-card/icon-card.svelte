<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { IconCardProps } from './icon-card.types';
	import { getVariantColors } from './icon-card.constants';

	let {
		title,
		value,
		class: customClass = '',
		variant = 'primary',
		isActive = true,
		disabled = false,
		icon,
		onclick,
		onkeydown,
		...restProps
	}: IconCardProps = $props();

	const colors = $derived(getVariantColors(variant, isActive));
	const isClickable = typeof onclick === 'function';

	const focusRingColor = $derived.by(() => {
		if (disabled) return '';
		switch (variant) {
			case 'primary':
				return 'focus:ring-primary-500';
			case 'blue':
				return 'focus:ring-blue-500';
			case 'green':
				return 'focus:ring-green-500';
			case 'purple':
				return 'focus:ring-purple-500';
			case 'red':
				return 'focus:ring-red-500';
			case 'inactive':
				return 'focus:ring-gray-400';
			default:
				return '';
		}
	});

	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			// Trigger click handler when Enter or Space is pressed
			if (onclick && e.currentTarget) {
				const syntheticEvent = {
					...e,
					type: 'click',
					currentTarget: e.currentTarget
				} as unknown as MouseEvent & { currentTarget: EventTarget & HTMLDivElement };
				onclick(syntheticEvent);
			}
		}
		onkeydown?.(e);
	}

	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (disabled) return;
		onclick?.(e);
	}
</script>

<div
	class={cn(
		'p-4 rounded-lg flex-1 relative border transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-offset-2',
		focusRingColor,
		colors.bg,
		colors.border,
		!isActive && !disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
		isClickable && 'cursor-pointer',
		disabled && 'opacity-50 cursor-not-allowed focus:ring-0',
		customClass
	)}
	{...isClickable
		? {
				role: 'button',
				tabindex: disabled ? -1 : 0,
				'aria-disabled': disabled,
				onclick: handleClick,
				onkeydown: handleKeydown
			}
		: {}}
	{...restProps}
>
	<div class={cn('text-sm', colors.text)}>{title}</div>
	<div class={cn('text-2xl font-bold', colors.valueText)}>{value}</div>

	<div class="absolute bottom-1 right-1 size-14">
		{@render icon({
			className: cn(
				'w-full h-full transition-colors', //
				colors.icon
			)
		})}
	</div>
</div>
