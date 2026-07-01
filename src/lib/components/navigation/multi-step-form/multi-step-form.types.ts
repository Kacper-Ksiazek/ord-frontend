export type StepValidationFn = () => boolean;

export interface StepConfig {
	/** Unique identifier for the step */
	id: string;
	/** Validation function that returns true if step is valid and can proceed */
	validate?: StepValidationFn;
	/** Custom header text to display instead of the default "Step X of Y" */
	header: string;
}

export interface MultiStepFormProps {
	/** Array of step configurations */
	steps: StepConfig[];
	/** Current active step index (0-based) */
	currentStep?: number;
	/** Callback when step changes */
	onStepChange?: (stepIndex: number) => void;
	/** Custom text for the button on the last step */
	finalStepButtonText?: string;
	/** Callback when the final step button is clicked */
	onFinalStepClick?: () => void;
	/** Prefix for `data-testid` on stepper segments and navigation buttons */
	testIdPrefix?: string;
}
