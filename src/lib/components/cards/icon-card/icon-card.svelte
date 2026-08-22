<script lang="ts">
	import { cn } from '$lib/utils/cn';
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
		'p-3 rounded-[10px] flex-1 relative border transition-colors',
		'focus:outline-none',
		colors.bg,
		colors.border,
		!isActive && !disabled && 'hover:bg-accent-soft',
		isActive && 'ring-0 focus:ring-0 focus-visible:ring-0',
		!isActive &&
			isClickable &&
			!disabled &&
			'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/15',
		isClickable && 'cursor-pointer',
		disabled && 'opacity-50 cursor-not-allowed',
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
	<div class={cn('text-xs', colors.text)}>{title}</div>
	<div class={cn('text-lg font-semibold', colors.valueText)}>{value}</div>

	<div class="absolute right-1 bottom-1 size-10">
		{@render icon({
			className: cn(
				'w-full h-full transition-colors', //
				colors.icon
			)
		})}
	</div>
</div>
