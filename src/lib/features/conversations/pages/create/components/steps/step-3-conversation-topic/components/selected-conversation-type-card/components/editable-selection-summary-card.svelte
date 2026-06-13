<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Modal } from 'flowbite-svelte';
	import { Pencil } from 'lucide-svelte';
	import { Button } from '$lib/components/actions/button';
	import { IconButton } from '$lib/components/actions/icon-button';
	import * as m from '$lib/paraglide/messages.js';

	const summaryIconClass = 'size-12 text-primary-500 dark:text-primary-400';

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
		class="flex-1 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20"
	>
		<div class="flex items-start justify-between gap-3">
			<div class="flex min-w-0 flex-1 items-center gap-4">
				{@render icon(summaryIconClass)}

				<div class="min-w-0">
					<p class="text-xs text-gray-500 dark:text-gray-400">{label}</p>
					<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h3>
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

	<Modal bind:open={modalOpen} title={modalTitle} size="xl">
		{#snippet footer()}
			<div class="flex w-full justify-end">
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
		{/snippet}
		{@render modalBody()}
	</Modal>
</div>
