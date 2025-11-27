export type Status = 'default' | 'loading' | 'success' | 'failed';

export interface Props {
	status: Status;
	disabled?: boolean;
	onclick: () => void;
}
