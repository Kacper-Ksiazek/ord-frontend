<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import * as m from '$lib/paraglide/messages.js';
	import { TriangleAlert } from 'lucide-svelte';

	interface Props {
		itemId: string;
	}

	let { itemId }: Props = $props();

	const ariaLabel = m['features.words.inbox.unconfirmed_badge']();
	const tooltip = m['features.words.inbox.unconfirmed_tooltip']();
</script>

<Tooltip.Root>
	<Tooltip.Trigger
		type="button"
		id="captured-word-unconfirmed-{itemId}"
		class="inline-flex shrink-0 cursor-default bg-transparent opacity-80 transition-opacity hover:opacity-100"
		aria-label={ariaLabel}
	>
		<TriangleAlert class="size-5 text-danger" aria-hidden="true" />
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content class="overlay-surface z-50 px-2 py-1 text-xs" sideOffset={6}>
			{tooltip}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
