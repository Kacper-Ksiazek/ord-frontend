<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface Props {
		icon: LucideIcon;
		onclick: () => void;
		ariaLabel: string;
		title: string;
		position?: 'left' | 'right';
		class?: string;
	}

	const {
		icon: Icon,
		onclick,
		ariaLabel,
		title,
		position = 'right',
		class: customClass = ''
	}: Props = $props();
</script>

<button
	{onclick}
	class={cn(
		'absolute top-[20px] flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer z-10',
		'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300',
		'hover:bg-gray-50 dark:hover:bg-slate-700',
		'border-gray-300 dark:border-gray-600',
		position === 'left' ? 'left-0 mr-auto' : 'right-0 ml-auto',
		customClass
	)}
	aria-label={ariaLabel}
	{title}
>
	<Icon class="w-5 h-5" />
</button>
