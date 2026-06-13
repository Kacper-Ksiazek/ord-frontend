export type ActionMenuItemVariant = 'default' | 'delete';

export interface ActionMenuItem {
	label: string;
	icon: LucideIcon;
	onClick?: () => void;
	disabled?: boolean;
	variant?: ActionMenuItemVariant;
}

export interface ActionMenuProps {
	items: ActionMenuItem[];
	ariaLabel?: string;
	triggerIcon?: LucideIcon;
	class?: string;
	iconButtonClass?: string;
	iconClass?: string;
}
