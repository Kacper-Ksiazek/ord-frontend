<script lang="ts">
	import { animate } from 'motion';
	import { onMount } from 'svelte';
	import { X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import ToastAnimatedIcon from './toast-animated-icon.svelte';
	import {
		TOAST_AUTO_DISMISS_MS,
		TOAST_EXIT_DURATION_MS,
		toastStore,
		type ToastItem,
		type ToastVariant
	} from './toast.store.svelte';

	interface Props {
		toast: ToastItem;
	}

	let { toast }: Props = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	let isRemoving = $state(false);
	let autoDismissTimeout: ReturnType<typeof setTimeout> | undefined;

	function titleForVariant(variant: ToastVariant) {
		return variant === 'success'
			? m['components.utils.toast.title_success']()
			: m['components.utils.toast.title_error']();
	}

	function prefersReducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function clearAutoDismissTimeout() {
		if (autoDismissTimeout) {
			clearTimeout(autoDismissTimeout);
			autoDismissTimeout = undefined;
		}
	}

	async function dismissToast() {
		if (isRemoving) {
			return;
		}

		isRemoving = true;
		clearAutoDismissTimeout();

		if (!rootEl || prefersReducedMotion()) {
			toastStore.remove(toast.id);

			return;
		}

		try {
			await animate(
				rootEl,
				{
					opacity: [1, 0],
					x: [0, 28],
					scale: [1, 0.96]
				},
				{ duration: TOAST_EXIT_DURATION_MS / 1000, ease: [0.4, 0, 0.2, 1] }
			).finished;
		} finally {
			toastStore.remove(toast.id);
		}
	}

	onMount(() => {
		if (rootEl && !prefersReducedMotion()) {
			animate(
				rootEl,
				{ opacity: [0, 1], x: [24, 0], scale: [0.98, 1] },
				{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }
			);
		}

		autoDismissTimeout = setTimeout(() => {
			void dismissToast();
		}, TOAST_AUTO_DISMISS_MS);

		return () => {
			clearAutoDismissTimeout();
		};
	});
</script>

<div
	bind:this={rootEl}
	class="pointer-events-auto flex overflow-hidden rounded-[10px] border border-line bg-white shadow-lg dark:bg-surface"
	role={toast.variant === 'error' ? 'alert' : 'status'}
>
	<div class="flex shrink-0 items-center bg-white pl-3 pr-1 dark:bg-surface">
		<ToastAnimatedIcon variant={toast.variant} />
	</div>

	<div class="flex min-w-0 flex-1 items-center bg-white py-3.5 pr-3 pl-2 dark:bg-surface">
		<div class="min-w-0">
			<p class="text-base font-semibold text-ink">{titleForVariant(toast.variant)}</p>
			<p class="mt-0.5 text-sm leading-snug text-ink-muted">{toast.message}</p>
		</div>
	</div>

	<button
		type="button"
		class="flex w-12 shrink-0 items-center justify-center bg-white text-ink-subtle transition-colors hover:bg-accent-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 focus-visible:ring-inset dark:bg-surface"
		aria-label={m['components.utils.toast.dismiss_aria']()}
		onclick={() => void dismissToast()}
	>
		<X class="size-4" aria-hidden="true" />
	</button>
</div>
