<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { TabsSupportedTailwindColor, TabsProps } from './tabs.types';

	let {
		tabs,
		activeTab = $bindable(),
		activeColor = 'red',
		variant = 'underline',
		class: className = ''
	}: TabsProps = $props();

	// Initialize activeTab if not provided
	$effect(() => {
		if (activeTab === undefined && tabs.length > 0) {
			activeTab = tabs[0].id;
		}
	});

	const activeColorClasses: Record<TabsSupportedTailwindColor, string> = {
		red: 'border-red-600 text-red-600 dark:text-red-400 dark:border-red-400',
		blue: 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400',
		green: 'border-green-600 text-green-600 dark:text-green-400 dark:border-green-400',
		purple: 'border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400',
		yellow: 'border-yellow-600 text-yellow-600 dark:text-yellow-400 dark:border-yellow-400',
		orange: 'border-orange-600 text-orange-600 dark:text-orange-400 dark:border-orange-400',
		gray: 'border-gray-600 text-gray-600 dark:text-gray-400 dark:border-gray-400',
		primary: 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
	};

	const outlinedActiveColorClasses: Record<TabsSupportedTailwindColor, string> = {
		red: 'border-red-600 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 dark:border-red-400',
		blue:
			'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400',
		green:
			'border-green-600 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 dark:border-green-400',
		purple:
			'border-purple-600 bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-400',
		yellow:
			'border-yellow-600 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-400',
		orange:
			'border-orange-600 bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-400',
		gray:
			'border-gray-600 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-400',
		primary:
			'border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-400'
	};

	const activeClass = $derived(activeColorClasses[activeColor]);
	const outlinedActiveClass = $derived(outlinedActiveColorClasses[activeColor]);
	const currentActiveTab = $derived(activeTab ?? tabs[0]?.id);
</script>

{#if tabs.length > 1}
	{#if variant === 'underline'}
		<div class={cn('border-b border-gray-200 dark:border-gray-700 flex gap-1', className)}>
			{#each tabs as tab (tab.id)}
				<button
					onclick={() => !tab.disabled && (activeTab = tab.id)}
					disabled={tab.disabled}
					class={cn(
						'px-4 py-2 text-sm font-medium transition-colors border-b-2 flex items-center gap-2',
						tab.disabled
							? 'opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500'
							: currentActiveTab === tab.id
								? activeClass
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
						tab.disabled && 'border-transparent'
					)}
				>
					{#if tab.icon}
						<tab.icon class="w-4 h-4" />
					{/if}
					<span>{tab.label}</span>
					{#if tab.count !== undefined && tab.count >= 0}
						<span class="ml-1.5 text-xs">({tab.count})</span>
					{/if}
				</button>
			{/each}
		</div>
	{:else if variant === 'outlined'}
		<div class={cn('flex gap-2', className)}>
			{#each tabs as tab (tab.id)}
				<button
					onclick={() => !tab.disabled && (activeTab = tab.id)}
					disabled={tab.disabled}
					class={cn(
						'flex-1 px-4 py-2 text-sm font-medium transition-colors border-2 rounded-md flex items-center justify-center gap-2',
						tab.disabled
							? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500'
							: currentActiveTab === tab.id
								? outlinedActiveClass
								: 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-800/50'
					)}
				>
					{#if tab.icon}
						<tab.icon class="w-4 h-4" />
					{/if}
					<span>{tab.label}</span>
					{#if tab.count !== undefined && tab.count >= 0}
						<span class="ml-1.5 text-xs">({tab.count})</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
{/if}
