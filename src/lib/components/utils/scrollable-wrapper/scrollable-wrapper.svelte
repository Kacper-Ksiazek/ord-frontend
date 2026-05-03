<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		wrapperClass?: string;
		contentClass?: string;
		scrollContainer?: HTMLDivElement;
		children: Snippet;
	}

	let {
		wrapperClass = '',
		contentClass = '',
		children,
		scrollContainer = $bindable()
	}: Props = $props();

	let innerEl = $state<HTMLDivElement | undefined>(undefined);

	let maskStyle = $state('');

	const FADE_HEIGHT = 40;
	const TOP_OFFSET = 150;

	function updateMask() {
		if (!scrollContainer) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		const isAtTop = scrollTop <= 1;
		const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
		const hasScroll = scrollHeight > clientHeight;
		const isWithinTopOffset = scrollTop < TOP_OFFSET;

		if (!hasScroll) {
			maskStyle = '';

			return;
		}

		let gradient: string;

		if (isAtTop) {
			gradient = `linear-gradient(to bottom, black 0, black calc(100% - ${FADE_HEIGHT}px), transparent 100%)`;
		} else if (isAtBottom) {
			gradient = `linear-gradient(to bottom, transparent 0, black ${FADE_HEIGHT}px, black 100%)`;
		} else if (isWithinTopOffset) {
			gradient = `linear-gradient(to bottom, black 0, black calc(100% - ${FADE_HEIGHT}px), transparent 100%)`;
		} else {
			gradient = `linear-gradient(to bottom, transparent 0, black ${FADE_HEIGHT}px, black calc(100% - ${FADE_HEIGHT}px), transparent 100%)`;
		}

		maskStyle = `
			mask-image: ${gradient};
			-webkit-mask-image: ${gradient};
			mask-size: 100% 100%;
			-webkit-mask-size: 100% 100%;
			mask-repeat: no-repeat;
			-webkit-mask-repeat: no-repeat;
		`.trim();
	}

	function handleScroll() {
		updateMask();
	}

	$effect(() => {
		if (!scrollContainer || !innerEl) return;

		const schedule = () => globalThis.queueMicrotask(updateMask);

		schedule();

		const ro = new globalThis.ResizeObserver(schedule);
		ro.observe(scrollContainer);
		ro.observe(innerEl);

		return () => ro.disconnect();
	});
</script>

<div
	bind:this={scrollContainer}
	onscroll={handleScroll}
	class={cn(
		'relative flex h-full max-h-full min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden',
		wrapperClass
	)}
	style={maskStyle}
>
	<div bind:this={innerEl} class={cn('flex min-h-min flex-col', contentClass)}>
		{@render children()}
	</div>
</div>
