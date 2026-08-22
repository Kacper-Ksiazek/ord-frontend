<script lang="ts" generics="T">
	import { DropdownMenu } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';
	import type { DropdownSelectProps } from './dropdown-select.types';
	import { cn } from '$lib/utils/cn';
	import '../forms.css';

	let {
		value = $bindable(),
		options,
		onValueChange,
		ariaLabel = 'Select option',
		buttonClass = '',
		dropdownClass = '',
		icon,
		dataTestId
	}: DropdownSelectProps<T> = $props();

	const selectedOption = $derived(options.find((opt) => opt.value === value) ?? options[0]);

	function handleSelect(selectedValue: typeof value) {
		if (onValueChange) {
			onValueChange(selectedValue);
		} else {
			value = selectedValue;
		}
	}

	function optionTestId(optionValue: T): string | undefined {
		if (!dataTestId) {
			return undefined;
		}

		return `${dataTestId}-option-${optionValue == null ? 'all' : String(optionValue)}`;
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		data-testid={dataTestId}
		class={cn('form-input-base form-input-container w-full justify-between', buttonClass)}
		aria-label={ariaLabel}
	>
		<div class="form-input-container">
			{#if icon}
				{@render icon({ selectedOption })}
			{:else if selectedOption?.icon}
				{@const Icon = selectedOption.icon}
				<Icon class="w-4 h-4" />
			{/if}

			<span class="text-sm font-medium">{selectedOption?.label ?? ''}</span>
		</div>
		<ChevronDown class="w-3 h-3" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class={cn('overlay-surface z-50 mt-1 min-w-(--bits-floating-anchor-width) p-1', dropdownClass)}
			align="start"
			sideOffset={4}
		>
			{#each options as option (option.value)}
				{@const Icon = option.icon}
				{@const isSelected = value === option.value}

				<DropdownMenu.Item
					onSelect={() => handleSelect(option.value)}
					class={cn(
						'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
						'text-ink outline-none hover:bg-accent-soft',
						isSelected && 'bg-accent-soft font-medium',
						'form-input-text'
					)}
				>
					<span class="flex w-full items-center gap-2" data-testid={optionTestId(option.value)}>
						{#if Icon}
							<Icon class="w-4 h-4" />
						{/if}
						{option.label}
					</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
