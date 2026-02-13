export interface Tab {
	id: string | number;
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
}
