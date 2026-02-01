import type { Snippet } from 'svelte';

export type ButtonType = 'FILLED' | 'OUTLINED';
export type ButtonVariant = 'PRIMARY' | 'TEXT';

export interface ButtonProps {
	type?: ButtonType;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
	onClick?: (event: MouseEvent) => void;
	children: Snippet;
}
