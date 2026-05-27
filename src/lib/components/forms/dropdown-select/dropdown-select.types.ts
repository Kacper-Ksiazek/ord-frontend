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
	/** Overrides the default leading content for the selected option in the trigger button. */
	icon?: Snippet<[{ selectedOption: DropdownSelectOption<T> }]>;

	/** Leading content rendered for each option in the list and on the trigger when selected. */
	optionLeading?: Snippet<[DropdownSelectOption<T>]>;

	/** Use when binding to nested state (e.g. `obj.field`) is invalid; parent updates `value` in this callback. */
	onValueChange?: (value: T) => void;
}
