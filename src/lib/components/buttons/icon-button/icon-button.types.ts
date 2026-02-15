import type { ButtonType, ButtonVariant } from '../shared-button-types';

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
