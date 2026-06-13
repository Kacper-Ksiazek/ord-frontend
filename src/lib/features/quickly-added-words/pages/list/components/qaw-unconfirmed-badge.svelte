<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { TriangleAlert } from 'lucide-svelte';

	interface Props {
		itemId: string;
	}

	let { itemId }: Props = $props();

	const triggerId = `qaw-unconfirmed-${itemId}`;
	const ariaLabel = m['features.quickly-added-words.list.unconfirmed_badge']();
	const tooltip = m['features.quickly-added-words.list.unconfirmed_tooltip']();
</script>

<button
	type="button"
	id={triggerId}
	class="inline-flex shrink-0 cursor-default opacity-80 transition-opacity hover:opacity-100"
	aria-label={ariaLabel}
>
	<TriangleAlert class="size-5 text-red-500 dark:text-red-400" aria-hidden="true" />
</button>

<Tooltip triggeredBy={`#${triggerId}`}>{tooltip}</Tooltip>
