<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import type { AiActionButtonStatus } from '$lib/components/buttons/ai-action-button/ai-action-button.types';
	import { cn } from '$lib/utils/cn';

	interface Props {
		fillButtonStatus: AiActionButtonStatus;
		onFillButtonStatusChange: (status: AiActionButtonStatus) => void;
		onSeedSampleWords: () => void;
		onApplyMockFillSuccess: () => void;
		onApplyMockFillRowErrors: () => void;
		onSetFillGlobalError: (message: string | null) => void;
		onResetForm: () => void;
	}

	let {
		fillButtonStatus,
		onFillButtonStatusChange,
		onSeedSampleWords,
		onApplyMockFillSuccess,
		onApplyMockFillRowErrors,
		onSetFillGlobalError,
		onResetForm
	}: Props = $props();

	let open = $state(false);

	const aiStatusScenarios: { label: string; status: AiActionButtonStatus }[] = [
		{ label: 'Default', status: 'default' },
		{ label: 'Loading', status: 'loading' },
		{ label: 'Success', status: 'success' },
		{ label: 'Failed', status: 'failed' }
	];

	const fillScenarios = [
		{ label: 'Seed sample words', action: onSeedSampleWords },
		{ label: 'Mock fill success', action: onApplyMockFillSuccess },
		{ label: 'Mock row errors', action: onApplyMockFillRowErrors },
		{
			label: 'Mock global error',
			action: () => {
				onSetFillGlobalError('Mock fill error — check learning language and try again.');
				onFillButtonStatusChange('failed');
			}
		},
		{
			label: 'Clear fill errors',
			action: () => {
				onSetFillGlobalError(null);
				onFillButtonStatusChange('default');
			}
		},
		{ label: 'Reset form', action: onResetForm }
	] as const;
</script>

{#if import.meta.env.DEV}
	<div
		data-capture-devtools
		class="pointer-events-none fixed bottom-4 left-4 z-[60] flex flex-col items-start gap-2"
	>
		<Button
			type="OUTLINED"
			variant="TEXT"
			class="pointer-events-auto !h-8 !px-3 !text-xs shadow-sm"
			onClick={() => {
				open = !open;
			}}
		>
			{open ? 'Hide capture devtools' : 'Capture devtools'}
		</Button>

		{#if open}
			<div
				class={cn(
					'pointer-events-auto overlay-surface w-[min(320px,calc(100vw-2rem))] rounded-[10px] border border-line p-3 shadow-lg',
					'flex flex-col gap-3'
				)}
			>
				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Fill with AI status</p>
					<p class="mt-1 text-xs text-ink-subtle">Current: {fillButtonStatus}</p>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each aiStatusScenarios as scenario (scenario.status)}
							<Button
								type="OUTLINED"
								variant="TEXT"
								class="!h-8 !px-2 !text-xs"
								onClick={() => onFillButtonStatusChange(scenario.status)}
							>
								{scenario.label}
							</Button>
						{/each}
					</div>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Fill scenarios</p>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each fillScenarios as scenario (scenario.label)}
							<Button type="OUTLINED" variant="TEXT" class="!h-8 !px-2 !text-xs" onClick={scenario.action}>
								{scenario.label}
							</Button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
