import type { Component } from 'svelte';

export interface DropdownSelectOption<T = string> {
	label: string;
	value: T;
	icon?: Component<Record<string, unknown>> | LucideIcon;
}

export interface DropdownSelectProps<T = string> {
	value: T;
	options: DropdownSelectOption<T>[];
	/** Use when binding to nested state (e.g. `obj.field`) is invalid; parent updates `value` in this callback. */
	onValueChange?: (value: T) => void;
	ariaLabel?: string;
	buttonClass?: string;
	dropdownClass?: string;
	itemClass?: string;
	iconClass?: string;
}
