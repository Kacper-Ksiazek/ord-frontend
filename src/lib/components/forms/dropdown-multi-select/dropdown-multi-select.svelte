<script lang="ts" generics="T extends string">
	import { DropdownMenu } from 'bits-ui';
	import { Check, ChevronDown } from 'lucide-svelte';
	import type { DropdownMultiSelectProps } from './dropdown-multi-select.types';
	import { cn } from '$lib/utils/cn';
	import '../forms.css';

	let {
		values = $bindable(),
		options,
		placeholder,
		onValuesChange,
		ariaLabel = 'Select options',
		buttonClass = '',
		dropdownClass = '',
		icon,
		optionLeading,
		dataTestId
	}: DropdownMultiSelectProps<T> = $props();

	const triggerLabel = $derived.by(() => {
		if (values.length === 0) {
			return placeholder;
		}

		if (values.length === 1) {
			return options.find((option) => option.value === values[0])?.label ?? placeholder;
		}

		return `${values.length} selected`;
	});

	function isSelected(value: T) {
		return values.includes(value);
	}

	function toggleValue(value: T) {
		const next = isSelected(value) ? values.filter((item) => item !== value) : [...values, value];

		if (onValuesChange) {
			onValuesChange(next);
		} else {
			values = next;
		}
	}

	function optionTestId(optionValue: T): string | undefined {
		if (!dataTestId) {
			return undefined;
		}

		return `${dataTestId}-option-${optionValue}`;
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		data-testid={dataTestId}
		class={cn('form-input-base form-input-container w-full justify-between', buttonClass)}
		aria-label={ariaLabel}
	>
		<div class="form-input-container min-w-0">
			{#if icon}
				{@render icon()}
			{/if}

			<span class="truncate text-sm font-medium">{triggerLabel}</span>
		</div>
		<ChevronDown class="w-3 h-3 shrink-0" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class={cn(
				'overlay-surface z-50 mt-1 max-h-72 min-w-(--bits-floating-anchor-width) overflow-y-auto p-1',
				dropdownClass
			)}
			align="start"
			sideOffset={4}
		>
			{#each options as option (option.value)}
				{@const Icon = option.icon}
				{@const selected = isSelected(option.value)}

				<DropdownMenu.Item
					onSelect={(event) => {
						event.preventDefault();
						toggleValue(option.value);
					}}
					class={cn(
						'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm',
						'text-ink outline-none hover:bg-accent-soft',
						selected && 'bg-accent-soft font-medium',
						'form-input-text'
					)}
				>
					<span class="flex w-full items-center gap-2" data-testid={optionTestId(option.value)}>
						<Check class={cn('size-4 shrink-0', selected ? 'opacity-100' : 'opacity-0')} />

						{#if optionLeading}
							{@render optionLeading(option)}
						{:else if Icon}
							<Icon class="w-4 h-4" />
						{/if}

						<span class="truncate">{option.label}</span>
					</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
