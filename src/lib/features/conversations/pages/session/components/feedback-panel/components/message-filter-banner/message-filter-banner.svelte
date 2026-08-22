<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { X } from 'lucide-svelte';
	import {
		clearSummaryMessageFilter,
		getSidepanelContext
	} from '$conversations/pages/session/contexts/sidepanel-context.svelte';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';

	const sidepanelContext = getSidepanelContext();
	const messagesContext = getMessagesContext();

	const filterIndex = $derived(sidepanelContext.filterMessageOrder);

	const filteredPreview = $derived.by(() => {
		if (filterIndex == null) {
			return null;
		}

		const message = messagesContext.messages[filterIndex];

		if (!message) {
			return null;
		}

		const label = message.sender === 'USER' ? 'Twoja wiadomość' : 'Odpowiedź AI';
		const preview =
			message.content.length > 72 ? `${message.content.slice(0, 72)}…` : message.content;

		return { label, preview };
	});
</script>

{#if filterIndex != null && filteredPreview}
	<div
		class="mb-4 flex items-start gap-3 rounded-[10px] border border-line-subtle bg-accent-soft/40 px-3 py-2.5"
		role="status"
	>
		<div class="min-w-0 flex-1">
			<p class="text-xs font-medium text-ink-muted">Filtr: {filteredPreview.label}</p>
			<p class="text-sm text-ink">{filteredPreview.preview}</p>
		</div>

		<Button
			type="OUTLINED"
			variant="TEXT"
			ariaLabel="Wyczyść filtr wiadomości"
			onClick={() => clearSummaryMessageFilter(sidepanelContext)}
			class="h-8! min-h-8 shrink-0 border-none px-2 hover:bg-accent-soft"
		>
			<X class="size-4" />
		</Button>
	</div>
{/if}
