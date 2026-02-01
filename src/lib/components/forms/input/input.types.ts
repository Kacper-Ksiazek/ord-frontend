export interface InputProps {
	value?: string;
	placeholder?: string;
	type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
	disabled?: boolean;
	readonly?: boolean;
	ariaLabel?: string;
	ariaDescribedBy?: string;
	class?: string;
	inputClass?: string;
	leftAdornment?: LucideIcon;
	rightAdornment?: LucideIcon;
	adornmentClass?: string;
	onInput?: (event: Event) => void;
	onChange?: (event: Event) => void;
	onFocus?: (event: Event) => void;
	onBlur?: (event: Event) => void;
}
