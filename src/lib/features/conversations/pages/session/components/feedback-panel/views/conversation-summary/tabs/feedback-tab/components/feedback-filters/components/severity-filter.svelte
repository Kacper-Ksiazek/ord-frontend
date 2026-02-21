<script lang="ts">
	import { CircleAlert, TriangleAlert, CircleX, Layers } from 'lucide-svelte';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import type { MistakeSeverityFilter } from '../../../feedback-tab.types';

	interface Props {
		value: MistakeSeverityFilter;
	}

	let { value = $bindable() }: Props = $props();

	const options: DropdownSelectOption<MistakeSeverityFilter>[] = [
		{ label: 'All Severities', value: 'ALL', icon: Layers },
		{ label: 'Minor', value: 'MINOR', icon: CircleAlert },
		{ label: 'Moderate', value: 'MODERATE', icon: TriangleAlert },
		{ label: 'Critical', value: 'CRITICAL', icon: CircleX }
	];
</script>

<DropdownSelect
	bind:value
	{options}
	ariaLabel="Select severity filter"
	buttonClass="w-48"
	dropdownClass="w-48"
/>
