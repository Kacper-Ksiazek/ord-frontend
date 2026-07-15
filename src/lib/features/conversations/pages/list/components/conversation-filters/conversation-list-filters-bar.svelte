<script lang="ts">
	import Input from '$lib/components/forms/input/input.svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { DropdownSelect, type DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import { ConversationListFiltersState } from '../../state/conversation-list-state.svelte';
	import { ClockIcon, MessageSquare, SearchIcon, TrashIcon } from 'lucide-svelte';
	import type { ConversationListFilters } from '../../state/conversation-list-state.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import * as m from '$lib/paraglide/messages.js';
	import { getConversationTypeLabel } from '$conversations/shared/utils';
	import type { ConversationType } from '$conversations/types';

	interface Props {
		filtersState: ConversationListFiltersState;
	}

	let { filtersState }: Props = $props();

	const CONVERSATION_TYPE_VALUES: ConversationType[] = [
		'SMALL_TALK',
		'SCENARIO_ROLEPLAY',
		'EXAM_PRACTICE',
		'TOPIC_EXPLORATION',
		'OXFORD_DEBATE'
	];

	const RECENCY_BUCKETS: DropdownSelectOption<ConversationListFilters['recencyBucket']>[] = [
		{ label: m['features.conversation.list.filters.all'](), value: null },
		{ label: m['features.conversation.list.filters.recency.TODAY'](), value: 'TODAY' },
		{ label: m['features.conversation.list.filters.recency.YESTERDAY'](), value: 'YESTERDAY' },
		{ label: m['features.conversation.list.filters.recency.THIS_WEEK'](), value: 'THIS_WEEK' },
		{ label: m['features.conversation.list.filters.recency.THIS_MONTH'](), value: 'THIS_MONTH' },
		{ label: m['features.conversation.list.filters.recency.LATER'](), value: 'LATER' }
	];

	const CONVERSATION_TYPES: DropdownSelectOption<ConversationListFilters['type']>[] = [
		{ label: m['features.conversation.list.filters.all'](), value: null },
		...CONVERSATION_TYPE_VALUES.map((type) => ({
			label: getConversationTypeLabel(type),
			value: type
		}))
	];
</script>

<div class="flex gap-2 mb-6" data-testid={E2E_TEST_IDS.conversations.filters}>
	<Input
		dataTestId={E2E_TEST_IDS.conversations.filterSearch}
		debounced
		bind:value={filtersState.filters.search}
		type="search"
		placeholder={m['features.conversation.list.filters.search_placeholder']()}
		class="flex-1"
		leftAdornment={SearchIcon}
	/>

	<DropdownSelect
		dataTestId={E2E_TEST_IDS.conversations.filterRecency}
		bind:value={filtersState.filters.recencyBucket}
		options={RECENCY_BUCKETS}
		ariaLabel={m['features.conversation.list.filters.recency_aria']()}
		buttonClass="w-[220px]"
	>
		{#snippet icon()}
			<ClockIcon class="w-4 h-4" />
		{/snippet}
	</DropdownSelect>

	<DropdownSelect
		dataTestId={E2E_TEST_IDS.conversations.filterType}
		bind:value={filtersState.filters.type}
		options={CONVERSATION_TYPES}
		ariaLabel={m['features.conversation.list.filters.type_aria']()}
		buttonClass="w-[320px]"
	>
		{#snippet icon()}
			<MessageSquare class="w-4 h-4" />
		{/snippet}
	</DropdownSelect>

	<IconButton
		dataTestId={E2E_TEST_IDS.conversations.filterClear}
		onClick={() => filtersState.clearFilters()}
		icon={TrashIcon}
		ariaLabel={m['features.conversation.list.filters.clear']()}
		tooltip={m['features.conversation.list.filters.clear']()}
		variant="DELETE"
		type="OUTLINED"
	/>
</div>
