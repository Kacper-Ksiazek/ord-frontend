<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import { m } from '$lib/paraglide/messages.js';
	import { TriangleAlert } from 'lucide-svelte';

	interface Props {
		itemId: string;
	}

	let { itemId }: Props = $props();

	const triggerId = `qaw-unconfirmed-${itemId}`;
	const ariaLabel = m['features.quickly-added-words.list.unconfirmed_badge']();
	const tooltip = m['features.quickly-added-words.list.unconfirmed_tooltip']();
</script>

<span
	id={triggerId}
	class="inline-flex shrink-0 opacity-80 transition-opacity hover:opacity-100"
	tabindex="0"
	role="img"
	aria-label={ariaLabel}
>
	<TriangleAlert class="size-5 text-red-500 dark:text-red-400" aria-hidden="true" />
</span>

<Tooltip triggeredBy={`#${triggerId}`}>{tooltip}</Tooltip>
