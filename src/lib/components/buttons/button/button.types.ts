import type { Snippet } from 'svelte';
import type { ButtonType, ButtonVariant } from '../shared-button-types';

export type { ButtonType, ButtonVariant };

export interface ButtonProps {
	type?: ButtonType;
	variant?: ButtonVariant;
	disabled?: boolean;
	class?: string;
	onClick?: (event: MouseEvent) => void;
	/** Native `aria-label` for icon-only or abbreviated buttons */
	ariaLabel?: string;
	title?: string;
	children: Snippet;
}
