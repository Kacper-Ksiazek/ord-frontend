import type { HTMLAttributes } from 'svelte/elements';
import type { IconCardVariant } from '../icon-card/icon-card.types';

export interface LineChartDataPoint {
	label: string;
	value: number;
}

export interface LineChartCardProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'role' | 'tabindex' | 'aria-disabled'
> {
	title: string;
	value: string | number;
	/** Series points; `label` is not drawn on the chart (for a11y / future use). */
	data: LineChartDataPoint[];
	variant?: IconCardVariant;
	isActive?: boolean;
	disabled?: boolean;
	/** When set, the chart region is exposed as an image with this description. */
	chartAriaLabel?: string;
}
