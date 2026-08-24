export type AiActionButtonStatus = 'default' | 'loading' | 'success' | 'failed';

export type AiActionButtonLabels = Partial<Record<AiActionButtonStatus, string>>;

export interface AiActionButtonProps {
	status: AiActionButtonStatus;
	disabled?: boolean;
	onclick: () => void;
	labels?: AiActionButtonLabels;
	class?: string;
}
