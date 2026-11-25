<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { ArrowDownToLine, MoreHorizontal, Trash2 } from 'lucide-svelte';
	import { E2E_TEST_IDS } from '$aiExplainer/testing/test-ids';
	import type { SavedExplanation } from '$aiExplainer/types';
	import { cn } from '$lib/utils/cn';
	import { formatRelativeOrMediumDate } from '$lib/utils/format-relative-or-medium-date';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		items: SavedExplanation[];
		onSelect: (item: SavedExplanation) => void;
		onRemove: (ids: string[]) => void;
	}

	let { items, onSelect, onRemove }: Props = $props();

	const menuItemClass =
		'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink outline-none hover:bg-accent-soft data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50';
</script>

{#if items.length > 0}
	<section class="flex flex-col gap-2" data-testid={E2E_TEST_IDS.explainPage.history}>
		<ul class="flex flex-col gap-2">
			{#each items as item, index (item.id)}
				<li
					class="group flex items-center gap-1 rounded-[10px] border border-line bg-surface pr-2 transition-colors hover:border-ink/30 hover:bg-accent-soft"
				>
					<button
						type="button"
						class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-[10px] py-3.5 pr-2 pl-5 text-left focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:outline-none"
						data-testid={E2E_TEST_IDS.explainPage.historyItem(item.id)}
						onclick={() => onSelect(item)}
					>
						<!-- Emoji gets its own column so the text lines up across rows, with or without one. -->
						<span
							class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-xl leading-none"
							aria-hidden="true"
						>
							{item.emoji ?? ''}
						</span>
						<span class="flex min-w-0 flex-1 flex-col items-start gap-1">
							<span class="text-xs text-ink-subtle">
								{formatRelativeOrMediumDate(item.createdAt)}
							</span>
							<span class="w-full min-w-0 text-ink">{item.phrase}</span>
						</span>
					</button>

					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							aria-label={m['features.ai-explainer.explain-popover.history_menu_aria']()}
							data-testid={E2E_TEST_IDS.explainPage.historyMenu(item.id)}
							class={cn(
								'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-control text-ink-subtle transition-colors',
								'hover:bg-surface hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:outline-none'
							)}
						>
							<MoreHorizontal class="size-4" aria-hidden="true" />
						</DropdownMenu.Trigger>

						<DropdownMenu.Portal>
							<DropdownMenu.Content class="overlay-surface z-50 w-48 p-1" align="end" sideOffset={4}>
								<DropdownMenu.Item
									class={menuItemClass}
									onSelect={() => onRemove([item.id])}
									data-testid={E2E_TEST_IDS.explainPage.historyRemove(item.id)}
								>
									<Trash2 class="size-4 shrink-0" aria-hidden="true" />
									{m['features.ai-explainer.explain-popover.history_remove']()}
								</DropdownMenu.Item>
								<DropdownMenu.Item
									class={menuItemClass}
									disabled={index === items.length - 1}
									onSelect={() => onRemove(items.slice(index + 1).map((below) => below.id))}
									data-testid={E2E_TEST_IDS.explainPage.historyRemoveBelow(item.id)}
								>
									<ArrowDownToLine class="size-4 shrink-0" aria-hidden="true" />
									{m['features.ai-explainer.explain-popover.history_remove_below']()}
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Portal>
					</DropdownMenu.Root>
				</li>
			{/each}
		</ul>
	</section>
{/if}
