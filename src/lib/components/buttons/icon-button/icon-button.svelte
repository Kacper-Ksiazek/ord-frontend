<script lang="ts">
	import { cn, Tooltip } from 'flowbite-svelte';
	import type { IconButtonProps } from './icon-button.types';
	import { getButtonTypeVariantClasses, getButtonTextColorClasses } from '../shared-button-styles';

	let {
		icon: Icon,
		ariaLabel,
		type = 'FILLED',
		variant = 'PRIMARY',
		tooltip,
		disabled = false,
		class: className = '',
		iconClass = 'w-4 h-4',
		onClick
	}: IconButtonProps = $props();

	const buttonId = `icon-button-${crypto.randomUUID()}`;

	const baseClasses = $derived.by(() =>
		cn(
			'px-2.5 h-[40px] rounded-lg border flex items-center justify-center w-[40px] p-0',
			'focus:outline-none focus:ring-2 focus:ring-offset-2',
			disabled && 'cursor-not-allowed opacity-50',
			!disabled && 'cursor-pointer'
		)
	);

	const typeVariantClasses = $derived(getButtonTypeVariantClasses(type, variant, disabled));
	const iconColorClasses = $derived(getButtonTextColorClasses(type, variant));
</script>

{#if tooltip}
	<Tooltip triggeredBy={`#${buttonId}`}>
		{tooltip}
	</Tooltip>
{/if}

<button
	id={buttonId}
	{disabled}
	aria-label={ariaLabel}
	type="button"
	class={cn(baseClasses, typeVariantClasses, className)}
	onclick={onClick}
>
	<Icon class={cn(iconColorClasses, iconClass)} />
</button>
