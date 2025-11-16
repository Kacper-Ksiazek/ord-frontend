<script lang="ts">
import type { Component } from 'svelte';
import { fade } from 'svelte/transition';
import { sidebarStore } from '../sidebar.store.svelte';

interface Props {
	title: string;
	Icon: Component<Record<string, unknown>>;
	disabled?: boolean;
	href?: string;
	onclick?: () => void;
}

let { title, Icon, disabled = false, href, onclick }: Props = $props();

const classList = disabled
	? 'text-gray-500 cursor-not-allowed opacity-50'
	: 'hover:bg-gray-900 text-gray-300 hover:text-white cursor-pointer';

function handleClick() {
	if (disabled) return;
	onclick?.();
}
</script>

{#if href}
	<a
		{href}
		title={title}
		class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full {classList} {disabled
			? ''
			: 'justify-start'}"
	>
		<Icon class="w-5 h-5 shrink-0" />
		{#if sidebarStore.isExpanded}
			<span class="text-sm font-medium" in:fade={{ delay: 150 }}>{title}</span>
		{/if}
	</a>
{:else}
	<button
		{disabled}
		{title}
		class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full {classList} {disabled ? '' : 'justify-start'}"
		onclick={handleClick}
	>
		<Icon class="w-5 h-5 shrink-0" />
		{#if sidebarStore.isExpanded}
			<span class="text-sm font-medium" in:fade={{ delay: 150 }}>{title}</span>
		{/if}
	</button>
{/if}
