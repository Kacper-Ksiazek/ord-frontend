import type { Component, Snippet } from 'svelte';

export interface DropdownMultiSelectOption<T extends string> {
	label: string;
	value: T;
	icon?: Component<Record<string, unknown>> | LucideIcon;
}

export interface DropdownMultiSelectProps<T extends string> {
	values: T[];
	options: DropdownMultiSelectOption<T>[];
	placeholder: string;
	ariaLabel?: string;
	buttonClass?: string;
	dropdownClass?: string;
	icon?: Snippet;
	optionLeading?: Snippet<[DropdownMultiSelectOption<T>]>;
	onValuesChange?: (values: T[]) => void;
	dataTestId?: string;
}
