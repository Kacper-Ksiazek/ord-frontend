<script lang="ts">
	import ToastItem from './toast-item.svelte';
	import { toastStore } from './toast.store.svelte';
</script>

<div
	class="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[min(380px,calc(100vw-2rem))] flex-col gap-2"
	aria-live="polite"
	aria-relevant="additions"
>
	{#each toastStore.toasts as toast (toast.id)}
		<ToastItem {toast} />
	{/each}
</div>
