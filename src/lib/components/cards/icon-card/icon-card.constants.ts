import type { IconCardVariant } from './icon-card.types';

type VariantStyles = {
	bg: string;
	border: string;
	text: string;
	valueText: string;
	icon: string;
};

type IconCardStyles = Record<IconCardVariant, VariantStyles>;

export const VARIANT_STYLES: IconCardStyles = {
	inactive: {
		bg: 'bg-surface',
		border: 'border-line',
		text: 'text-ink-muted',
		valueText: 'text-ink-muted',
		icon: 'opacity-[0.12] text-ink-muted'
	},

	neutral: {
		bg: 'bg-accent-soft',
		border: 'border-transparent',
		text: 'text-ink-muted',
		valueText: 'text-ink',
		icon: 'opacity-[0.18] text-ink-muted'
	},

	primary: {
		bg: 'bg-accent-soft',
		border: 'border-transparent',
		text: 'text-ink-muted',
		valueText: 'text-ink',
		icon: 'opacity-[0.18] text-ink-muted'
	},

	blue: {
		bg: 'bg-accent-soft',
		border: 'border-transparent',
		text: 'text-ink-muted',
		valueText: 'text-ink',
		icon: 'opacity-[0.2] text-blue-600 dark:text-blue-400'
	},

	green: {
		bg: 'bg-accent-soft',
		border: 'border-transparent',
		text: 'text-ink-muted',
		valueText: 'text-ink',
		icon: 'opacity-[0.2] text-emerald-600 dark:text-emerald-400'
	},

	red: {
		bg: 'bg-accent-soft',
		border: 'border-transparent',
		text: 'text-ink-muted',
		valueText: 'text-ink',
		icon: 'opacity-[0.2] text-red-600 dark:text-red-400'
	},

	purple: {
		bg: 'bg-accent-soft',
		border: 'border-transparent',
		text: 'text-ink-muted',
		valueText: 'text-ink',
		icon: 'opacity-[0.2] text-violet-600 dark:text-violet-400'
	}
} as const;

export function getVariantColors(variant: IconCardVariant, isActive: boolean): VariantStyles {
	return isActive ? VARIANT_STYLES[variant] : VARIANT_STYLES.inactive;
}
