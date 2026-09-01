import { cn } from '$lib/utils/cn';

export type ButtonType = 'FILLED' | 'OUTLINED';
export type ButtonVariant = 'PRIMARY' | 'TEXT' | 'DELETE';

function buttonFocusRing(): string {
	return cn(
		'focus:outline-none focus:ring-2 focus:ring-offset-2',
		'focus:ring-ink/20 focus:ring-offset-canvas'
	);
}

/**
 * Get the CSS classes for button type and variant combinations.
 * Shared between Button and IconButton. Quiet studio: Primary = ink fill,
 * Ghost = outlined line, Subtle = accent-soft fill (FILLED + TEXT).
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
					return cn('bg-ink border-ink', !disabled && 'hover:opacity-90', buttonFocusRing());
				case 'TEXT':
					return cn(
						'bg-accent-soft border-accent-soft',
						!disabled && 'hover:bg-line hover:border-line',
						buttonFocusRing()
					);
				case 'DELETE':
					return cn('bg-danger border-danger', !disabled && 'hover:opacity-90', buttonFocusRing());
			}
			break;
		case 'OUTLINED':
			switch (variant) {
				case 'PRIMARY':
					return cn('bg-transparent border-ink', !disabled && 'hover:bg-accent-soft', buttonFocusRing());
				case 'TEXT':
					return cn(
						'bg-transparent border-line',
						!disabled && 'hover:bg-accent-soft',
						buttonFocusRing()
					);
				case 'DELETE':
					return cn(
						'bg-transparent border-danger',
						!disabled && 'hover:bg-danger/10',
						buttonFocusRing()
					);
			}
			break;
	}

	return '';
}

/**
 * Get text color classes for buttons based on type and variant.
 * Used by Button and IconButton.
 */
export function getButtonTextColorClasses(type: ButtonType, variant: ButtonVariant): string {
	if (type === 'FILLED') {
		switch (variant) {
			case 'PRIMARY':
			case 'DELETE':
				return 'text-on-ink';
			case 'TEXT':
				return 'text-ink';
		}
	}

	switch (variant) {
		case 'PRIMARY':
			return 'text-ink';
		case 'TEXT':
			return 'text-ink';
		case 'DELETE':
			return 'text-danger';
	}

	return '';
}

/**
 * Per-key chip styles for HotkeyKbd inside Button.
 */
export function getButtonHotkeyChipClasses(
	type: ButtonType,
	variant: ButtonVariant,
	disabled: boolean
): string {
	const shell = 'size-5 rounded-md flex items-center justify-center font-light leading-none border';

	if (type === 'FILLED' && (variant === 'PRIMARY' || variant === 'DELETE')) {
		return cn(
			shell,
			disabled
				? 'bg-on-ink/15 text-on-ink/70 border-on-ink/20'
				: 'bg-on-ink/20 text-on-ink border-on-ink/25'
		);
	}

	const tone = variant === 'DELETE' ? 'text-danger border-danger/70' : 'text-ink border-line';

	return cn(shell, 'bg-transparent', disabled ? 'opacity-60' : '', tone);
}
