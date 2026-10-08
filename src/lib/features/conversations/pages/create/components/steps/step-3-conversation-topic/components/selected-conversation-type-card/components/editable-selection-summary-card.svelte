<script lang="ts">
	import type { Snippet } from 'svelte';
	import { DropdownMenu } from 'bits-ui';
	import { Pencil } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	const summaryIconClass = 'size-[clamp(2rem,5vh,3rem)] text-primary-500 dark:text-primary-400';

	interface Props {
		label: string;
		title: string;
		icon: Snippet<[className: string]>;
		editAriaLabel: string;
		editTooltip: string;
		dropdownContent: Snippet;
	}

	let { label, title, icon, editAriaLabel, editTooltip, dropdownContent }: Props = $props();
</script>

<div class="flex min-w-0 flex-1 flex-col">
	<div
		class="flex-1 rounded-lg border border-primary-200 bg-primary-50 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.75rem,2vh,1rem)] dark:border-primary-800 dark:bg-primary-900/20"
	>
		<div class="flex items-start justify-between gap-2">
			<div class="flex min-w-0 flex-1 items-center gap-3">
				{@render icon(summaryIconClass)}

				<div class="min-w-0">
					<p class="text-xs text-gray-500 dark:text-gray-400">{label}</p>
					<h3 class="truncate text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
						{title}
					</h3>
				</div>
			</div>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger
					class={cn(
						'inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] border border-line bg-transparent p-0',
						'cursor-pointer hover:bg-accent-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas'
					)}
					aria-label={editAriaLabel}
					title={editTooltip}
				>
					<Pencil class="size-4 text-ink" aria-hidden="true" />
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						class="overlay-surface z-50 mt-1 max-h-[min(24rem,70vh)] w-72 overflow-y-auto p-1"
						align="end"
						sideOffset={8}
					>
						{@render dropdownContent()}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		</div>
	</div>
</div>
