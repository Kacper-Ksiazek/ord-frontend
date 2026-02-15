<script lang="ts">
	import compact from 'lodash/compact';
	import isEmpty from 'lodash/isEmpty';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type {
		ConversationMessageMistake,
		ConversationMessageStrength,
		ConversationMessageSuggestion
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '../../../../../shared/user-message-feedback/cards';

	interface Props {
		allMistakes: ConversationMessageMistake[];
		allStrengths: ConversationMessageStrength[];
		allSuggestions: ConversationMessageSuggestion[];
		totalMistakes: number;
		totalStrengths: number;
		totalSuggestions: number;
	}

	let {
		allMistakes,
		allStrengths,
		allSuggestions,
		totalMistakes,
		totalStrengths,
		totalSuggestions
	}: Props = $props();

	let activeTab = $state<MessageFeedbackCriteria | 'all'>('all');

	const tabs = $derived.by(() => {
		return compact([
			{
				id: 'all',
				label: 'All',
				count: totalMistakes + totalStrengths + totalSuggestions,
				disabled: false
			},
			!isEmpty(allMistakes) && {
				id: 'MISTAKES',
				label: 'Mistakes',
				count: totalMistakes,
				disabled: false
			},
			!isEmpty(allStrengths) && {
				id: 'STRENGTHS',
				label: 'Strengths',
				count: totalStrengths,
				disabled: false
			},
			!isEmpty(allSuggestions) && {
				id: 'SUGGESTIONS',
				label: 'Suggestions',
				count: totalSuggestions,
				disabled: false
			}
		]) satisfies Tab[];
	});

	const filteredFeedback = $derived.by(() => {
		switch (true) {
			case activeTab === 'all':
				return {
					mistakes: allMistakes,
					strengths: allStrengths,
					suggestions: allSuggestions
				};
			case activeTab === 'MISTAKES':
				return { mistakes: allMistakes, strengths: [], suggestions: [] };
			case activeTab === 'STRENGTHS':
				return { mistakes: [], strengths: allStrengths, suggestions: [] };
			case activeTab === 'SUGGESTIONS':
				return { mistakes: [], strengths: [], suggestions: allSuggestions };
			default:
				return { mistakes: [], strengths: [], suggestions: [] };
		}
	});
</script>

{#if !isEmpty(allMistakes) || !isEmpty(allStrengths) || !isEmpty(allSuggestions)}
	<div class="shrink-0 mb-4">
		<Tabs {tabs} bind:activeTab activeColor="purple" />
	</div>

	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
		{#snippet children()}
			<div class="space-y-4">
				{#if !isEmpty(filteredFeedback.mistakes)}
					{#each filteredFeedback.mistakes as mistake}
						<MistakeCard {mistake} />
					{/each}
				{/if}

				{#if !isEmpty(filteredFeedback.strengths)}
					{#each filteredFeedback.strengths as strength}
						<StrengthCard {strength} />
					{/each}
				{/if}

				{#if !isEmpty(filteredFeedback.suggestions)}
					{#each filteredFeedback.suggestions as suggestion}
						<SuggestionCard {suggestion} />
					{/each}
				{/if}

				{#if isEmpty(filteredFeedback.mistakes) && isEmpty(filteredFeedback.strengths) && isEmpty(filteredFeedback.suggestions)}
					<p class="text-muted-small text-center py-4">No feedback found for this category.</p>
				{/if}
			</div>
		{/snippet}
	</ScrollableWrapper>
{:else}
	<div class="text-muted text-center py-8">
		<p>No feedback available yet.</p>
	</div>
{/if}
