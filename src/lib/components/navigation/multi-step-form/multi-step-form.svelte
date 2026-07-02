<script lang="ts">
	import { Button } from '$lib/components/actions/button';
	import { cn } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import type { MultiStepFormProps } from './multi-step-form.types';
	import type { Snippet } from 'svelte';

	type Props = MultiStepFormProps & {
		children: Snippet<[number]>;
	};

	let {
		steps,
		currentStep: currentStepProp = $bindable(0),
		onStepChange,
		finalStepButtonText,
		onFinalStepClick,
		dataTestIdPrefix,
		children
	}: Props = $props();

	const totalSteps = steps.length;
	const currentStep = $derived(currentStepProp);

	const canGoNext = $derived.by(() => {
		const stepConfig = steps[currentStep];
		if (!stepConfig?.validate) return true;

		return stepConfig.validate();
	});

	const canGoPrevious = $derived(currentStep > 0);

	function nextStep() {
		if (currentStep < totalSteps - 1 && canGoNext) {
			const newStep = currentStep + 1;
			currentStepProp = newStep;
			onStepChange?.(newStep);
		}
	}

	function previousStep() {
		if (currentStep > 0) {
			const newStep = currentStep - 1;
			currentStepProp = newStep;
			onStepChange?.(newStep);
		}
	}

	/** Cmd/Ctrl + ← / → — avoid bare arrows (text fields); Mod+Enter only on final action */
	const hotkeyPrevious = 'Mod+ArrowLeft';
	const hotkeyNext = 'Mod+ArrowRight';
	const hotkeyComplete = 'Mod+Enter';
</script>

<div class="flex min-h-0 flex-1 flex-col gap-6">
	<!-- Step Indicator -->
	<div class="flex flex-col gap-2">
		<div class="flex flex-col gap-2">
			<h2 class="text-2xl font-bold text-gray-700 dark:text-gray-300">
				{steps[currentStep].header}
			</h2>

			<span class="text-sm font-light text-gray-500 dark:text-gray-300">
				{m['components.utils.multi-step-form.step_indicator']({
					current: currentStep + 1,
					total: totalSteps
				})}
			</span>
		</div>

		<div
			class="flex items-center w-full gap-2 h-2.5"
			data-testid={dataTestIdPrefix ? `${dataTestIdPrefix}-stepper` : undefined}
		>
			{#each steps as _step, index (index)}
				{@const isActive = index === currentStep}
				{@const isCompleted = index < currentStep}

				<div
					data-testid={dataTestIdPrefix ? `${dataTestIdPrefix}-step-${index}` : undefined}
					class={cn(
						'rounded-full transition-all duration-300 ease-in-out',
						isActive && 'h-2.5 bg-primary-600 dark:bg-primary-500',
						!isActive && 'h-2',
						isCompleted && 'bg-primary-200 dark:bg-primary-800',
						!isActive && !isCompleted && 'bg-gray-300 dark:bg-gray-600'
					)}
					style="width: {100 / totalSteps}%"
					aria-label={m['components.utils.multi-step-form.step_label']({
						step: index + 1,
						total: totalSteps
					})}
				></div>
			{/each}
		</div>
	</div>

	<!-- Step Content -->
	<div class="relative min-h-0 flex-1">
		{#key currentStep}
			<div class="absolute inset-0 min-h-0 w-full" transition:fade={{ duration: 200 }}>
				{@render children(currentStep)}
			</div>
		{/key}
	</div>

	<!-- Navigation Buttons -->
	<div class="flex items-center gap-2 pt-4">
		{#if canGoPrevious}
			<div transition:fade={{ duration: 150 }}>
				<Button
					type="OUTLINED"
					variant="PRIMARY"
					onClick={previousStep}
					hotkey={hotkeyPrevious}
					dataTestId={dataTestIdPrefix ? `${dataTestIdPrefix}-previous` : undefined}
					class="min-w-64"
				>
					{m['components.utils.multi-step-form.previous']()}
				</Button>
			</div>
		{/if}

		<div class="ml-auto">
			{#if currentStep < totalSteps - 1}
				<Button
					type="FILLED"
					variant="PRIMARY"
					onClick={nextStep}
					disabled={!canGoNext}
					hotkey={hotkeyNext}
					dataTestId={dataTestIdPrefix ? `${dataTestIdPrefix}-next` : undefined}
					class="min-w-64"
				>
					{m['components.utils.multi-step-form.next']()}
				</Button>
			{:else if finalStepButtonText}
				<Button
					type="FILLED"
					variant="PRIMARY"
					onClick={() => {
						if (onFinalStepClick) {
							onFinalStepClick();
						} else {
							nextStep();
						}
					}}
					disabled={!canGoNext}
					hotkey={hotkeyComplete}
					dataTestId={dataTestIdPrefix ? `${dataTestIdPrefix}-start` : undefined}
					class="min-w-64"
				>
					{finalStepButtonText}
				</Button>
			{/if}
		</div>
	</div>
</div>
