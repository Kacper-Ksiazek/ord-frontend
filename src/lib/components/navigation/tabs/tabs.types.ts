export interface Tab<T extends string | number = string | number> {
	id: T;
	label: string;
	count?: number;
	disabled?: boolean;
	icon?: LucideIcon;
}

export type TabsSupportedTailwindColor = Extract<
	TailwindColor,
	'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'gray' | 'primary'
>;

export type TabsVariant = 'underline' | 'outlined';

export interface TabsProps {
	tabs: Tab[];
	activeTab?: string | number;
	activeColor?: TabsSupportedTailwindColor;
	variant?: TabsVariant;
	class?: string;
	/** Stable selector for E2E tests — applied to the tablist container */
	dataTestId?: string;
}
