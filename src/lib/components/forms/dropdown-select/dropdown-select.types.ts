import type { Component, Snippet } from 'svelte';

export interface DropdownSelectOption<T> {
	label: string;
	value: T;
	icon?: Component<Record<string, unknown>> | LucideIcon;
}

export interface DropdownSelectProps<T> {
	value: T;
	options: DropdownSelectOption<T>[];
	ariaLabel?: string;
	buttonClass?: string;
	dropdownClass?: string;
	/** This snippet overrides the default icon for the selected option. */
	icon?: Snippet<[{ selectedOption: DropdownSelectOption<T> }]>;

	/** Use when binding to nested state (e.g. `obj.field`) is invalid; parent updates `value` in this callback. */
	onValueChange?: (value: T) => void;
}
