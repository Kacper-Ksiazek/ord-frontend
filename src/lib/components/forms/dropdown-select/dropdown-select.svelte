<script lang="ts" generics="T">
	import { Dropdown, DropdownItem, cn } from 'flowbite-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { DropdownSelectProps } from './dropdown-select.types';
	import '../forms.css';

	let dropdownOpen = $state(false);
	let hideButtonElement: HTMLButtonElement | undefined = $state();
	let openButtonElement: HTMLButtonElement | undefined = $state();

	let {
		value = $bindable(),
		options,
		onValueChange,
		ariaLabel = 'Select option',
		buttonClass = '',
		dropdownClass = '',
		icon,
		testId
	}: DropdownSelectProps<T> = $props();

	const selectedOption = $derived(options.find((opt) => opt.value === value) ?? options[0]);

	function handleSelect(selectedValue: typeof value) {
		if (onValueChange) {
			onValueChange(selectedValue);
		} else {
			value = selectedValue;
		}

		hideButtonElement?.click();
	}
</script>

<button bind:this={hideButtonElement} class="hidden" aria-label="Close dropdown"></button>

<button
	bind:this={openButtonElement}
	data-testid={testId}
	class={cn('form-input-base form-input-container justify-between', buttonClass)}
	aria-label={ariaLabel}
	type="button"
	onclick={() => (dropdownOpen = !dropdownOpen)}
>
	<div class="form-input-container">
		<!-- Use snippet when available -->
		{#if icon}
			{@render icon({ selectedOption })}
			<!-- Use default icon when available -->
		{:else if selectedOption?.icon}
			{@const Icon = selectedOption.icon}
			<Icon class="w-4 h-4" />
		{/if}

		<span class="text-sm font-medium">{selectedOption?.label ?? ''}</span>
	</div>
	<ChevronDown class="w-3 h-3" />
</button>

<Dropdown
	isOpen={dropdownOpen}
	class={cn('bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 ', dropdownClass)}
	style={`width: ${openButtonElement?.clientWidth}px`}
>
	{#each options as option (option.value)}
		{@const Icon = option.icon}
		{@const isSelected = value === option.value}

		<DropdownItem
			onclick={() => handleSelect(option.value)}
			class={cn(
				'w-full list-none text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2',
				isSelected &&
					'font-semibold bg-primary-50 dark:bg-primary-900 text-gray-900 dark:text-gray-100',
				'form-input-text'
			)}
		>
			{#if Icon}
				<Icon class="w-4 h-4" />
			{/if}
			{option.label}
		</DropdownItem>
	{/each}
</Dropdown>
