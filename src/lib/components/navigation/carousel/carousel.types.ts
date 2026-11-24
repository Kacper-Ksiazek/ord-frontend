import type { Snippet } from 'svelte';

export interface CarouselProps<T> {
	items: T[];
	/** Stable key per item for the keyed each block. */
	getKey: (item: T, index: number) => string;
	/** Renders one slide. */
	slide: Snippet<[T, number]>;
	/** Accessible name of the carousel region. */
	ariaLabel: string;
	previousLabel: string;
	nextLabel: string;
	/** Optional content shown on the left of the prev/next controls (e.g. a section heading). */
	header?: Snippet;
	class?: string;
	dataTestId?: string;
}
