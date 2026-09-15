export type AiActionButtonStatus = 'default' | 'loading' | 'success' | 'failed';

export type AiActionButtonLabels = Partial<Record<AiActionButtonStatus, string>>;

export interface AiActionButtonProps {
	status: AiActionButtonStatus;
	disabled?: boolean;
	onclick: () => void;
	labels?: AiActionButtonLabels;
	class?: string;
	/** Stable selector for E2E tests (`data-testid`) */
	dataTestId?: string;
}
