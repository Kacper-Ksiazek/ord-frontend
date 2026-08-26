<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import {
		ORD_LOGO_BLOB_PATHS,
		ORD_LOGO_BLOB_STAGGER,
		ORD_LOGO_BLOB_START,
		ORD_LOGO_CX,
		ORD_LOGO_CY,
		ORD_LOGO_INNER_FIBERS,
		ORD_LOGO_INNER_PATH,
		ORD_LOGO_INNER_SETTLE,
		ORD_LOGO_LETTER_DELAY,
		ORD_LOGO_LETTER_STAGGER,
		ORD_LOGO_OUTER_FIBERS,
		ORD_LOGO_OUTER_PATH,
		ORD_LOGO_OUTER_SETTLE,
		ordLogoArcPath,
		type OrdLogoTimedLayer
	} from './ord-logo.constants';
	import type { OrdLogoProps } from './ord-logo.types';

	let {
		size = 'md',
		animate = false,
		mode = 'mark',
		class: className = '',
		id = 'ord-logo',
		ariaLabel = 'ORD'
	}: OrdLogoProps = $props();

	const sizeClasses = {
		sm: 'h-6 w-6',
		md: 'h-12 w-12',
		lg: 'h-24 w-24',
		xl: 'h-40 w-40'
	} as const;

	const lockupSizeClasses = {
		sm: 'h-8 w-6',
		md: 'h-16 w-12',
		lg: 'h-32 w-24',
		xl: 'h-52 w-40'
	} as const;

	const viewBox = $derived(mode === 'lockup' ? '0 0 675 860' : '0 0 675 679');
	const frameClass = $derived(mode === 'lockup' ? lockupSizeClasses[size] : sizeClasses[size]);

	const letters = $derived([
		{ ch: 'O', x: 232, delay: ORD_LOGO_LETTER_DELAY },
		{ ch: 'R', x: 337.5, delay: ORD_LOGO_LETTER_DELAY + ORD_LOGO_LETTER_STAGGER },
		{ ch: 'D', x: 443, delay: ORD_LOGO_LETTER_DELAY + ORD_LOGO_LETTER_STAGGER * 2 }
	]);

	const innerUid = $derived(`${id}-in`);
	const outerUid = $derived(`${id}-out`);
</script>

{#snippet ringBody(d: string)}
	<path fill="currentColor" fill-rule="evenodd" {d} />
{/snippet}

{#snippet blobs(start: number)}
	<g>
		{#each ORD_LOGO_BLOB_PATHS as d, i (d)}
			<path
				class={animate ? 'ord-logo-blob' : undefined}
				fill="currentColor"
				{d}
				style={animate ? `animation-delay: ${start + i * ORD_LOGO_BLOB_STAGGER}s` : undefined}
			/>
		{/each}
	</g>
{/snippet}

{#snippet fiberRing(ringUid: string, d: string, layers: OrdLogoTimedLayer[], settleAt: number)}
	<g>
		<defs>
			{#each layers as layer, i (`${ringUid}-mask-${i}`)}
				<mask id={`${ringUid}-m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="675" height="679">
					<rect x="0" y="0" width="675" height="679" fill="black" />
					<path
						class="ord-logo-fiber"
						d={ordLogoArcPath(layer.rx, layer.ry, layer.start, layer.sweep)}
						transform="rotate({layer.tilt} {ORD_LOGO_CX} {ORD_LOGO_CY})"
						fill="none"
						stroke="white"
						stroke-width={layer.width}
						stroke-linecap="round"
						pathLength="1"
						style="animation-delay: {layer.delay}s; animation-duration: {layer.dur}s"
					/>
				</mask>
			{/each}
		</defs>
		{#each layers as layer, i (`${ringUid}-layer-${layer.start}-${i}`)}
			<g mask={`url(#${ringUid}-m${i})`}>
				{@render ringBody(d)}
			</g>
		{/each}
		<g class="ord-logo-settle" style="animation-delay: {settleAt}s">
			{@render ringBody(d)}
		</g>
	</g>
{/snippet}

<svg
	class={cn('block text-ink', frameClass, className)}
	{viewBox}
	role="img"
	aria-label={ariaLabel}
>
	{#if animate}
		{@render fiberRing(innerUid, ORD_LOGO_INNER_PATH, ORD_LOGO_INNER_FIBERS, ORD_LOGO_INNER_SETTLE)}
		{@render fiberRing(outerUid, ORD_LOGO_OUTER_PATH, ORD_LOGO_OUTER_FIBERS, ORD_LOGO_OUTER_SETTLE)}
		{@render blobs(ORD_LOGO_BLOB_START)}
	{:else}
		{@render ringBody(ORD_LOGO_INNER_PATH)}
		{@render ringBody(ORD_LOGO_OUTER_PATH)}
		{@render blobs(0)}
	{/if}

	{#if mode === 'lockup'}
		<g
			fill="currentColor"
			font-family="system-ui, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif"
			font-weight="700"
			font-size="78"
			letter-spacing="0.12em"
			text-anchor="middle"
		>
			{#each letters as letter (letter.ch)}
				<text
					class={animate ? 'ord-logo-letter' : undefined}
					x={letter.x}
					y="820"
					style={animate ? `animation-delay: ${letter.delay}s` : undefined}
				>
					{letter.ch}
				</text>
			{/each}
		</g>
	{/if}
</svg>

<style>
	@keyframes ord-logo-draw {
		from {
			stroke-dashoffset: 1;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes ord-logo-settle {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes ord-logo-blob {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes ord-logo-letter {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.ord-logo-fiber {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation-name: ord-logo-draw;
		animation-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
		animation-fill-mode: forwards;
	}

	.ord-logo-settle {
		opacity: 0;
		animation: ord-logo-settle 0.32s cubic-bezier(0.22, 0.08, 0.2, 1) forwards;
	}

	.ord-logo-blob {
		opacity: 0;
		animation: ord-logo-blob 0.2s ease forwards;
	}

	.ord-logo-letter {
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: ord-logo-letter 0.26s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	@media (prefers-reduced-motion: reduce) {
		.ord-logo-fiber {
			animation: none !important;
			stroke-dashoffset: 0;
		}

		.ord-logo-settle {
			animation: none !important;
			opacity: 1;
		}

		.ord-logo-blob {
			animation: none !important;
			opacity: 1;
		}

		.ord-logo-letter {
			animation: none !important;
			opacity: 1;
			transform: none;
		}
	}
</style>
