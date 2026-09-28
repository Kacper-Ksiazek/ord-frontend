<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { cn } from '$lib/utils/cn';
	import type { ExplainPhraseFollowUpAction } from '$aiExplainer/types';
	import {
		EXPLAIN_PHRASE_DEVTOOLS_SEEDS,
		type ExplainPhraseDevtoolsSeed
	} from './explain-phrase-popover-devtools.constants';

	interface Props {
		onApplySeed: (seed: ExplainPhraseDevtoolsSeed) => void;
		onRunExplain: () => void;
		onFollowUp: (action: ExplainPhraseFollowUpAction) => void;
		onClearError: () => void;
		onResetForm: () => void;
		onOpenModal: () => void;
	}

	let { onApplySeed, onRunExplain, onFollowUp, onClearError, onResetForm, onOpenModal }: Props =
		$props();

	let open = $state(false);

	const formPresets = [
		{ label: 'EN: audacity', seed: EXPLAIN_PHRASE_DEVTOOLS_SEEDS.englishAudacity },
		{ label: 'DE: Hund', seed: EXPLAIN_PHRASE_DEVTOOLS_SEEDS.germanNoun },
		{ label: 'NO + context', seed: EXPLAIN_PHRASE_DEVTOOLS_SEEDS.norwegianWithContext },
		{ label: 'PL idiom full', seed: EXPLAIN_PHRASE_DEVTOOLS_SEEDS.polishIdiomFull },
		{ label: 'EN phrasal verb', seed: EXPLAIN_PHRASE_DEVTOOLS_SEEDS.englishPhrasalVerb }
	] as const;

	const followUpPresets: { label: string; action: ExplainPhraseFollowUpAction }[] = [
		{ label: 'Simpler', action: 'SIMPLER' },
		{ label: 'More examples', action: 'MORE_EXAMPLES' },
		{ label: 'Similar expressions', action: 'SIMILAR_EXPRESSIONS' }
	];

	const actionPresets = [
		{ label: 'Run explain', action: onRunExplain },
		{ label: 'Clear error', action: onClearError },
		{ label: 'Open modal', action: onOpenModal },
		{ label: 'Reset form', action: onResetForm }
	] as const;
</script>

{#if import.meta.env.DEV}
	<div
		data-explain-phrase-devtools
		class="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-2"
	>
		<Button
			type="OUTLINED"
			variant="TEXT"
			class="pointer-events-auto !h-8 !px-3 !text-xs shadow-sm"
			onClick={() => {
				open = !open;
			}}
		>
			{open ? 'Hide explain devtools' : 'Explain devtools'}
		</Button>

		{#if open}
			<div
				class={cn(
					'pointer-events-auto overlay-surface w-[min(320px,calc(100vw-2rem))] rounded-[10px] border border-line p-3 shadow-lg',
					'flex flex-col gap-3'
				)}
			>
				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Form presets</p>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each formPresets as preset (preset.label)}
							<Button
								type="OUTLINED"
								variant="TEXT"
								class="!h-8 !px-2 !text-xs"
								onClick={() => onApplySeed(preset.seed)}
							>
								{preset.label}
							</Button>
						{/each}
					</div>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">API</p>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each actionPresets as preset (preset.label)}
							<Button type="OUTLINED" variant="TEXT" class="!h-8 !px-2 !text-xs" onClick={preset.action}>
								{preset.label}
							</Button>
						{/each}
					</div>
				</div>

				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Follow-ups</p>
					<p class="mt-1 text-xs text-ink-subtle">
						Calls the follow-up endpoint; run explain first so there is a previous answer.
					</p>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each followUpPresets as preset (preset.action)}
							<Button
								type="OUTLINED"
								variant="TEXT"
								class="!h-auto !min-h-8 !px-2 !py-1 !text-xs"
								onClick={() => onFollowUp(preset.action)}
							>
								{preset.label}
							</Button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
