import { cn } from 'flowbite-svelte';
import type { ButtonType, ButtonVariant } from './shared-button-types';

/**
 * Get the CSS classes for button type and variant combinations.
 * Shared between Button and IconButton components to ensure consistency.
 */
export function getButtonTypeVariantClasses(
	type: ButtonType,
	variant: ButtonVariant,
	disabled: boolean
): string {
	switch (type) {
		case 'FILLED':
			switch (variant) {
				case 'PRIMARY':
					return cn(
						'bg-primary-600 border-primary-600',
						'dark:bg-primary-500 dark:border-primary-500',
						!disabled && 'hover:bg-primary-700 dark:hover:bg-primary-600',
						'focus:ring-primary-300 dark:focus:ring-primary-800'
					);
				case 'TEXT':
					return cn(
						'bg-gray-700 border-gray-700',
						'dark:bg-gray-600 dark:border-gray-600',
						!disabled && 'hover:bg-gray-800 dark:hover:bg-gray-700',
						'focus:ring-gray-300 dark:focus:ring-gray-800'
					);
				case 'DELETE':
					return cn(
						'bg-red-600 border-red-600',
						'dark:bg-red-500 dark:border-red-500',
						!disabled && 'hover:bg-red-700 dark:hover:bg-red-600',
						'focus:ring-red-300 dark:focus:ring-red-800'
					);
			}
			break;
		case 'OUTLINED':
			switch (variant) {
				case 'PRIMARY':
					return cn(
						'bg-transparent border-primary-600',
						'dark:bg-transparent dark:border-primary-400',
						!disabled && 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
						'focus:ring-primary-300 dark:focus:ring-primary-800'
					);
				case 'TEXT':
					return cn(
						'bg-transparent border-gray-400/60',
						'dark:bg-transparent dark:border-gray-500/60',
						!disabled && 'hover:bg-black/5 dark:hover:bg-white/5',
						'focus:ring-gray-300 dark:focus:ring-gray-800'
					);
				case 'DELETE':
					return cn(
						'bg-transparent border-red-600',
						'dark:bg-transparent dark:border-red-400',
						!disabled && 'hover:bg-red-50 dark:hover:bg-red-900/20',
						'focus:ring-red-300 dark:focus:ring-red-800'
					);
			}
			break;
	}

	return '';
}

/**
 * Get text color classes for outlined buttons based on variant.
 * Used by IconButton to style the icon color.
 */
export function getButtonTextColorClasses(type: ButtonType, variant: ButtonVariant): string {
	if (type === 'FILLED') {
		return 'text-white';
	}
	switch (variant) {
		case 'PRIMARY':
			return 'text-primary-600 dark:text-primary-400';
		case 'TEXT':
			return 'text-gray-700 dark:text-gray-300';
		case 'DELETE':
			return 'text-red-600 dark:text-red-400';
	}

	return '';
}
