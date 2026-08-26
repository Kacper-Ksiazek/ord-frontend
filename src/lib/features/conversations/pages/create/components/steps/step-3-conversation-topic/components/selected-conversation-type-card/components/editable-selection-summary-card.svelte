<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog } from 'bits-ui';
	import { Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/buttons/button';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import * as m from '$lib/paraglide/messages.js';

	const summaryIconClass = 'size-[clamp(2rem,5vh,3rem)] text-primary-500 dark:text-primary-400';

	interface Props {
		label: string;
		title: string;
		icon: Snippet<[className: string]>;
		editAriaLabel: string;
		editTooltip: string;
		modalTitle: string;
		modalBody: Snippet;
	}

	let { label, title, icon, editAriaLabel, editTooltip, modalTitle, modalBody }: Props = $props();

	let modalOpen = $state(false);
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

			<IconButton
				icon={Pencil}
				ariaLabel={editAriaLabel}
				tooltip={editTooltip}
				type="OUTLINED"
				variant="TEXT"
				class="size-8 shrink-0"
				onClick={(e) => {
					e.stopPropagation();
					modalOpen = true;
				}}
			/>
		</div>
	</div>

	<Dialog.Root bind:open={modalOpen}>
		<Dialog.Portal>
			<Dialog.Overlay class="fixed inset-0 z-50 bg-ink/40" />
			<Dialog.Content
				class="overlay-surface fixed top-1/2 left-1/2 z-50 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 p-6"
			>
				<Dialog.Title class="text-lg font-medium text-ink">{modalTitle}</Dialog.Title>
				<div class="mt-4">
					{@render modalBody()}
				</div>
				<div class="mt-6 flex w-full justify-end">
					<Button
						type="FILLED"
						variant="PRIMARY"
						class="min-w-48"
						onClick={() => {
							modalOpen = false;
						}}
					>
						{m['features.conversation.create.step-3.summary_cards.done_button']()}
					</Button>
				</div>
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
</div>
