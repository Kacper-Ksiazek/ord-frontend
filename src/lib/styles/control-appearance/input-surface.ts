import { cn } from '$lib/utils/cn';
import type { ButtonVariant } from './button-surface';

/** Outlined-only text fields share semantic variants with buttons (`PRIMARY` | `TEXT` | `DELETE`). */
export type InputVariant = ButtonVariant;

function inputFieldFocusRing(borderAndRingColor: string): string {
	return cn(
		'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-canvas',
		borderAndRingColor
	);
}

/**
 * Tailwind classes for an outlined text input: border, surface, hover, and focus ring.
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
				'border-ink bg-surface text-ink',
				disabled && 'bg-accent-soft border-line',
				canHover && 'hover:bg-accent-soft',
				canShowVariantFocus && inputFieldFocusRing('focus:border-ink focus:ring-ink/20')
			);
		case 'TEXT':
			return cn(
				'border-line bg-surface text-ink',
				disabled && 'bg-accent-soft',
				canHover && 'hover:bg-accent-soft',
				canShowVariantFocus && inputFieldFocusRing('focus:border-ink focus:ring-ink/20')
			);
		case 'DELETE':
			return cn(
				'border-danger bg-surface text-ink',
				disabled && 'bg-danger/10',
				canHover && 'hover:bg-danger/10',
				canShowVariantFocus && inputFieldFocusRing('focus:border-danger focus:ring-danger/25')
			);
	}
}
