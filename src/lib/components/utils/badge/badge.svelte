<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';

	interface Props {
		color?: TabsSupportedTailwindColor;
		class?: string;
		children: Snippet;
	}

	const { color = 'gray', class: className = '', children }: Props = $props();

	const colorClasses: Record<TabsSupportedTailwindColor, string> = {
		primary: 'bg-accent-soft text-ink',
		gray: 'bg-accent-soft text-ink-muted',
		red: 'bg-danger/10 text-danger',
		blue: 'bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200',
		green: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200',
		purple: 'bg-violet-50 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200',
		yellow: 'bg-highlight text-ink',
		orange: 'bg-orange-50 text-orange-800 dark:bg-orange-950/50 dark:text-orange-200'
	};
</script>

<span
	class={cn(
		'inline-flex items-center gap-1 rounded-[10px] px-2 py-0.5 text-xs font-medium',
		colorClasses[color],
		className
	)}
>
	{@render children()}
</span>
