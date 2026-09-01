import { getChartInkMuted, getChartPrimaryLine } from '$lib/components/charts';
import type { IconCardVariant } from '../icon-card/icon-card.types';

const ACTIVE_VARIANT_LINE_HEX: Record<
	Exclude<IconCardVariant, 'inactive' | 'primary' | 'neutral'>,
	string
> = {
	blue: '#3b82f6',
	green: '#22c55e',
	red: '#ef4444',
	purple: '#a855f7'
};

export function getLineColorForVariant(variant: IconCardVariant, isActive: boolean): string {
	if (!isActive || variant === 'inactive') {
		return getChartInkMuted();
	}
	if (variant === 'primary' || variant === 'neutral') {
		return getChartPrimaryLine();
	}

	return ACTIVE_VARIANT_LINE_HEX[variant];
}
