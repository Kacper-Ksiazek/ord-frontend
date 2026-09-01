<script lang="ts">
	import { Dialog, DropdownMenu } from 'bits-ui';
	import { MoreHorizontal, Pencil, Trash2 } from 'lucide-svelte';
	import { createDeleteConversationMutation } from '$conversations/api-client';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import { Alert } from '$lib/components/utils/alert';
	import { Button } from '$lib/components/buttons/button';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		conversationId: string;
	}

	let { conversationId }: Props = $props();

	const deleteMutation = createDeleteConversationMutation();

	let confirmOpen = $state(false);
	let deleteError = $state<string | null>(null);

	const isDeleting = $derived(
		deleteMutation.isPending && deleteMutation.variables === conversationId
	);

	function openDeleteConfirm() {
		deleteError = null;
		confirmOpen = true;
	}

	function handleConfirmDelete() {
		confirmOpen = false;
		deleteError = null;

		deleteMutation.mutate(conversationId, {
			onError: () => {
				deleteError = m['features.conversation.list.row_actions.delete_error']();
			}
		});
	}
</script>

<div class="flex flex-col items-end gap-1">
	{#if deleteError}
		<Alert class="max-w-xs text-left">{deleteError}</Alert>
	{/if}

	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			data-testid={E2E_TEST_IDS.conversations.rowMenu(conversationId)}
			aria-label={m['features.conversation.list.row_actions.menu_aria']()}
			class={cn(
				'flex size-8 shrink-0 items-center justify-center rounded-[10px] text-ink-subtle transition-colors',
				'hover:bg-accent-soft hover:text-ink',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
				isDeleting && 'cursor-wait opacity-50'
			)}
			disabled={isDeleting}
			onclick={(event) => event.stopPropagation()}
		>
			<MoreHorizontal class="size-4" aria-hidden="true" />
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content class="overlay-surface z-50 w-44 p-1" align="end" sideOffset={4}>
				<DropdownMenu.Item
					disabled
					class={cn(
						'flex w-full cursor-not-allowed items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-subtle opacity-50',
						'outline-none'
					)}
				>
					<Pencil class="size-4 shrink-0" aria-hidden="true" />
					{m['features.conversation.list.row_actions.edit']()}
				</DropdownMenu.Item>

				<DropdownMenu.Item
					disabled={isDeleting}
					onSelect={(event) => {
						event.preventDefault();
						openDeleteConfirm();
					}}
					class={cn(
						'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-danger',
						'outline-none hover:bg-accent-soft',
						isDeleting && 'cursor-wait opacity-50'
					)}
				>
					<Trash2 class="size-4 shrink-0" aria-hidden="true" />
					{m['features.conversation.list.row_actions.delete']()}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>

<Dialog.Root bind:open={confirmOpen}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-ink/40" />
		<Dialog.Content
			class="overlay-surface fixed top-1/2 left-1/2 z-50 w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 p-6"
		>
			<Dialog.Title class="text-lg font-medium text-ink">
				{m['features.conversation.list.row_actions.delete_confirm.title']()}
			</Dialog.Title>
			<Dialog.Description class="mt-2 text-sm text-ink-muted">
				{m['features.conversation.list.row_actions.delete_confirm.description']()}
			</Dialog.Description>

			<div class="mt-6 flex justify-end gap-2">
				<Button type="OUTLINED" variant="TEXT" onClick={() => (confirmOpen = false)}>
					{m['features.conversation.list.row_actions.delete_confirm.cancel']()}
				</Button>
				<Button type="FILLED" variant="PRIMARY" onClick={handleConfirmDelete}>
					{m['features.conversation.list.row_actions.delete_confirm.confirm']()}
				</Button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
