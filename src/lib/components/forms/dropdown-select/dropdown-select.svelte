<script lang="ts">
	import { Dropdown, DropdownItem, cn } from 'flowbite-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { DropdownSelectProps } from './dropdown-select.types';
	import {
		formInputBaseClasses,
		formInputContainerClasses,
		formInputTextClasses
	} from '../shared-styles';

	interface Props<T = string> extends DropdownSelectProps<T> {
		value: T;
	}

	let dropdownOpen = $state(false);
	let buttonElement: HTMLButtonElement | undefined = $state();

	let {
		value = $bindable(),
		options,
		ariaLabel = 'Select option',
		buttonClass = '',
		dropdownClass = '',
		itemClass = '',
		iconClass = 'w-4 h-4'
	}: Props = $props();

	const selectedOption = $derived(options.find((opt) => opt.value === value) ?? options[0]);

	function handleSelect(selectedValue: typeof value) {
		console.log('handleSelect', selectedValue);
		value = selectedValue;
		buttonElement?.click();
	}
</script>

<button bind:this={buttonElement} class="hidden" aria-label="Close dropdown"></button>

<button
	class={cn(formInputBaseClasses, formInputContainerClasses, 'justify-between', buttonClass)}
	aria-label={ariaLabel}
	type="button"
	onclick={() => (dropdownOpen = !dropdownOpen)}
>
	<div class={formInputContainerClasses}>
		{#if selectedOption?.icon}
			{@const Icon = selectedOption.icon}
			<Icon class={iconClass} />
		{/if}
		<span class="text-sm font-medium">{selectedOption?.label ?? ''}</span>
	</div>
	<ChevronDown class="w-3 h-3" />
</button>

<Dropdown
	isOpen={dropdownOpen}
	class={cn('bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600', dropdownClass)}
>
	{#each options as option}
		{@const Icon = option.icon}
		{@const isSelected = value === option.value}

		<DropdownItem
			onclick={() => handleSelect(option.value)}
			class={cn(
				'w-full list-none text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2',
				isSelected &&
					'font-semibold bg-primary-50 dark:bg-primary-900 text-gray-900 dark:text-gray-100',
				itemClass,
				formInputTextClasses
			)}
		>
			{#if Icon}
				<Icon class={iconClass} />
			{/if}
			{option.label}
		</DropdownItem>
	{/each}
</Dropdown>
