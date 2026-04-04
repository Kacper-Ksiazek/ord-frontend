<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { Button } from '$lib/components/buttons/button';
	import type { Snippet } from 'svelte';
	import { getSidepanelContext } from '$conversations/pages/session/contexts/sidepanel-context.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		ariaLabel: string;
		title: string;
		position?: 'left' | 'right';
		class?: string;
		disabled?: boolean;
		showAdditionalContent?: boolean;

		onClick: () => void;

		icon: LucideIcon;
		children?: Snippet;
		additionalContent?: Snippet;
	}

	const sidepanelContext = getSidepanelContext();

	const {
		icon: Icon,
		onClick,
		ariaLabel,
		title,
		position = 'right',
		class: customClass = '',
		disabled = false,
		showAdditionalContent = true,
		children,
		additionalContent
	}: Props = $props();

	/** Shared shell with OUTLINED + TEXT border tokens */
	const surfaceClass = cn(
		'rounded-xl border-2 border-gray-400/60 dark:border-gray-500/60 bg-white dark:bg-slate-800'
	);

	const additionalContentClass = cn(
		surfaceClass,
		'text-gray-700 dark:text-gray-300 font-medium text-sm',
		'h-[48px] px-3 flex items-center ml-2 gap-2'
	);
</script>

<div
	class={cn(
		'absolute z-10 flex items-center',
		position === 'left' ? 'left-0 mr-auto' : 'right-0 ml-auto'
	)}
>
	<Button
		type="OUTLINED"
		variant="TEXT"
		{onClick}
		{ariaLabel}
		{title}
		{disabled}
		class={cn(surfaceClass, 'h-auto! p-3 hover:bg-gray-100 dark:hover:bg-slate-700', customClass)}
	>
		<Icon class="w-5 h-5" />

		{#if !sidepanelContext.isOpened}
			{@render children?.()}
		{/if}
	</Button>

	{#if additionalContent && !sidepanelContext.isOpened && showAdditionalContent}
		<div class={additionalContentClass} transition:fade={{ duration: 150 }}>
			{@render additionalContent?.()}
		</div>
	{/if}
</div>
