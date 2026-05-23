import { cn } from 'flowbite-svelte';
import type { ButtonVariant } from './button-surface';

/** Outlined-only text fields share semantic variants with buttons (`PRIMARY` | `TEXT` | `DELETE`). */
export type InputVariant = ButtonVariant;

/** Full focus stack so variant ring color is not lost to base `focus:ring-2` / default gray ring. */
function inputFieldFocusRing(borderAndRingColor: string): string {
	return cn(
		'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-700',
		borderAndRingColor
	);
}

/**
 * Tailwind classes for an outlined text input: border, surface, hover, and focus ring/border
 * aligned with the variant (not always primary).
 */
export function getOutlinedInputFieldClasses(
	variant: InputVariant,
	disabled: boolean,
	readonly: boolean
): string {
	const canHover = !disabled && !readonly;
	const canShowVariantFocus = !disabled;

	switch (variant) {
		case 'PRIMARY':
			return cn(
				'border-primary-600 dark:border-primary-400',
				disabled
					? cn(
							'bg-primary-50/40 dark:bg-primary-950/25',
							'border-primary-400/50 dark:border-primary-600/40',
							'hover:bg-primary-50/40 dark:hover:bg-primary-950/25'
						)
					: cn(
							'bg-white dark:bg-gray-700',
							canHover && 'hover:bg-primary-50 dark:hover:bg-primary-900/20'
						),
				canShowVariantFocus &&
					inputFieldFocusRing(
						'focus:border-primary-600 dark:focus:border-primary-400 focus:ring-primary-300 dark:focus:ring-primary-800'
					)
			);
		case 'TEXT':
			return cn(
				'border-gray-400/60 dark:border-gray-500/60',
				disabled
					? cn(
							'bg-gray-100 dark:bg-gray-800',
							'border-gray-300/70 dark:border-gray-600/50',
							'hover:bg-gray-100 dark:hover:bg-gray-800'
						)
					: cn('bg-white dark:bg-gray-700', canHover && 'hover:bg-gray-50 dark:hover:bg-gray-600'),
				canShowVariantFocus &&
					inputFieldFocusRing(
						'focus:border-gray-500 dark:focus:border-gray-400 focus:ring-gray-300 dark:focus:ring-gray-800'
					)
			);
		case 'DELETE':
			return cn(
				'border-red-600 dark:border-red-400',
				disabled
					? cn(
							'bg-red-50/50 dark:bg-red-950/30',
							'border-red-400/50 dark:border-red-700/50',
							'hover:bg-red-50/50 dark:hover:bg-red-950/30'
						)
					: cn('bg-white dark:bg-gray-700', canHover && 'hover:bg-red-50 dark:hover:bg-red-900/20'),
				canShowVariantFocus &&
					inputFieldFocusRing(
						'focus:border-red-600 dark:focus:border-red-400 focus:ring-red-300 dark:focus:ring-red-800'
					)
			);
	}
}
