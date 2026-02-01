<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

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

	let maskStyle = $state('');

	const FADE_HEIGHT = 40; // Height of the fade effect in pixels
	const TOP_OFFSET = 150; // Offset from top before top fade appears

	function updateMask() {
		if (!scrollContainer) return;

		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		const isAtTop = scrollTop <= 1;
		const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
		const hasScroll = scrollHeight > clientHeight;
		const isWithinTopOffset = scrollTop < TOP_OFFSET;

		// Don't apply mask if content doesn't scroll
		if (!hasScroll) {
			maskStyle = '';
			return;
		}

		let gradient: string;

		// When at the very top, fade the bottom only
		if (isAtTop) {
			gradient = `linear-gradient(to bottom, black 0, black calc(100% - ${FADE_HEIGHT}px), transparent 100%)`;
		}
		// When at the very bottom, fade the top only
		else if (isAtBottom) {
			gradient = `linear-gradient(to bottom, transparent 0, black ${FADE_HEIGHT}px, black 100%)`;
		}
		// When within top offset (0-150px), only fade bottom
		else if (isWithinTopOffset) {
			gradient = `linear-gradient(to bottom, black 0, black calc(100% - ${FADE_HEIGHT}px), transparent 100%)`;
		}
		// When scrolling past top offset, fade both top and bottom using a single gradient
		else {
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

	onMount(() => {
		updateMask();
	});
</script>

<div
	bind:this={scrollContainer}
	onscroll={handleScroll}
	class={cn(
		'flex-1 overflow-y-auto flex flex-col gap-16 px-4 py-8 relative', //
		wrapperClass
	)}
	style={maskStyle}
>
	<div
		class={cn(
			'flex flex-col gap-16 w-full h-full', //
			'absolute top-0 left-1/2 -translate-x-1/2',
			contentClass
		)}
	>
		{@render children()}
	</div>
</div>
