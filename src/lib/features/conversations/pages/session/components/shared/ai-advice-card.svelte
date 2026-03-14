<script lang="ts">
	import './ai-advice-card.css';
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { cn } from 'flowbite-svelte';

	interface Props {
		cardBg: string;
		cardBorder: string;
		header: Snippet;
		children: Snippet;
	}

	let { cardBg, cardBorder, header, children }: Props = $props();

	let isCollapsed = $state(false);
</script>

<div
	class={cn('feedback-card-container cursor-pointer', cardBg, cardBorder)}
	onclick={() => (isCollapsed = !isCollapsed)}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && (isCollapsed = !isCollapsed)}
>
	<div class="feedback-card-header">
		{@render header()}
	</div>

	{#if !isCollapsed}
		<div transition:slide={{ duration: 150 }}>
			{@render children()}
		</div>
	{/if}
</div>
