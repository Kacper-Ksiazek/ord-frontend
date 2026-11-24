<script lang="ts">
	import { Sparkles } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { Input } from '$lib/components/forms/input';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import * as m from '$lib/paraglide/messages.js';
	import {
		EXPLAIN_CONTEXT_MAX,
		EXPLAIN_INSTRUCTION_MAX,
		EXPLAIN_PHRASE_MAX,
		type ExplainPhraseFlow
	} from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import type { ExplainPanelTestIds } from '$aiExplainer/testing/test-ids';
	import { ExplainPhraseLanguageFlag } from '../explain-phrase-language-flag';

	interface Props {
		flow: ExplainPhraseFlow;
		testIds: ExplainPanelTestIds;
	}

	let { flow, testIds }: Props = $props();

	const LANGUAGE_OPTIONS: DropdownSelectOption<LanguageName>[] = [
		{ value: 'ENGLISH', label: 'English' },
		{ value: 'POLISH', label: 'Polish' },
		{ value: 'GERMAN', label: 'German' },
		{ value: 'FRENCH', label: 'French' },
		{ value: 'SPANISH', label: 'Spanish' },
		{ value: 'ITALIAN', label: 'Italian' },
		{ value: 'NORWEGIAN', label: 'Norwegian' },
		{ value: 'RUSSIAN', label: 'Russian' },
		{ value: 'SLOVENIAN', label: 'Slovenian' }
	];
</script>

{#snippet phraseLanguageOptionLeading(option: DropdownSelectOption<LanguageName>)}
	<ExplainPhraseLanguageFlag language={option.value} />
{/snippet}

<form class="flex flex-col gap-3" onsubmit={flow.handleExplainSubmit}>
	<div class="flex flex-col gap-3 sm:flex-row">
		<div class="min-w-0 flex-1 space-y-2">
			<p class="text-sm font-medium text-ink">
				{m['features.ai-explainer.explain-popover.phrase_label']()}
			</p>
			<Input
				dataTestId={testIds.phrase}
				ariaLabel={m['features.ai-explainer.explain-popover.phrase_label']()}
				bind:value={flow.phrase}
				maxLength={EXPLAIN_PHRASE_MAX}
				placeholder={m['features.ai-explainer.explain-popover.phrase_placeholder']()}
				disabled={flow.isStreaming}
			/>
		</div>

		<div class="w-full shrink-0 space-y-2 sm:w-[200px]">
			<p class="text-sm font-medium text-ink">
				{m['features.ai-explainer.explain-popover.language_label']()}
			</p>
			<DropdownSelect
				value={flow.language}
				options={LANGUAGE_OPTIONS}
				ariaLabel={m['features.ai-explainer.explain-popover.language_aria']()}
				optionLeading={phraseLanguageOptionLeading}
				onValueChange={(next) => {
					flow.language = next;
				}}
			/>
		</div>
	</div>

	<div class="space-y-2">
		<p class="text-sm font-medium text-ink">
			{m['features.ai-explainer.explain-popover.context_label']()}
		</p>
		<AutoHeightTextarea
			dataTestId={testIds.context}
			bind:value={flow.context}
			maxLength={EXPLAIN_CONTEXT_MAX}
			formField
			minRows={3}
			maxRows={6}
			placeholder={m['features.ai-explainer.explain-popover.context_placeholder']()}
			disabled={flow.isStreaming}
		/>
	</div>

	<div class="space-y-2">
		<p class="text-sm font-medium text-ink">
			{m['features.ai-explainer.explain-popover.instruction_label']()}
		</p>
		<AutoHeightTextarea
			dataTestId={testIds.customInstruction}
			bind:value={flow.customInstruction}
			maxLength={EXPLAIN_INSTRUCTION_MAX}
			formField
			placeholder={m['features.ai-explainer.explain-popover.instruction_placeholder']()}
			disabled={flow.isStreaming}
		/>
	</div>

	<div class="flex flex-wrap items-center justify-end gap-2 pt-1">
		<Button type="OUTLINED" variant="TEXT" disabled={flow.isStreaming} onClick={flow.handleReset}>
			{m['features.ai-explainer.explain-popover.reset']()}
		</Button>
		<Button
			type="FILLED"
			variant="PRIMARY"
			class="min-w-24"
			dataTestId={testIds.submit}
			disabled={!flow.canExplain}
			onClick={flow.handleExplain}
		>
			<Sparkles class="size-4" aria-hidden="true" />
			{flow.isStreaming
				? m['features.ai-explainer.explain-popover.explaining']()
				: m['features.ai-explainer.explain-popover.explain']()}
		</Button>
	</div>
</form>
