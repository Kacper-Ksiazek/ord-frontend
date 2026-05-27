<script lang="ts">
	import { Dropdown, DropdownItem, cn } from 'flowbite-svelte';
	import { IconButton } from '$lib/components/actions/icon-button';
	import { Ellipsis } from 'lucide-svelte';
	import type { ActionMenuItem, ActionMenuProps } from './action-menu.types';

	let {
		items,
		ariaLabel = 'Open menu',
		triggerIcon = Ellipsis,
		class: className = '',
		iconButtonClass = 'shrink-0 size-8 border-0',
		iconClass = 'size-4'
	}: ActionMenuProps = $props();

	let dropdownOpen = $state(false);

	function closeDropdown() {
		dropdownOpen = false;
	}

	function handleItemClick(item: ActionMenuItem) {
		item.onClick?.();
		closeDropdown();
	}
</script>

<div class={cn('relative', className)}>
	<IconButton
		icon={triggerIcon}
		{ariaLabel}
		type="OUTLINED"
		variant="TEXT"
		class={iconButtonClass}
		{iconClass}
		onClick={() => (dropdownOpen = !dropdownOpen)}
	/>

	<Dropdown
		isOpen={dropdownOpen}
		placement="bottom-end"
		class="w-52 border border-gray-200 bg-white py-1 dark:border-gray-600 dark:bg-gray-800"
	>
		{#each items as item (item.label)}
			{@const Icon = item.icon}
			<DropdownItem
				disabled={item.disabled}
				onclick={() => handleItemClick(item)}
				class={cn(
					'flex w-full list-none items-center gap-2 px-3 py-2 text-sm',
					'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
					item.variant === 'delete' &&
						'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30'
				)}
			>
				<Icon class="size-4 shrink-0" />
				<span>{item.label}</span>
			</DropdownItem>
		{/each}
	</Dropdown>
</div>
