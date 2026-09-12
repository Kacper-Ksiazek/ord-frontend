<script lang="ts">
	import { animate } from 'motion';
	import { onMount } from 'svelte';
	import { X } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils/cn';
	import ToastAnimatedIcon from './toast-animated-icon.svelte';
	import {
		TOAST_AUTO_DISMISS_MS,
		TOAST_EXIT_DURATION_MS,
		toastStore,
		type ToastItem
	} from './toast.store.svelte';

	interface Props {
		toast: ToastItem;
	}

	let { toast }: Props = $props();

	let rootEl = $state<HTMLDivElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);
	let isRemoving = $state(false);
	let thinkingIndex = $state(0);
	let autoDismissTimeout: ReturnType<typeof setTimeout> | undefined;
	let thinkingInterval: number | undefined;

	const thinkingMessages = $derived([
		m['components.utils.toast.ai_thinking_1'](),
		m['components.utils.toast.ai_thinking_2'](),
		m['components.utils.toast.ai_thinking_3']()
	]);

	const displayMessage = $derived(
		toast.variant === 'ai-pending'
			? (thinkingMessages[thinkingIndex] ?? toast.message)
			: toast.message
	);

	function titleForToast(item: ToastItem) {
		if (item.title) {
			return item.title;
		}

		switch (item.variant) {
			case 'success':
				return m['components.utils.toast.title_success']();
			case 'error':
				return m['components.utils.toast.title_error']();
			case 'ai-pending':
				return m['components.utils.toast.title_ai_pending']();
		}
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

	function clearThinkingInterval() {
		if (thinkingInterval) {
			window.clearInterval(thinkingInterval);
			thinkingInterval = undefined;
		}
	}

	function scheduleAutoDismiss() {
		clearAutoDismissTimeout();

		if (toast.variant === 'ai-pending') {
			return;
		}

		autoDismissTimeout = setTimeout(() => {
			void dismissToast();
		}, TOAST_AUTO_DISMISS_MS);
	}

	async function pulseContent() {
		if (!contentEl || prefersReducedMotion()) {
			return;
		}

		await animate(
			contentEl,
			{ opacity: [0.72, 1], y: [2, 0] },
			{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }
		).finished;
	}

	async function dismissToast() {
		if (isRemoving) {
			return;
		}

		isRemoving = true;
		clearAutoDismissTimeout();
		clearThinkingInterval();

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

		scheduleAutoDismiss();

		return () => {
			clearAutoDismissTimeout();
			clearThinkingInterval();
		};
	});

	$effect(() => {
		if (toast.variant === 'ai-pending') {
			clearThinkingInterval();
			thinkingIndex = 0;

			thinkingInterval = window.setInterval(() => {
				thinkingIndex = (thinkingIndex + 1) % 3;
			}, 2400);

			return () => {
				clearThinkingInterval();
			};
		}

		clearThinkingInterval();
		scheduleAutoDismiss();
		void pulseContent();
	});
</script>

<div
	bind:this={rootEl}
	class={cn(
		'pointer-events-auto flex min-h-[4.25rem] items-center overflow-hidden rounded-[10px] border bg-white shadow-lg dark:bg-surface',
		toast.variant === 'ai-pending'
			? 'border-primary-200/80 dark:border-primary-300/30'
			: 'border-line'
	)}
	role={toast.variant === 'error' ? 'alert' : 'status'}
>
	<div class="flex shrink-0 items-center self-center pl-3">
		{#key toast.variant}
			<ToastAnimatedIcon variant={toast.variant} />
		{/key}
	</div>

	<div bind:this={contentEl} class="flex min-w-0 flex-1 items-center self-center py-3 pr-2 pl-2">
		<div class="min-w-0">
			<p class="text-base font-semibold leading-tight text-ink">{titleForToast(toast)}</p>
			<p class="mt-0.5 min-h-5 text-sm leading-5 text-ink-muted transition-opacity duration-200">
				{displayMessage}
			</p>
		</div>
	</div>

	<button
		type="button"
		class="mr-2.5 flex size-8 shrink-0 items-center self-center rounded-md text-ink-subtle transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 dark:hover:bg-accent-soft/60"
		aria-label={m['components.utils.toast.dismiss_aria']()}
		onclick={() => void dismissToast()}
	>
		<X class="size-4" aria-hidden="true" />
	</button>
</div>
