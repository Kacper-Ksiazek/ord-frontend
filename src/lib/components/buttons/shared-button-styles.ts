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
						'dark:bg-primary-800 dark:border-primary-800',
						!disabled && 'hover:bg-primary-700 dark:hover:bg-primary-700',
						'focus:ring-primary-300 dark:focus:ring-primary-800'
					);
				case 'TEXT':
					return cn(
						'bg-gray-700 border-gray-700',
						'dark:bg-gray-800 dark:border-gray-800',
						!disabled && 'hover:bg-gray-800 dark:hover:bg-gray-700',
						'focus:ring-gray-300 dark:focus:ring-gray-800'
					);
				case 'DELETE':
					return cn(
						'bg-red-600 border-red-600',
						'dark:bg-red-800 dark:border-red-800',
						!disabled && 'hover:bg-red-700 dark:hover:bg-red-700',
						'focus:ring-red-300 dark:focus:ring-red-800'
					);
			}
			break;
		case 'OUTLINED':
			switch (variant) {
				case 'PRIMARY':
					return cn(
						'bg-transparent border-primary-600',
						'dark:border-primary-400',
						disabled ? 'dark:bg-primary-950/15' : 'dark:bg-transparent',
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

/**
 * Per-key chip styles for HotkeyKbd inside Button: filled uses white chips in light mode, darker
 * integrated chips in dark mode only; outlined uses transparent fill + accent border/text.
 */
export function getButtonHotkeyChipClasses(
	type: ButtonType,
	variant: ButtonVariant,
	disabled: boolean
): string {
	const shell = 'size-5 rounded-md flex items-center justify-center font-light leading-none border';

	if (!disabled) {
		if (type === 'FILLED') {
			switch (variant) {
				case 'PRIMARY':
					return cn(
						shell,
						'bg-white text-gray-900 border-white/40 shadow-sm',
						'dark:bg-primary-900/45 dark:text-white dark:border-primary-950/40'
					);
				case 'TEXT':
					return cn(
						shell,
						'bg-white text-gray-900 border-white/40 shadow-sm',
						'dark:bg-gray-900/50 dark:text-white dark:border-gray-950/35'
					);
				case 'DELETE':
					return cn(
						shell,
						'bg-white text-gray-900 border-white/40 shadow-sm',
						'dark:bg-red-950/50 dark:text-white dark:border-red-950/45'
					);
			}
		}
		switch (variant) {
			case 'PRIMARY':
				return cn(
					shell,
					'bg-transparent text-primary-600 border-primary-600 dark:text-primary-400 dark:border-primary-400'
				);
			case 'TEXT':
				return cn(
					shell,
					'bg-transparent text-gray-700 border-gray-500/70 dark:text-gray-300 dark:border-gray-500/60'
				);
			case 'DELETE':
				return cn(
					shell,
					'bg-transparent text-red-600 border-red-600 dark:text-red-400 dark:border-red-400'
				);
		}
	}

	if (type === 'FILLED') {
		switch (variant) {
			case 'PRIMARY':
				return cn(
					shell,
					'bg-primary-800/50 text-white border-white/30',
					'dark:bg-primary-950/55 dark:text-white/90 dark:border-primary-950/50'
				);
			case 'TEXT':
				return cn(
					shell,
					'bg-black/25 text-white/95 border-white/25',
					'dark:bg-gray-950/50 dark:text-white/90 dark:border-gray-950/40'
				);
			case 'DELETE':
				return cn(
					shell,
					'bg-red-900/45 text-white border-white/30',
					'dark:bg-red-950/55 dark:text-white/90 dark:border-red-950/50'
				);
		}
	}

	switch (variant) {
		case 'PRIMARY':
			return cn(
				shell,
				'bg-transparent text-primary-400 border-primary-300/80 dark:bg-transparent dark:text-primary-500 dark:border-primary-700/55'
			);
		case 'TEXT':
			return cn(
				shell,
				'bg-transparent text-gray-400 border-gray-300/80 dark:bg-transparent dark:text-gray-500 dark:border-gray-600/55'
			);
		case 'DELETE':
			return cn(
				shell,
				'bg-transparent text-red-400 border-red-300/80 dark:bg-transparent dark:text-red-500 dark:border-red-800/55'
			);
	}
}
