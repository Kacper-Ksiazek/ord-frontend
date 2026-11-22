<script lang="ts">
	import { parseEmphasisText } from '$lib/utils/text/parse-emphasis-text';

	interface Props {
		content: string;
	}

	let { content }: Props = $props();
</script>

{#each parseEmphasisText(content) as part, index (index)}
	{#if part.emphasized}
		<!-- Marker-pen underline instead of a solid block, so emphasis does not chop up the paragraph. -->
		<span
			class="bg-[linear-gradient(to_bottom,transparent_58%,color-mix(in_srgb,var(--color-highlight)_90%,transparent)_58%)] font-medium text-ink"
			>{part.text}</span
		>
	{:else}
		{part.text}
	{/if}
{/each}
