<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Utils/MultiStepForm'
	});
</script>

<script lang="ts">
	import MultiStepForm from './multi-step-form.svelte';
	import type { StepConfig } from './multi-step-form.types';

	let currentStep = $state(0);

	const steps: StepConfig[] = [
		{
			id: 'step-1',
			header: 'Personal details',
			validate: () => true
		},
		{
			id: 'step-2',
			header: 'Job details',
			validate: () => true
		},
		{
			id: 'step-3',
			header: 'Payment details',
			validate: () => true
		}
	];

	function handleStepChange(stepIndex: number) {
		currentStep = stepIndex;
	}
</script>

<Story name="Default">
	<div class="p-8 bg-surface min-h-screen transition-colors">
		<div class="max-w-2xl mx-auto">
			<MultiStepForm
				{steps}
				bind:currentStep
				onStepChange={handleStepChange}
				finalStepButtonText="Complete"
			>
				{#snippet children(stepIndex)}
					{#if stepIndex === 0}
						<div class="p-6 bg-canvas rounded-lg">
							<h3 class="text-xl font-semibold mb-4 text-ink">Step 1 Content</h3>
							<p class="text-ink-muted">
								This is the first step of the form. You can add any content here.
							</p>
						</div>
					{:else if stepIndex === 1}
						<div class="p-6 bg-canvas rounded-lg">
							<h3 class="text-xl font-semibold mb-4 text-ink">Step 2 Content</h3>
							<p class="text-ink-muted">
								This is the second step of the form. Navigate back and forth using the buttons.
							</p>
						</div>
					{:else if stepIndex === 2}
						<div class="p-6 bg-canvas rounded-lg">
							<h3 class="text-xl font-semibold mb-4 text-ink">Step 3 Content</h3>
							<p class="text-ink-muted">
								This is the final step of the form. The button text changes to "Complete" on this step.
							</p>
						</div>
					{/if}
				{/snippet}
			</MultiStepForm>
		</div>
	</div>
</Story>
