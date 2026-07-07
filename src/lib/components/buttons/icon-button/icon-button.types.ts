import type { ButtonType, ButtonVariant } from '$lib/styles/control-appearance';

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
	/** Stable selector for E2E tests (`data-testid`) */
	dataTestId?: string;
}
