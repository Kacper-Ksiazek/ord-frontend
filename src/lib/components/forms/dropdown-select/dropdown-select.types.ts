import type { Component } from 'svelte';

export interface DropdownSelectOption<T = string> {
	label: string;
	value: T;
	icon?: Component<Record<string, unknown>> | LucideIcon;
}

export interface DropdownSelectProps<T = string> {
	value: T;
	options: DropdownSelectOption<T>[];
	ariaLabel?: string;
	buttonClass?: string;
	dropdownClass?: string;
	itemClass?: string;
	iconClass?: string;
}
