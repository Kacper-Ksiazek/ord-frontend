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
		bg: 'bg-gray-100/60 dark:bg-gray-800/40',
		border: 'border-gray-200/80 dark:border-gray-700/60',
		text: 'text-gray-400 dark:text-gray-500',
		valueText: 'text-gray-500 dark:text-gray-400',
		icon: 'opacity-[0.1] text-gray-400 dark:text-gray-500'
	},

	neutral: {
		bg: 'bg-gray-50 dark:bg-gray-700/50',
		border: 'border-gray-200 dark:border-gray-600',
		text: 'text-gray-600 dark:text-gray-400',
		valueText: 'dark:text-gray-100',
		icon: 'opacity-[0.15]'
	},

	primary: {
		bg: 'bg-primary-50 dark:bg-primary-900/20',
		border: 'border-primary-300 dark:border-primary-700',
		text: 'text-primary-700 dark:text-primary-300',
		valueText: 'text-primary-900 dark:text-primary-100',
		icon: 'opacity-[0.15] text-primary-600 dark:text-primary-400'
	},

	blue: {
		bg: 'bg-blue-50 dark:bg-blue-900/20',
		border: 'border-blue-300 dark:border-blue-700',
		text: 'text-blue-700 dark:text-blue-300',
		valueText: 'text-blue-900 dark:text-blue-100',
		icon: 'opacity-[0.15] text-blue-600 dark:text-blue-400'
	},

	green: {
		bg: 'bg-green-50 dark:bg-green-900/20',
		border: 'border-green-300 dark:border-green-700',
		text: 'text-green-700 dark:text-green-300',
		valueText: 'text-green-900 dark:text-green-100',
		icon: 'opacity-[0.15] text-green-600 dark:text-green-400'
	},

	red: {
		bg: 'bg-red-50 dark:bg-red-900/20',
		border: 'border-red-300 dark:border-red-700',
		text: 'text-red-700 dark:text-red-300',
		valueText: 'text-red-900 dark:text-red-100',
		icon: 'opacity-[0.15] text-red-600 dark:text-red-400'
	},

	purple: {
		bg: 'bg-purple-50 dark:bg-purple-900/20',
		border: 'border-purple-300 dark:border-purple-700',
		text: 'text-purple-700 dark:text-purple-300',
		valueText: 'text-purple-900 dark:text-purple-100',
		icon: 'opacity-[0.15] text-purple-600 dark:text-purple-400'
	}
} as const;

export function getVariantColors(variant: IconCardVariant, isActive: boolean): VariantStyles {
	return isActive ? VARIANT_STYLES[variant] : VARIANT_STYLES.inactive;
}
