<script lang="ts" generics="T">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { cn } from '$lib/utils/cn';
	import type { CarouselProps } from './carousel.types';

	let {
		items,
		getKey,
		slide,
		ariaLabel,
		previousLabel,
		nextLabel,
		header,
		class: className,
		dataTestId
	}: CarouselProps<T> = $props();

	/** Absorbs sub-pixel and snap-padding offsets so the edge buttons disable reliably. */
	const SCROLL_EDGE_TOLERANCE_PX = 8;

	let trackEl = $state<HTMLDivElement | null>(null);
	let canScrollPrevious = $state(false);
	let canScrollNext = $state(false);

	const showControls = $derived(canScrollPrevious || canScrollNext);

	function syncScrollState() {
		if (!trackEl) {
			return;
		}

		const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;

		canScrollPrevious = trackEl.scrollLeft > SCROLL_EDGE_TOLERANCE_PX;
		canScrollNext = trackEl.scrollLeft < maxScroll - SCROLL_EDGE_TOLERANCE_PX;
	}

	function scrollByPage(direction: -1 | 1) {
		trackEl?.scrollBy({ left: direction * trackEl.clientWidth, behavior: 'smooth' });
	}

	$effect(() => {
		if (!trackEl) {
			return;
		}

		void items.length;
		syncScrollState();

		const observer = new window.ResizeObserver(syncScrollState);

		observer.observe(trackEl);

		return () => observer.disconnect();
	});
</script>

<section
	class={cn('flex min-w-0 flex-col gap-3', className)}
	aria-roledescription="carousel"
	aria-label={ariaLabel}
	data-testid={dataTestId}
>
	{#if header || showControls}
		<div class="flex items-end justify-between gap-3">
			<div class="min-w-0 flex-1">
				{@render header?.()}
			</div>
			{#if showControls}
				<div class="flex shrink-0 items-center gap-1">
					<IconButton
						icon={ChevronLeft}
						ariaLabel={previousLabel}
						tooltip={previousLabel}
						type="OUTLINED"
						variant="TEXT"
						disabled={!canScrollPrevious}
						class="size-9"
						onClick={() => scrollByPage(-1)}
					/>
					<IconButton
						icon={ChevronRight}
						ariaLabel={nextLabel}
						tooltip={nextLabel}
						type="OUTLINED"
						variant="TEXT"
						disabled={!canScrollNext}
						class="size-9"
						onClick={() => scrollByPage(1)}
					/>
				</div>
			{/if}
		</div>
	{/if}

	<div
		bind:this={trackEl}
		class="-mx-1 flex snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		onscroll={syncScrollState}
	>
		{#each items as item, index (getKey(item, index))}
			<div
				class="flex shrink-0 basis-full snap-start sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
				role="group"
				aria-roledescription="slide"
				aria-label={`${index + 1} / ${items.length}`}
			>
				<div class="flex w-full min-w-0">
					{@render slide(item, index)}
				</div>
			</div>
		{/each}
	</div>
</section>
