import type { RegisterableHotkey } from '@tanstack/svelte-hotkeys';
import type { Snippet } from 'svelte';
import type { ButtonType, ButtonVariant } from '$lib/styles/control-appearance';

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
	/** When set, registers a document-level shortcut and shows it after the label */
	hotkey?: RegisterableHotkey;
	children: Snippet;
}
