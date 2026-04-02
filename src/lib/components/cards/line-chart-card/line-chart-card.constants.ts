import type { IconCardVariant } from '../icon-card/icon-card.types';

/** Line / gradient stroke color when the card is inactive or variant is `inactive`. */
const INACTIVE_LINE_HEX = '#9ca3af';

const ACTIVE_VARIANT_LINE_HEX: Record<Exclude<IconCardVariant, 'inactive'>, string> = {
	primary: '#0ea5e9',
	blue: '#3b82f6',
	green: '#22c55e',
	red: '#ef4444',
	purple: '#a855f7',
	neutral: '#6b7280'
};

export function getLineColorForVariant(variant: IconCardVariant, isActive: boolean): string {
	if (!isActive) return INACTIVE_LINE_HEX;
	if (variant === 'inactive') return INACTIVE_LINE_HEX;

	return ACTIVE_VARIANT_LINE_HEX[variant];
}
