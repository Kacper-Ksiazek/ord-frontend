import type { InputVariant } from '$lib/styles/control-appearance';

export type { InputVariant };

export interface AutoHeightTextareaProps {
	value?: string | null;
	placeholder?: string;
	className?: string;
	textAreaClassName?: string;
	formField?: boolean;
	disabled?: boolean;
	/** Outlined semantic variant when `formField` is true; invalid length forces error chrome. */
	variant?: InputVariant;
	LINE_HEIGHT?: number;
	VERTICAL_PADDING?: number;
	/** When set, `isValid` reflects whether length is within this limit; over-limit values are allowed (no typing cap), invalid uses error styling. */
	maxLength?: number;
	/** Reflects whether the value length is within `maxLength` (not updated when `maxLength` is unset). */
	isValid?: boolean;
	onfocus?: (e: FocusEvent) => void;
	onblur?: (e: FocusEvent) => void;
	onkeydown?: (e: KeyboardEvent) => void;
	onInput?: (event: Event) => void;
}
