<script lang="ts">
	import { Briefcase, Users, Zap, Layers } from 'lucide-svelte';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import type { RegisterFilter } from '../../../lib/filters';

	interface Props {
		value: RegisterFilter;
	}

	let { value = $bindable() }: Props = $props();

	const options: DropdownSelectOption<RegisterFilter>[] = [
		{ label: 'All Registers', value: 'ALL', icon: Layers },
		{ label: 'Formal', value: 'FORMAL', icon: Briefcase },
		{ label: 'Neutral', value: 'NEUTRAL', icon: Users },
		{ label: 'Colloquial', value: 'COLLOQUIAL', icon: Zap }
	];
</script>

<DropdownSelect
	bind:value
	{options}
	ariaLabel="Select register filter"
	buttonClass="w-48"
	dropdownClass="w-48"
/>
