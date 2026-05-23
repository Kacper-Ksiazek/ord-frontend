export type StatusScreenVariant = 'error' | 'information' | 'success';

export interface StatusButtonProps {
	label: string;
	onClick?: () => void;
	disabled?: boolean;
	class?: string;
}
