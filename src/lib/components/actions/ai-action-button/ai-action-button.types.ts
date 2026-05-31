export type AiActionButtonStatus = 'default' | 'loading' | 'success' | 'failed';

export interface AiActionButtonLabels {
	default: string;
	loading: string;
	success: string;
	failed: string;
}

export interface AiActionButtonProps {
	status: AiActionButtonStatus;
	disabled?: boolean;
	onclick: () => void;
	labels?: AiActionButtonLabels;
}
