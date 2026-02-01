<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ButtonProps } from './button.types';
	import { formInputTextClasses } from '../shared-styles';

	let {
		type = 'FILLED',
		variant = 'PRIMARY',
		disabled = false,
		class: className = '',
		onClick,
		children
	}: ButtonProps = $props();

	const baseClasses = cn(
		'px-4 h-[40px] rounded-lg transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-offset-2',
		formInputTextClasses,
		disabled && 'cursor-not-allowed opacity-50',
		!disabled && 'cursor-pointer'
	);

	const typeVariantClasses = $derived.by(() => {
		switch (type) {
			case 'FILLED':
				switch (variant) {
					case 'PRIMARY':
						return cn(
							'bg-primary-600 text-white border border-primary-600',
							'dark:bg-primary-500 dark:text-white dark:border-primary-500',
							!disabled && 'hover:bg-primary-700 dark:hover:bg-primary-600',
							'focus:ring-primary-300 dark:focus:ring-primary-800'
						);
					case 'TEXT':
						return cn(
							'bg-gray-700 text-white border border-gray-700',
							'dark:bg-gray-600 dark:text-white dark:border-gray-600',
							!disabled && 'hover:bg-gray-800 dark:hover:bg-gray-700',
							'focus:ring-gray-300 dark:focus:ring-gray-800'
						);
					case 'DELETE':
						return cn(
							'bg-red-600 text-white border border-red-600',
							'dark:bg-red-500 dark:text-white dark:border-red-500',
							!disabled && 'hover:bg-red-700 dark:hover:bg-red-600',
							'focus:ring-red-300 dark:focus:ring-red-800'
						);
				}
				break;
			case 'OUTLINED':
				switch (variant) {
					case 'PRIMARY':
						return cn(
							'bg-transparent text-primary-600 border border-primary-600',
							'dark:bg-transparent dark:text-primary-400 dark:border-primary-400',
							!disabled && 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
							'focus:ring-primary-300 dark:focus:ring-primary-800'
						);
					case 'TEXT':
						return cn(
							'bg-transparent text-gray-700 border border-gray-300',
							'dark:bg-transparent dark:text-gray-300 dark:border-gray-600',
							!disabled && 'hover:bg-gray-50 dark:hover:bg-gray-800',
							'focus:ring-gray-300 dark:focus:ring-gray-800'
						);
					case 'DELETE':
						return cn(
							'bg-transparent text-red-600 border border-red-600',
							'dark:bg-transparent dark:text-red-400 dark:border-red-400',
							!disabled && 'hover:bg-red-50 dark:hover:bg-red-900/20',
							'focus:ring-red-300 dark:focus:ring-red-800'
						);
				}
				break;
		}
	});
</script>

<button
	{disabled}
	type="button"
	class={cn(baseClasses, typeVariantClasses, className)}
	onclick={onClick}
>
	{@render children()}
</button>
