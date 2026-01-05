import { cn } from 'flowbite-svelte';

export function getHighlightedTextColors(): string {
	return cn(
		'bg-blue-200/50 text-blue-900 hover:bg-blue-300/70',
		'dark:bg-blue-900/70 dark:text-blue-100 dark:hover:bg-blue-600'
	);
}
