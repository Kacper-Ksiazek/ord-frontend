export interface OtpInputProps {
	value?: string;
	onchange?: (value: string) => void;
	oncomplete?: (value: string) => void;
	disabled?: boolean;
	error?: boolean;
}
