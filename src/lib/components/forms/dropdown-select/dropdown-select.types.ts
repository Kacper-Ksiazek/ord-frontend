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
	/** Leading content for each option (and the selected trigger when `icon` is unset). */
	optionLeading?: Snippet<[DropdownSelectOption<T>]>;

	/** Use when binding to nested state (e.g. `obj.field`) is invalid; parent updates `value` in this callback. */
	onValueChange?: (value: T) => void;
	/** Trigger button test id; options use `${dataTestId}-option-${value}` (`all` when value is null). */
	dataTestId?: string;
}
