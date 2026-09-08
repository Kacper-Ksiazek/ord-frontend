<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { ToastVariant } from './toast.store.svelte';

	interface Props {
		variant: ToastVariant;
	}

	let { variant }: Props = $props();
</script>

<div
	class={cn(
		'toast-icon',
		variant === 'success' && 'toast-icon--success',
		variant === 'error' && 'toast-icon--error',
		variant === 'ai-pending' && 'toast-icon--ai'
	)}
	aria-hidden="true"
>
	<span class="toast-icon__pulse toast-icon__pulse--one"></span>
	<span class="toast-icon__pulse toast-icon__pulse--two"></span>

	<div class="toast-icon__badge">
		<span class="toast-icon__badge-ring" aria-hidden="true"></span>
		{#if variant === 'success'}
			<svg class="toast-icon__svg" viewBox="0 0 24 24" fill="none">
				<path
					class="toast-icon__draw toast-icon__check"
					pathLength="1"
					d="M7.25 12.35 10.35 15.45 16.75 8.95"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{:else if variant === 'ai-pending'}
			<svg class="toast-icon__svg toast-icon__sparkles" viewBox="0 0 24 24" fill="none">
				<path
					class="toast-icon__spark toast-icon__spark--main"
					d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.217c.141.704.72 1.283 1.424 1.424l5.217 1.051a1 1 0 0 1 0 1.966l-5.217 1.051a2 2 0 0 0-1.424 1.424l-1.051 5.217a1 1 0 0 1-1.966 0l-1.051-5.217a2 2 0 0 0-1.424-1.424l-5.217-1.051a1 1 0 0 1 0-1.966l5.217-1.051a2 2 0 0 0 1.424-1.424z"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<g class="toast-icon__spark-group toast-icon__spark-group--one">
					<path
						d="M20 2v4M22 4h-4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
				<g class="toast-icon__spark-group toast-icon__spark-group--two">
					<path
						d="M4 18v2M5 19H3"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</g>
			</svg>
		{:else}
			<svg class="toast-icon__svg" viewBox="0 0 24 24" fill="none">
				<path
					class="toast-icon__draw toast-icon__x-line toast-icon__x-line--one"
					pathLength="1"
					d="M9 9 15 15"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
				<path
					class="toast-icon__draw toast-icon__x-line toast-icon__x-line--two"
					pathLength="1"
					d="M15 9 9 15"
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
				/>
			</svg>
		{/if}
	</div>
</div>

<style>
	.toast-icon {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		isolation: isolate;
	}

	.toast-icon__pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 0;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 9999px;
		transform: translate(-50%, -50%);
		pointer-events: none;
		animation: toast-icon-pulse 2.1s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	}

	.toast-icon__pulse--two {
		animation-delay: 1.05s;
	}

	.toast-icon--success .toast-icon__pulse {
		background: color-mix(in srgb, var(--color-score-high) 22%, var(--color-surface));
	}

	.toast-icon--error .toast-icon__pulse {
		background: color-mix(in srgb, var(--color-danger) 22%, var(--color-surface));
	}

	.toast-icon--ai .toast-icon__pulse {
		background: color-mix(in srgb, var(--color-primary-300) 28%, var(--color-surface));
	}

	.toast-icon__badge-ring {
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		pointer-events: none;
		animation: toast-icon-badge-ring 2.1s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	}

	.toast-icon--success .toast-icon__badge-ring {
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-score-high) 42%, transparent);
	}

	.toast-icon--error .toast-icon__badge-ring {
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-danger) 42%, transparent);
	}

	.toast-icon--ai .toast-icon__badge-ring {
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary-400) 42%, transparent);
	}

	.toast-icon__badge {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 9999px;
	}

	.toast-icon--success .toast-icon__badge {
		color: var(--color-score-high);
		background: color-mix(in srgb, var(--color-score-high) 9%, var(--color-surface));
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--color-score-high) 14%, var(--color-surface)),
			0 0 0 0 color-mix(in srgb, var(--color-score-high) 24%, transparent);
		animation:
			toast-icon-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards,
			toast-icon-badge-glow-success 2.1s ease-in-out 0.42s infinite;
	}

	.toast-icon--error .toast-icon__badge {
		color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 9%, var(--color-surface));
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--color-danger) 14%, var(--color-surface)),
			0 0 0 0 color-mix(in srgb, var(--color-danger) 24%, transparent);
		animation:
			toast-icon-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards,
			toast-icon-badge-glow-error 2.1s ease-in-out 0.42s infinite;
	}

	.toast-icon--ai .toast-icon__badge {
		color: var(--color-primary-700);
		background: color-mix(in srgb, var(--color-primary-200) 42%, var(--color-surface));
		box-shadow:
			0 0 0 1px color-mix(in srgb, var(--color-primary-300) 28%, var(--color-surface)),
			0 0 0 0 color-mix(in srgb, var(--color-primary-400) 24%, transparent);
		animation:
			toast-icon-pop 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards,
			toast-icon-badge-glow-ai 2.1s ease-in-out 0.42s infinite;
	}

	.toast-icon__spark {
		transform-origin: center;
	}

	.toast-icon__spark--main {
		transform-origin: 12px 12px;
		animation: toast-icon-sparkle-main 2.2s ease-in-out infinite;
	}

	.toast-icon__spark-group--one {
		transform-origin: 21px 4px;
		animation: toast-icon-spark-drift-one 1.7s ease-in-out infinite;
	}

	.toast-icon__spark-group--two {
		transform-origin: 4px 19px;
		animation: toast-icon-spark-drift-two 2s ease-in-out 0.45s infinite;
	}

	.toast-icon__draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation-name: toast-icon-draw;
		animation-duration: 0.42s;
		animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		animation-fill-mode: forwards;
	}

	.toast-icon__check {
		animation-delay: 0.14s;
	}

	.toast-icon__x-line--one {
		animation-delay: 0.12s;
	}

	.toast-icon__x-line--two {
		animation-delay: 0.2s;
	}

	@keyframes toast-icon-pop {
		0% {
			opacity: 0;
			transform: scale(0.55);
		}

		62% {
			transform: scale(1.1);
		}

		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes toast-icon-draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes toast-icon-pulse {
		0% {
			opacity: 0.75;
			transform: translate(-50%, -50%) scale(1);
		}

		65% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1.85);
		}

		100% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(1.85);
		}
	}

	@keyframes toast-icon-badge-ring {
		0% {
			transform: scale(1);
			opacity: 0.85;
		}

		70% {
			transform: scale(1.55);
			opacity: 0;
		}

		100% {
			transform: scale(1.55);
			opacity: 0;
		}
	}

	@keyframes toast-icon-badge-glow-success {
		0%,
		100% {
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--color-score-high) 14%, var(--color-surface)),
				0 0 0 0 color-mix(in srgb, var(--color-score-high) 20%, transparent);
		}

		50% {
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--color-score-high) 22%, var(--color-surface)),
				0 0 14px 3px color-mix(in srgb, var(--color-score-high) 34%, transparent);
		}
	}

	@keyframes toast-icon-badge-glow-error {
		0%,
		100% {
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--color-danger) 14%, var(--color-surface)),
				0 0 0 0 color-mix(in srgb, var(--color-danger) 20%, transparent);
		}

		50% {
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--color-danger) 22%, var(--color-surface)),
				0 0 14px 3px color-mix(in srgb, var(--color-danger) 34%, transparent);
		}
	}

	@keyframes toast-icon-badge-glow-ai {
		0%,
		100% {
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--color-primary-300) 24%, var(--color-surface)),
				0 0 0 0 color-mix(in srgb, var(--color-primary-400) 18%, transparent);
		}

		50% {
			box-shadow:
				0 0 0 1px color-mix(in srgb, var(--color-primary-400) 32%, var(--color-surface)),
				0 0 14px 3px color-mix(in srgb, var(--color-primary-300) 36%, transparent);
		}
	}

	@keyframes toast-icon-sparkle-main {
		0%,
		100% {
			opacity: 1;
			transform: scale(1) rotate(0deg);
		}

		50% {
			opacity: 0.88;
			transform: scale(0.94) rotate(-8deg);
		}
	}

	@keyframes toast-icon-spark-drift-one {
		0%,
		100% {
			opacity: 0.35;
			transform: translate(0, 0) scale(0.82) rotate(0deg);
		}

		50% {
			opacity: 1;
			transform: translate(1.5px, -2px) scale(1.08) rotate(14deg);
		}
	}

	@keyframes toast-icon-spark-drift-two {
		0%,
		100% {
			opacity: 0.35;
			transform: translate(0, 0) scale(0.82) rotate(0deg);
		}

		50% {
			opacity: 1;
			transform: translate(-1.5px, 2px) scale(1.08) rotate(-14deg);
		}
	}

	.toast-icon__svg {
		width: 2rem;
		height: 2rem;
		overflow: visible;
	}

	.toast-icon__sparkles {
		width: 1.5rem;
		height: 1.5rem;
	}

	@media (prefers-reduced-motion: reduce) {
		.toast-icon__pulse,
		.toast-icon__badge-ring {
			animation: none;
			opacity: 0;
		}

		.toast-icon__badge {
			animation: none !important;
			opacity: 1;
			transform: none;
		}

		.toast-icon--success .toast-icon__badge {
			box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-score-high) 14%, var(--color-surface));
		}

		.toast-icon--error .toast-icon__badge {
			box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-danger) 14%, var(--color-surface));
		}

		.toast-icon--ai .toast-icon__badge {
			box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary-300) 24%, var(--color-surface));
		}

		.toast-icon__spark--main,
		.toast-icon__spark-group--one,
		.toast-icon__spark-group--two {
			animation: none;
		}

		.toast-icon__draw {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
