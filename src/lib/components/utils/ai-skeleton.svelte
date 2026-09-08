<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	const { class: customClass = '', children }: Props = $props();
</script>

<div class={cn('ai-skeleton h-full w-full rounded-md', customClass)}>
	{@render children?.()}
</div>

<style>
	.ai-skeleton {
		background: linear-gradient(
			100deg,
			color-mix(in srgb, var(--color-primary-200) 72%, var(--color-surface)) 0%,
			color-mix(in srgb, var(--color-primary-100) 88%, var(--color-surface)) 42%,
			color-mix(in srgb, var(--color-highlight) 55%, var(--color-surface)) 52%,
			color-mix(in srgb, var(--color-primary-100) 88%, var(--color-surface)) 62%,
			color-mix(in srgb, var(--color-primary-200) 72%, var(--color-surface)) 100%
		);
		background-size: 220% 100%;
		animation: ai-skeleton-shimmer 2s ease-in-out infinite;
	}

	@keyframes ai-skeleton-shimmer {
		0% {
			background-position: 100% 0;
		}

		100% {
			background-position: -100% 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ai-skeleton {
			animation: none;
			background: color-mix(in srgb, var(--color-primary-200) 55%, var(--color-surface));
		}
	}
</style>
