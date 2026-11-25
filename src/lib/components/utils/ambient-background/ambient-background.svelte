<script lang="ts">
	interface Props {
		/** Fills the nearest positioned ancestor instead of the whole viewport. */
		contained?: boolean;
	}

	let { contained = false }: Props = $props();
</script>

<!-- Decorative, theme-aware backdrop (blurred blobs and slowly turning rings), shared by the login
	screen and the Explain page. Colors derive from studio tokens via color-mix so light and dark
	themes swap automatically. -->
<div class="ambient-bg" class:ambient-bg--contained={contained} aria-hidden="true">
	<span class="ambient-bg__blob ambient-bg__blob--a"></span>
	<span class="ambient-bg__blob ambient-bg__blob--b"></span>
	<span class="ambient-bg__blob ambient-bg__blob--c"></span>

	<div class="ambient-bg__rings">
		<span class="ambient-bg__ring ambient-bg__ring--pulse"></span>
		<span class="ambient-bg__ring ambient-bg__ring--pulse ambient-bg__ring--delayed"></span>
		<svg class="ambient-bg__spin" viewBox="0 0 200 200" fill="none">
			<circle
				cx="100"
				cy="100"
				r="92"
				stroke="currentColor"
				stroke-width="0.6"
				stroke-dasharray="2 10"
			/>
			<circle
				cx="100"
				cy="100"
				r="70"
				stroke="currentColor"
				stroke-width="0.6"
				stroke-dasharray="40 6 12 6"
			/>
		</svg>
	</div>
</div>

<style>
	.ambient-bg {
		position: fixed;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.ambient-bg--contained {
		position: absolute;
	}

	.ambient-bg__blob {
		position: absolute;
		width: 55vmax;
		height: 55vmax;
		border-radius: 50%;
		filter: blur(70px);
		opacity: 0.9;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--studio-ink) 20%, transparent) 0%,
			transparent 70%
		);
		will-change: transform;
	}

	.ambient-bg__blob--a {
		top: -18vmax;
		left: -16vmax;
		animation: ambient-bg-drift-a 22s ease-in-out infinite alternate;
	}

	.ambient-bg__blob--b {
		right: -20vmax;
		bottom: -22vmax;
		animation: ambient-bg-drift-b 26s ease-in-out infinite alternate;
	}

	.ambient-bg__blob--c {
		top: 30%;
		left: 40%;
		width: 35vmax;
		height: 35vmax;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--studio-accent) 16%, transparent) 0%,
			transparent 70%
		);
		animation: ambient-bg-drift-c 30s ease-in-out infinite alternate;
	}

	.ambient-bg__rings {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(120vmin, 1100px);
		height: min(120vmin, 1100px);
		translate: -50% -50%;
		color: var(--studio-line);
	}

	.ambient-bg__ring {
		position: absolute;
		inset: 0;
		border: 1px solid color-mix(in srgb, var(--studio-ink) 24%, transparent);
		border-radius: 50%;
		opacity: 0;
		transform: scale(0.35);
		animation: ambient-bg-ripple 7s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	}

	.ambient-bg__ring--delayed {
		animation-delay: 3.5s;
	}

	.ambient-bg__spin {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 1;
		animation: ambient-bg-spin 90s linear infinite;
	}

	@keyframes ambient-bg-drift-a {
		to {
			transform: translate3d(12vmax, 8vmax, 0) scale(1.08);
		}
	}

	@keyframes ambient-bg-drift-b {
		to {
			transform: translate3d(-10vmax, -6vmax, 0) scale(1.12);
		}
	}

	@keyframes ambient-bg-drift-c {
		to {
			transform: translate3d(-8vmax, 10vmax, 0) scale(0.92);
		}
	}

	@keyframes ambient-bg-ripple {
		0% {
			opacity: 0;
			transform: scale(0.35);
		}
		15% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: scale(1.1);
		}
	}

	@keyframes ambient-bg-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ambient-bg__blob,
		.ambient-bg__ring,
		.ambient-bg__spin {
			animation: none;
		}

		.ambient-bg__ring {
			display: none;
		}
	}
</style>
