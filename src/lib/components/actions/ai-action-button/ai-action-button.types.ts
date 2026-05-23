export type AiActionButtonStatus = 'default' | 'loading' | 'success' | 'failed';

export interface AiActionButtonProps {
	status: AiActionButtonStatus;
	disabled?: boolean;
	onclick: () => void;
}
