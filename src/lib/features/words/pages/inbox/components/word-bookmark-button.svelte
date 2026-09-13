<script lang="ts">
	import { tick } from 'svelte';
	import { Heart } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		bookmarked: boolean;
		disabled?: boolean;
		ariaLabel: string;
		dataTestId?: string;
		onToggle: () => void;
	}

	let { bookmarked, disabled = false, ariaLabel, dataTestId, onToggle }: Props = $props();

	let isBouncing = $state(false);

	async function playBounce() {
		isBouncing = false;
		await tick();
		isBouncing = true;
	}

	function handleAnimationEnd(event: Event) {
		const animationName = (event as Event & { animationName?: string }).animationName ?? '';
		if (
			animationName === 'bookmark-heart-bounce' ||
			animationName.includes('bookmark-heart-bounce')
		) {
			isBouncing = false;
		}
	}

	function handleClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		if (disabled) {
			return;
		}

		void playBounce();
		onToggle();
	}
</script>

<button
	type="button"
	data-testid={dataTestId}
	class={cn(
		'inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] transition-colors',
		'hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
		bookmarked ? 'text-score-low hover:text-score-low' : 'text-ink-muted hover:text-ink',
		disabled && 'cursor-not-allowed opacity-50'
	)}
	aria-label={ariaLabel}
	aria-pressed={bookmarked}
	{disabled}
	onclick={handleClick}
>
	<span
		class={cn('relative grid size-4 place-items-center', isBouncing && 'heart-bounce')}
		onanimationend={handleAnimationEnd}
	>
		<span
			class={cn(
				'pointer-events-none absolute inset-0 rounded-full bg-score-low blur-[2.5px] transition-opacity duration-200',
				bookmarked ? 'opacity-25' : 'opacity-0'
			)}
			aria-hidden="true"
		></span>
		<Heart class={cn('relative size-4', bookmarked && 'fill-current')} aria-hidden="true" />
	</span>
</button>

<style>
	@keyframes bookmark-heart-bounce {
		0% {
			transform: scale(1);
		}

		35% {
			transform: scale(1.32);
		}

		60% {
			transform: scale(0.92);
		}

		80% {
			transform: scale(1.06);
		}

		100% {
			transform: scale(1);
		}
	}

	.heart-bounce {
		animation: bookmark-heart-bounce 0.42s cubic-bezier(0.34, 1.45, 0.64, 1);
	}

	@media (prefers-reduced-motion: reduce) {
		.heart-bounce {
			animation: none;
		}
	}
</style>
