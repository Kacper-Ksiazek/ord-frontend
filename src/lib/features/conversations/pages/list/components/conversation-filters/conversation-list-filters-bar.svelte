<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/actions/icon-button';
	import { DropdownSelect, type DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { ConversationListFiltersState } from '../../state/conversation-list-state.svelte';
	import { ClockIcon, MessageSquare, SearchIcon, TrashIcon } from 'lucide-svelte';
	import type { ConversationListFilters } from '../../state/conversation-list-state.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface Props {
		filtersState: ConversationListFiltersState;
	}

	let { filtersState }: Props = $props();

	const RECENCY_BUCKETS: DropdownSelectOption<ConversationListFilters['recencyBucket']>[] = [
		{ label: 'All', value: null },
		{ label: 'Today', value: 'TODAY' },
		{ label: 'Yesterday', value: 'YESTERDAY' },
		{ label: 'This week', value: 'THIS_WEEK' },
		{ label: 'This month', value: 'THIS_MONTH' },
		{ label: 'Later', value: 'LATER' }
	];

	const CONVERSATION_TYPES: DropdownSelectOption<ConversationListFilters['type']>[] = [
		{ label: 'All', value: null },
		{ label: 'Small talk', value: 'SMALL_TALK' },
		{ label: 'Scenario roleplay', value: 'SCENARIO_ROLEPLAY' },
		{ label: 'Exam practice', value: 'EXAM_PRACTICE' },
		{ label: 'Topic exploration', value: 'TOPIC_EXPLORATION' },
		{ label: 'Oxford debate', value: 'OXFORD_DEBATE' }
	];
</script>

<div class="flex gap-2 mb-6" data-testid={E2E_TEST_IDS.conversations.filters}>
	<Input
		testId={E2E_TEST_IDS.conversations.filterSearch}
		debounced
		bind:value={filtersState.filters.search}
		type="search"
		placeholder="Topic or AI name"
		class="flex-1"
		leftAdornment={SearchIcon}
	/>

	<DropdownSelect
		testId={E2E_TEST_IDS.conversations.filterRecency}
		bind:value={filtersState.filters.recencyBucket}
		options={RECENCY_BUCKETS}
		ariaLabel="Filter by recency"
		buttonClass="w-[220px]"
	>
		{#snippet icon()}
			<ClockIcon class="w-4 h-4" />
		{/snippet}
	</DropdownSelect>

	<DropdownSelect
		testId={E2E_TEST_IDS.conversations.filterType}
		bind:value={filtersState.filters.type}
		options={CONVERSATION_TYPES}
		ariaLabel="Filter by conversation type"
		buttonClass="w-[320px]"
	>
		{#snippet icon()}
			<MessageSquare class="w-4 h-4" />
		{/snippet}
	</DropdownSelect>

	<IconButton
		testId={E2E_TEST_IDS.conversations.filterClear}
		onClick={() => filtersState.clearFilters()}
		icon={TrashIcon}
		ariaLabel="Clear filters"
		tooltip="Clear filters"
		variant="DELETE"
		type="OUTLINED"
	/>
</div>
