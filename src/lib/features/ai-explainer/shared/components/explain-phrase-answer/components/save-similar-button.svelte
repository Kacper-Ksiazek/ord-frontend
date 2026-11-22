<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { BookPlus, Check } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Spinner } from '$lib/components/utils/spinner';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import type { ExplainPhraseFlow } from '$aiExplainer/shared/services/use-explain-phrase-flow.svelte';
	import type { SimilarExpression } from '$aiExplainer/shared/utils/parse-explainer-follow-up';

	interface Props {
		flow: ExplainPhraseFlow;
		item: SimilarExpression;
	}

	let { flow, item }: Props = $props();

	const key = $derived(flow.similarExpressionKey(item));
	const isSaving = $derived(flow.savingSimilarKey === key);
	const isDefined = $derived(flow.definedSourceWords.includes(key));
	const saveLabel = $derived(
		m['features.ai-explainer.explain-popover.save_similar']({ word: item.phrase })
	);
	const savedLabel = $derived(
		m['features.ai-explainer.explain-popover.save_similar_saved']({ word: item.phrase })
	);
</script>

{#if isSaving}
	<span class="flex size-8 shrink-0 items-center justify-center" aria-label={saveLabel}>
		<Spinner class="size-4 text-ink" />
	</span>
{:else if !flow.definedLookupReady}
	<span class="size-8 shrink-0" aria-hidden="true"></span>
{:else if isDefined}
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props: triggerProps })}
				<span
					{...triggerProps}
					class={cn(
						'flex size-8 shrink-0 items-center justify-center text-ink-muted',
						triggerProps.class
					)}
					aria-label={savedLabel}
				>
					<Check class="size-4" aria-hidden="true" />
				</span>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content class="overlay-surface z-50 px-2 py-1 text-xs" sideOffset={6}>
				{savedLabel}
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
{:else}
	<IconButton
		icon={BookPlus}
		ariaLabel={saveLabel}
		tooltip={saveLabel}
		type="OUTLINED"
		variant="TEXT"
		disabled={flow.savingSimilarKey !== null}
		class="size-8 shrink-0 border-none text-ink-muted hover:bg-accent-soft hover:text-ink disabled:opacity-60"
		iconClass="size-4"
		onClick={() => {
			void flow.saveSimilarExpression(item);
		}}
	/>
{/if}
