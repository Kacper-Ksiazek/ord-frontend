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

	const focusRingColor = $derived(
		disabled
			? ''
			: variant === 'primary'
				? 'focus:ring-primary-500'
				: variant === 'blue'
					? 'focus:ring-blue-500'
					: variant === 'green'
						? 'focus:ring-green-500'
						: variant === 'purple'
							? 'focus:ring-purple-500'
							: variant === 'red'
								? 'focus:ring-red-500'
								: ''
	);

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
	role={isClickable ? 'button' : undefined}
	{...isClickable
		? {
				tabindex: disabled ? -1 : 0,
				'aria-disabled': disabled
			}
		: {}}
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
	onclick={handleClick}
	onkeydown={handleKeydown}
	{...restProps}
>
	<div class={cn('text-sm', colors.text)}>{title}</div>
	<div class={cn('text-2xl font-bold', colors.valueText)}>{value}</div>

	<div class="absolute bottom-0 right-0 w-16 h-16">
		{@render icon({
			className: cn('w-full h-full transition-opacity', colors.icon, isActive && 'opacity-15')
		})}
	</div>
</div>
