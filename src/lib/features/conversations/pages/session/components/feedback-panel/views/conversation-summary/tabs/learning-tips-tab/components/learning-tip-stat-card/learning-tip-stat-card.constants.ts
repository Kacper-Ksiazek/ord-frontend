import type { TabFilter } from '../../learning-tips-tab.types';

type TabStyles = {
	bg: string;
	border: string;
	text: string;
	valueText: string;
	icon: string;
	focusRing: string;
};

type LearningTipStatCardStyles = Record<
	TabFilter,
	{
		active: TabStyles;
		inactive: TabStyles;
	}
>;

export const TAB_STYLES: LearningTipStatCardStyles = {
	ALL: {
		active: {
			bg: 'bg-primary-50 dark:bg-primary-900/20',
			border: 'border-primary-300 dark:border-primary-700',
			text: 'text-primary-700 dark:text-primary-300',
			valueText: 'text-primary-900 dark:text-primary-100',
			icon: 'opacity-[0.1] text-primary-600 dark:text-primary-400',
			focusRing: 'focus:ring-primary-500'
		},
		inactive: {
			bg: 'bg-gray-50 dark:bg-gray-700/50',
			border: 'border-gray-200 dark:border-gray-600',
			text: 'text-gray-600 dark:text-gray-400',
			valueText: 'dark:text-gray-100',
			icon: 'opacity-[0.05]',
			focusRing: 'focus:ring-primary-500'
		}
	},
	GRAMMAR: {
		active: {
			bg: 'bg-green-50 dark:bg-green-900/20',
			border: 'border-green-300 dark:border-green-700',
			text: 'text-green-700 dark:text-green-300',
			valueText: 'text-green-900 dark:text-green-100',
			icon: 'opacity-[0.1] text-green-600 dark:text-green-400',
			focusRing: 'focus:ring-green-500'
		},
		inactive: {
			bg: 'bg-gray-50 dark:bg-gray-700/50',
			border: 'border-gray-200 dark:border-gray-600',
			text: 'text-gray-600 dark:text-gray-400',
			valueText: 'dark:text-gray-100',
			icon: 'opacity-[0.05]',
			focusRing: 'focus:ring-green-500'
		}
	},
	VOCABULARY: {
		active: {
			bg: 'bg-blue-50 dark:bg-blue-900/20',
			border: 'border-blue-300 dark:border-blue-700',
			text: 'text-blue-700 dark:text-blue-300',
			valueText: 'text-blue-900 dark:text-blue-100',
			icon: 'opacity-[0.1] text-blue-600 dark:text-blue-400',
			focusRing: 'focus:ring-blue-500'
		},
		inactive: {
			bg: 'bg-gray-50 dark:bg-gray-700/50',
			border: 'border-gray-200 dark:border-gray-600',
			text: 'text-gray-600 dark:text-gray-400',
			valueText: 'dark:text-gray-100',
			icon: 'opacity-[0.05]',
			focusRing: 'focus:ring-blue-500'
		}
	},
	PHRASES: {
		active: {
			bg: 'bg-purple-50 dark:bg-purple-900/20',
			border: 'border-purple-300 dark:border-purple-700',
			text: 'text-purple-700 dark:text-purple-300',
			valueText: 'text-purple-900 dark:text-purple-100',
			icon: 'opacity-[0.1] text-purple-600 dark:text-purple-400',
			focusRing: 'focus:ring-purple-500'
		},
		inactive: {
			bg: 'bg-gray-50 dark:bg-gray-700/50',
			border: 'border-gray-200 dark:border-gray-600',
			text: 'text-gray-600 dark:text-gray-400',
			valueText: 'dark:text-gray-100',
			icon: 'opacity-[0.05]',
			focusRing: 'focus:ring-purple-500'
		}
	}
} as const;

export function getColors(tab: TabFilter, isActive: boolean) {
	return isActive ? TAB_STYLES[tab].active : TAB_STYLES[tab].inactive;
}
