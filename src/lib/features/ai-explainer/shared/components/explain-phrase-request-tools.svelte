<script lang="ts">
	import { Eraser, SlidersHorizontal } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import type { ExplainPhraseFlow } from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import type { ExplainPanelTestIds } from '$aiExplainer/testing/test-ids';

	interface Props {
		flow: ExplainPhraseFlow;
		testIds: ExplainPanelTestIds;
		/** The inline home block keeps only the quick composer, without advanced options. */
		showAdvancedToggle?: boolean;
		class?: string;
	}

	let { flow, testIds, showAdvancedToggle = true, class: className }: Props = $props();
</script>

<div class={cn('flex shrink-0 items-center gap-0.5', className)}>
	<IconButton
		icon={Eraser}
		ariaLabel={m['features.ai-explainer.explain-popover.reset']()}
		tooltip={m['features.ai-explainer.explain-popover.reset']()}
		type="OUTLINED"
		variant="TEXT"
		disabled={!flow.canClearPhrase}
		dataTestId={testIds.clearPhrase}
		class="h-8 w-8 shrink-0 border-none"
		onClick={() => {
			flow.handleReset();
		}}
	/>
	{#if showAdvancedToggle}
		<IconButton
			icon={SlidersHorizontal}
			ariaLabel={m['features.ai-explainer.explain-popover.advanced_options_label']()}
			tooltip={m['features.ai-explainer.explain-popover.advanced_options_label']()}
			dataTestId={testIds.advancedToggle}
			type="OUTLINED"
			variant="TEXT"
			disabled={flow.isStreaming}
			class={cn('h-8 w-8 shrink-0 border-none', flow.requestFormAdvanced && 'bg-accent-soft text-ink')}
			onClick={() => {
				flow.requestFormAdvanced = !flow.requestFormAdvanced;
			}}
		/>
	{/if}
</div>
