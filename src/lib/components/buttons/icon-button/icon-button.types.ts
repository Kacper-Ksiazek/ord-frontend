import type { ButtonType, ButtonVariant } from '$lib/components/control-appearance';

export type { ButtonType, ButtonVariant };

export interface IconButtonProps {
	icon: LucideIcon;
	ariaLabel: string;
	type?: ButtonType;
	variant?: ButtonVariant;
	tooltip?: string;
	disabled?: boolean;
	class?: string;
	iconClass?: string;
	onClick?: (event: MouseEvent) => void;
}
