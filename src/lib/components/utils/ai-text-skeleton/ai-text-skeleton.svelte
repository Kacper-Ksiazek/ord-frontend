<script lang="ts">
	import { Sparkles } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import type { AiTextSkeletonProps } from './ai-text-skeleton.types';

	let {
		lines = ['100%', '94%', '68%'],
		size = 'md',
		label,
		class: className,
		dataTestId
	}: AiTextSkeletonProps = $props();
</script>

<!--
	Placeholder for text the AI is still writing: thin rounded bars on the same rhythm as real
	text lines, with a slow, low-contrast shimmer so it reads as "being written", not "broken".
-->
<div
	class={cn('flex flex-col', className)}
	data-testid={dataTestId}
	role="status"
	aria-busy="true"
	aria-label={label}
>
	{#if label}
		<span class="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-ink-subtle">
			<Sparkles class="ai-text-skeleton-spark size-3.5" aria-hidden="true" />
			{label}
		</span>
	{/if}

	{#each lines as width, index (index)}
		<span class={cn('flex items-center', size === 'md' ? 'h-[1.7rem]' : 'h-6')} aria-hidden="true">
			<span
				class={cn('ai-text-skeleton-bar block rounded-full', size === 'md' ? 'h-2.5' : 'h-2')}
				style:width
				style:animation-delay={`${index * 120}ms`}
			></span>
		</span>
	{/each}
</div>

<style>
	.ai-text-skeleton-bar {
		background: linear-gradient(
			90deg,
			var(--color-line-subtle) 0%,
			color-mix(in srgb, var(--color-highlight) 45%, var(--color-line-subtle)) 45%,
			color-mix(in srgb, var(--color-primary-200) 35%, var(--color-line-subtle)) 55%,
			var(--color-line-subtle) 100%
		);
		background-size: 250% 100%;
		animation: ai-text-skeleton-shimmer 2.4s ease-in-out infinite;
	}

	:global(.ai-text-skeleton-spark) {
		animation: ai-text-skeleton-spark 1.6s ease-in-out infinite;
	}

	@keyframes ai-text-skeleton-shimmer {
		0% {
			background-position: 100% 0;
		}

		100% {
			background-position: -150% 0;
		}
	}

	@keyframes ai-text-skeleton-spark {
		0%,
		100% {
			opacity: 0.45;
		}

		50% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ai-text-skeleton-bar,
		:global(.ai-text-skeleton-spark) {
			animation: none;
		}
	}
</style>
