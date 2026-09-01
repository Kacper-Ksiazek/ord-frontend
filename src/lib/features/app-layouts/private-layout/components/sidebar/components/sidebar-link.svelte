<script lang="ts">
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import { sidebarStore } from '../sidebar.store.svelte';

	interface Props {
		title: string;
		Icon: LucideIcon;
		disabled?: boolean;
		href?: string;
		onclick?: () => void;
		fadeDelay?: number;
	}

	let { title, Icon, disabled = false, href, onclick, fadeDelay = 150 }: Props = $props();

	const isActive = $derived(
		href != null && (page.url.pathname === href || page.url.pathname.startsWith(`${href}/`))
	);

	const classList = $derived(
		disabled
			? 'text-ink-subtle cursor-not-allowed opacity-50'
			: isActive
				? 'cursor-pointer bg-accent-soft text-ink font-medium opacity-100'
				: 'cursor-pointer text-ink opacity-90 hover:bg-accent-soft hover:text-ink hover:opacity-100'
	);

	const layoutClasses = $derived(
		cn(
			'flex items-center py-2 rounded-lg transition-colors transition-opacity w-full',
			sidebarStore.isExpanded ? 'gap-3 px-3 justify-start' : 'justify-center px-0',
			classList
		)
	);

	function handleClick() {
		if (disabled) return;
		onclick?.();
	}
</script>

{#if href}
	<a {href} {title} class={layoutClasses} aria-current={isActive ? 'page' : undefined}>
		<Icon class="w-5 h-5 shrink-0" />
		{#if sidebarStore.isExpanded}
			<span class="text-sm font-medium" in:fade={{ delay: fadeDelay }}>{title}</span>
		{/if}
	</a>
{:else}
	<button {disabled} {title} class={layoutClasses} onclick={handleClick}>
		<Icon class="w-5 h-5 shrink-0" />
		{#if sidebarStore.isExpanded}
			<span class="text-sm font-medium" in:fade={{ delay: fadeDelay }}>{title}</span>
		{/if}
	</button>
{/if}
