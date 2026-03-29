<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { ChevronRight } from 'lucide-svelte';
	import type { BreadcrumbProps } from './breadcrumb.types';

	let { crumbs, class: className = '' }: BreadcrumbProps = $props();
</script>

<nav aria-label="Breadcrumb" class={cn('flex items-center gap-1', className)}>
	{#each crumbs as crumb, i (crumb.label)}
		{@const isLast = i === crumbs.length - 1}
		{@const isClickable = !isLast && (crumb.onClick != null || crumb.href != null)}

		{#if i > 0}
			<ChevronRight class="size-4 shrink-0 opacity-40" />
		{/if}

		{#if isClickable && crumb.href}
			<a
				href={crumb.href}
				class="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer label"
			>
				{#if crumb.icon}
					{@const Icon = crumb.icon}
					<Icon class="size-4 shrink-0" />
				{/if}
				{crumb.label}
			</a>
		{:else if isClickable && crumb.onClick}
			<button
				type="button"
				onclick={crumb.onClick}
				class="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer label"
			>
				{#if crumb.icon}
					{@const Icon = crumb.icon}
					<Icon class="size-4 shrink-0" />
				{/if}
				{crumb.label}
			</button>
		{:else}
			<span class="flex items-center gap-1.5 font-medium text-sm">
				{#if crumb.icon}
					{@const Icon = crumb.icon}
					<Icon class="size-4 shrink-0" />
				{/if}
				{crumb.label}
			</span>
		{/if}
	{/each}
</nav>
