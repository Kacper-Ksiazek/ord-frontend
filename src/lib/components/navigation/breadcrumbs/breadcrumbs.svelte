<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import type { BreadcrumbItem } from './breadcrumbs.types';

	interface Props {
		items: BreadcrumbItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();
</script>

{#if items.length > 0}
	<nav class="flex items-center gap-1.5 text-sm {className}" aria-label="Breadcrumb">
		{#each items.slice(0, -1) as item (item.label)}
			{#if item.onClick}
				<button
					type="button"
					class="link-muted cursor-pointer bg-transparent border-none p-0 font-inherit text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
					onclick={item.onClick}
				>
					{item.label}
				</button>
			{:else}
				<span class="text-gray-500 dark:text-gray-400">{item.label}</span>
			{/if}
			<ChevronRight class="size-4 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
		{/each}
		<span class="font-medium text-gray-900 dark:text-gray-100">
			{items[items.length - 1].label}
		</span>
	</nav>
{/if}
