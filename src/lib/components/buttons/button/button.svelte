<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ButtonProps } from './button.types';
	import '$lib/components/forms/forms.css';
	import { getButtonTextColorClasses, getButtonTypeVariantClasses } from '../shared-button-styles';

	let {
		type = 'FILLED',
		variant = 'PRIMARY',
		disabled = false,
		class: className = '',
		onClick,
		children
	}: ButtonProps = $props();

	const baseClasses = $derived.by(() =>
		cn(
			'px-4 h-[40px] rounded-lg transition-colors flex items-center gap-1 border',
			'focus:outline-none focus:ring-2 focus:ring-offset-2',
			'form-input-text',
			disabled && 'cursor-not-allowed opacity-50',
			!disabled && 'cursor-pointer'
		)
	);

	const typeVariantClasses = $derived(getButtonTypeVariantClasses(type, variant, disabled));
	const textColorClasses = $derived(getButtonTextColorClasses(type, variant));
</script>

<button
	{disabled}
	type="button"
	class={cn(baseClasses, typeVariantClasses, textColorClasses, className)}
	onclick={onClick}
>
	{@render children()}
</button>
