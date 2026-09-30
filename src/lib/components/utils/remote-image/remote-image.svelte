<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		src: string;
		alt?: string;
		class?: string;
		style?: string;
		width?: number;
		height?: number;
		loading?: 'eager' | 'lazy';
		decoding?: 'async' | 'auto' | 'sync';
	}

	let {
		src,
		alt = '',
		class: className = '',
		style,
		width,
		height,
		loading = 'eager',
		decoding = 'async'
	}: Props = $props();

	let loadedSrc = $state<string | null>(null);
	let failedSrc = $state<string | null>(null);

	const isLoaded = $derived(loadedSrc === src);
	const isFailed = $derived(!isLoaded && failedSrc === src);
	const isLoading = $derived(!isLoaded && !isFailed);
	const isDecorative = $derived(alt === '');

	function settle(image: HTMLImageElement, expectedSrc: string) {
		if (image.getAttribute('src') !== expectedSrc) return;

		if (image.naturalWidth > 0) {
			loadedSrc = expectedSrc;

			return;
		}

		failedSrc = expectedSrc;
	}

	const trackLoad: Attachment<HTMLImageElement> = (image) => {
		const expectedSrc = src;

		const onLoad = () => settle(image, expectedSrc);
		const onError = () => {
			if (image.getAttribute('src') !== expectedSrc) return;
			failedSrc = expectedSrc;
		};

		image.addEventListener('load', onLoad);
		image.addEventListener('error', onError);

		if (image.complete) {
			if (image.naturalWidth > 0) onLoad();
			else onError();
		}

		return () => {
			image.removeEventListener('load', onLoad);
			image.removeEventListener('error', onError);
		};
	};
</script>

<span
	class={cn('relative inline-block overflow-hidden', className)}
	{style}
	aria-hidden={isDecorative ? 'true' : undefined}
	aria-busy={isLoading ? 'true' : undefined}
>
	{#if isLoading}
		<Skeleton class="absolute inset-0 rounded-[inherit]" />
	{:else if isFailed}
		<span class="absolute inset-0 bg-gray-200 dark:bg-gray-800"></span>
	{/if}

	{#key src}
		<img
			{src}
			alt={isLoaded ? alt : ''}
			{width}
			{height}
			{loading}
			{decoding}
			class={cn('size-full object-cover object-center', !isLoaded && 'invisible')}
			{@attach trackLoad}
		/>
	{/key}
</span>
