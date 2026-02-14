import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type IconCardVariant = 'blue' | 'green' | 'red' | 'purple' | 'primary';

export interface IconCardProps extends Omit<
	HTMLAttributes<HTMLDivElement>,
	'role' | 'tabindex' | 'aria-disabled'
> {
	title: string;
	value: string | number;
	class?: string;
	variant?: IconCardVariant;
	isActive?: boolean;
	disabled?: boolean;
	icon: Snippet<[{ className: string }]>;
}
