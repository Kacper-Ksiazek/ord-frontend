/**
 * Shared Tailwind CSS classes for form components
 * Used across dropdown-select, input, and other form components
 */

import { cn } from 'flowbite-svelte';

export const formInputBaseClasses = cn(
	'px-2.5 h-[40px] rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
	'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600',
	'focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600'
);

export const formInputContainerClasses = 'flex items-center gap-2';

export const formInputTextClasses = 'text-sm font-medium';
