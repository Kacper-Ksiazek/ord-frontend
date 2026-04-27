import type { RegisterableHotkey } from '@tanstack/svelte-hotkeys';
import type { InputVariant } from '$lib/components/control-appearance';

export type { InputVariant };

export interface InputProps {
	value?: string;
	placeholder?: string;
	type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
	/** Outlined semantic variant; drives border, hover, focus ring, and adornment tint. */
	variant?: InputVariant;
	disabled?: boolean;
	readonly?: boolean;
	ariaLabel?: string;
	ariaDescribedBy?: string;
	hotkey?: RegisterableHotkey;
	class?: string;
	inputClass?: string;
	leftAdornment?: LucideIcon;
	rightAdornment?: LucideIcon;
	adornmentClass?: string;
	debounced?: boolean;
	debounceDelay?: number;
	onInput?: (event: Event) => void;
	onChange?: (event: Event) => void;
	onFocus?: (event: Event) => void;
	onBlur?: (event: Event) => void;
}
