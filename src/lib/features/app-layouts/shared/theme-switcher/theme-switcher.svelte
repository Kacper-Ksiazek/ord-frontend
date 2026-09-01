<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Moon, Sun } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { themeStore } from '$lib/stores/theme.svelte';

	interface Props {
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	function handleClick(event: MouseEvent) {
		themeStore.toggle();
		(event.currentTarget as HTMLButtonElement).blur();
	}

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const isDarkMode = $derived(themeStore.isDark);
</script>

<button
	onclick={handleClick}
	class={cn(
		'rounded-[10px] border border-line bg-surface p-2.5 text-ink hover:bg-accent-soft',
		'focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
		className
	)}
	aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
	type="button"
>
	{#if mounted}
		{#if isDarkMode}
			<Sun class="h-5 w-5" />
		{:else}
			<Moon class="h-5 w-5" />
		{/if}
	{:else}
		<div class="h-5 w-5"></div>
	{/if}
</button>
