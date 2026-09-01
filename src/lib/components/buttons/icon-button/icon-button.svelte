<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { IconButtonProps } from './icon-button.types';
	import { cn } from '$lib/utils/cn';
	import {
		getButtonTypeVariantClasses,
		getButtonTextColorClasses
	} from '$lib/styles/control-appearance';

	let {
		icon: Icon,
		ariaLabel,
		type = 'FILLED',
		variant = 'PRIMARY',
		tooltip,
		disabled = false,
		class: className = '',
		iconClass = 'w-4 h-4',
		onClick,
		dataTestId
	}: IconButtonProps = $props();

	const baseClasses = $derived.by(() =>
		cn(
			'px-2.5 h-[40px] rounded-[10px] border flex items-center justify-center w-[40px] p-0',
			disabled && 'cursor-not-allowed opacity-50',
			!disabled && 'cursor-pointer'
		)
	);

	const typeVariantClasses = $derived(getButtonTypeVariantClasses(type, variant, disabled));
	const iconColorClasses = $derived(getButtonTextColorClasses(type, variant));
</script>

{#snippet button()}
	<button
		data-testid={dataTestId}
		{disabled}
		aria-label={ariaLabel}
		type="button"
		class={cn(baseClasses, typeVariantClasses, className)}
		onclick={onClick}
	>
		<Icon class={cn(iconColorClasses, iconClass)} />
	</button>
{/snippet}

{#if tooltip}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<button
					{...props}
					data-testid={dataTestId}
					{disabled}
					aria-label={ariaLabel}
					type="button"
					class={cn(
						typeof props.class === 'string' ? props.class : '',
						baseClasses,
						typeVariantClasses,
						className
					)}
					onclick={onClick}
				>
					<Icon class={cn(iconColorClasses, iconClass)} />
				</button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content class="overlay-surface z-50 px-2 py-1 text-xs" sideOffset={6}>
				{tooltip}
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
{:else}
	{@render button()}
{/if}
