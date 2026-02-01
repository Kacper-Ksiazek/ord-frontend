<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Forms/DropdownSelect',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { DropdownSelect } from './index';
	import type { DropdownSelectOption } from './index';
	import { Briefcase, Users, Zap, Layers } from 'lucide-svelte';

	// Basic string options
	let basicValue = $state('option1');
	const basicOptions: DropdownSelectOption<string>[] = [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' }
	];

	// Options with icons
	let iconValue = $state('ALL');
	const iconOptions: DropdownSelectOption<string>[] = [
		{ label: 'All Registers', value: 'ALL', icon: Layers },
		{ label: 'Formal', value: 'FORMAL', icon: Briefcase },
		{ label: 'Neutral', value: 'NEUTRAL', icon: Users },
		{ label: 'Colloquial', value: 'COLLOQUIAL', icon: Zap }
	];
</script>

<Story name="Default">
	<div class="p-8 bg-white dark:bg-gray-800 min-h-screen transition-colors">
		<div class="max-w-md mx-auto space-y-8">
			<div>
				<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Dropdown</h3>
				<DropdownSelect bind:value={basicValue} options={basicOptions} ariaLabel="Select an option" />
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Selected: <strong>{basicValue}</strong>
				</p>
			</div>
		</div>
	</div>
</Story>

<Story name="With Icons">
	<div class="p-8 bg-white dark:bg-gray-800 min-h-screen transition-colors">
		<div class="max-w-md mx-auto space-y-8">
			<div>
				<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Dropdown with Icons</h3>
				<DropdownSelect
					bind:value={iconValue}
					options={iconOptions}
					ariaLabel="Select register filter"
					buttonClass="w-48"
					dropdownClass="w-48"
				/>
				<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Selected: <strong>{iconValue}</strong>
				</p>
			</div>
		</div>
	</div>
</Story>
