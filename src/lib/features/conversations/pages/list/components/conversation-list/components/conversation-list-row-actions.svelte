<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { MoreHorizontal, Pencil, Trash2 } from 'lucide-svelte';
	import { createDeleteConversationMutation } from '$conversations/api-client';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		conversationId: string;
	}

	let { conversationId }: Props = $props();

	const deleteMutation = createDeleteConversationMutation();

	const isDeleting = $derived(
		deleteMutation.isPending && deleteMutation.variables === conversationId
	);

	function handleDelete() {
		deleteMutation.mutate(conversationId);
	}
</script>

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
				onSelect={handleDelete}
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
