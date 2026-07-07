<script lang="ts">
	import Challenging from '$lib/assets/images/conversation/tones/challenging.svg.svelte';
	import Encouraging from '$lib/assets/images/conversation/tones/encouraging.svg.svelte';
	import Formal from '$lib/assets/images/conversation/tones/formal.svg.svelte';
	import Friendly from '$lib/assets/images/conversation/tones/friendly.svg.svelte';
	import Humorous from '$lib/assets/images/conversation/tones/humorous.svg.svelte';
	import Neutral from '$lib/assets/images/conversation/tones/neutral.svg.svelte';
	import type { SVGIconProps } from '$lib/assets/images/types';
	import type { ConversationAITone } from '$conversations/types/domain/conversation';

	interface ConversationToneProps extends SVGIconProps {
		tone: ConversationAITone;
	}

	const { tone, ...restProps }: ConversationToneProps = $props();
</script>

{#if tone === 'FRIENDLY'}
	<Friendly {...restProps} />
{:else if tone === 'FORMAL'}
	<Formal {...restProps} />
{:else if tone === 'HUMOROUS'}
	<Humorous {...restProps} />
{:else if tone === 'NEUTRAL'}
	<Neutral {...restProps} />
{:else if tone === 'ENCOURAGING'}
	<Encouraging {...restProps} />
{:else if tone === 'CHALLENGING'}
	<Challenging {...restProps} />
{/if}
