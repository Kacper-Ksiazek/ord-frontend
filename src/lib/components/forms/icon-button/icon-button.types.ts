export interface IconButtonProps {
	icon: LucideIcon;
	ariaLabel: string;
	tooltip?: string;
	disabled?: boolean;
	class?: string;
	iconClass?: string;
	onClick?: (event: MouseEvent) => void;
}
