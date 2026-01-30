<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import type { TipRegister } from '$lib/types/ongoing-conversation/api/responses';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		PhraseTipCard
	} from '../../../../../shared/ai-message-learning-tips/cards';
	import { Book, BookOpen, ScrollText } from 'lucide-svelte';
	import { cn, Search, Select } from 'flowbite-svelte';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import { aggregateLearningTips, countLearningTips } from './utils';

	const messagesContext = getMessagesContext();
	const messages = $derived(messagesContext.messages);

	const allAvailableLearningTips = $derived(aggregateLearningTips(messages));

	let activeTab = $state<LearningTipCategory | 'all'>('all');
	let scrollContainer = $state<HTMLDivElement | undefined>(undefined);

	let searchQuery = $state('');
	let registerFilter = $state<TipRegister | 'all'>('all');

	const tipsToRender = $derived.by(() => {
		return allAvailableLearningTips.filter((tip) => {
			const conditions: boolean[] = [];

			// Category filter
			if (activeTab !== 'all') {
				conditions.push(tip.type === activeTab);
			}

			// Register filter
			if (registerFilter !== 'all') {
				conditions.push(tip.register === registerFilter);
			}

			// Search
			if (searchQuery.trim()) {
				conditions.push(tip.phrase.toLowerCase().includes(searchQuery.toLowerCase()));
			}

			return conditions.every(Boolean);
		});
	});

	const learningTipsCounts = $derived(countLearningTips(tipsToRender));

	function selectTab(tabId: LearningTipCategory | 'all') {
		activeTab = tabId;

		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
		}
	}

	function getCardColors(tabId: LearningTipCategory | 'all', isActive: boolean) {
		if (tabId === 'all') {
			return {
				bg: isActive ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-700/50',
				border: isActive
					? 'border-primary-300 dark:border-primary-700'
					: 'border-gray-200 dark:border-gray-600',
				text: isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400',
				valueText: isActive ? 'text-primary-900 dark:text-primary-100' : 'dark:text-gray-100',
				icon: isActive ? 'opacity-[0.1] text-primary-600 dark:text-primary-400' : 'opacity-[0.05]',
				focusRing: 'focus:ring-primary-500'
			};
		}

		// Use explicit class names for Tailwind to detect them at build time
		const colorMap: Record<LearningTipCategory, string> = {
			GRAMMAR: 'green',
			VOCABULARY: 'blue',
			PHRASES: 'purple'
		};

		const color = colorMap[tabId];

		if (color === 'green') {
			return {
				bg: isActive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/50',
				border: isActive
					? 'border-green-300 dark:border-green-700'
					: 'border-gray-200 dark:border-gray-600',
				text: isActive ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400',
				valueText: isActive ? 'text-green-900 dark:text-green-100' : 'dark:text-gray-100',
				icon: isActive ? 'opacity-[0.1] text-green-600 dark:text-green-400' : 'opacity-[0.05]',
				focusRing: 'focus:ring-green-500'
			};
		}

		if (color === 'blue') {
			return {
				bg: isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/50',
				border: isActive
					? 'border-blue-300 dark:border-blue-700'
					: 'border-gray-200 dark:border-gray-600',
				text: isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400',
				valueText: isActive ? 'text-blue-900 dark:text-blue-100' : 'dark:text-gray-100',
				icon: isActive ? 'opacity-[0.1] text-blue-600 dark:text-blue-400' : 'opacity-[0.05]',
				focusRing: 'focus:ring-blue-500'
			};
		}

		// purple
		return {
			bg: isActive ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-gray-50 dark:bg-gray-700/50',
			border: isActive
				? 'border-purple-300 dark:border-purple-700'
				: 'border-gray-200 dark:border-gray-600',
			text: isActive ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400',
			valueText: isActive ? 'text-purple-900 dark:text-purple-100' : 'dark:text-gray-100',
			icon: isActive ? 'opacity-[0.1] text-purple-600 dark:text-purple-400' : 'opacity-[0.05]',
			focusRing: 'focus:ring-purple-500'
		};
	}
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#snippet statCard(
		label: string,
		value: number,
		IconComponent: LucideIcon,
		tabId: LearningTipCategory | 'all',
		isActive: boolean
	)}
		{@const colors = getCardColors(tabId, isActive)}
		<div
			role="button"
			tabindex="0"
			onclick={() => selectTab(tabId)}
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					selectTab(tabId);
				}
			}}
			class={cn(
				'p-4 rounded-lg flex-1 relative cursor-pointer border transition-colors',
				'focus:outline-none focus:ring-2 focus:ring-offset-2',
				colors.bg,
				colors.border,
				!isActive && 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
				colors.focusRing
			)}
		>
			<div class={cn('text-sm', colors.text)}>{label}</div>
			<div class={cn('text-2xl font-bold', colors.valueText)}>{value}</div>
			<IconComponent class={cn('w-16 h-16 absolute bottom-0 right-0', colors.icon)} />
		</div>
	{/snippet}

	{@render statCard(
		'Total',
		learningTipsCounts.values().reduce((acc, value) => acc + value, 0),
		BookOpen,
		'all',
		activeTab === 'all'
	)}

	{@render statCard(
		'Grammar',
		learningTipsCounts.get('GRAMMAR') ?? 0,
		BookOpen,
		'GRAMMAR',
		activeTab === 'GRAMMAR'
	)}

	{@render statCard(
		'Vocabulary',
		learningTipsCounts.get('VOCABULARY') ?? 0,
		Book,
		'VOCABULARY',
		activeTab === 'VOCABULARY'
	)}

	{@render statCard(
		'Phrases',
		learningTipsCounts.get('PHRASES') ?? 0,
		ScrollText,
		'PHRASES',
		activeTab === 'PHRASES'
	)}
</div>

{#if learningTipsCounts.values().some((value) => value > 0)}
	<div class="flex items-center gap-3 mb-4">
		<div class="flex-1 relative">
			<Search type="text" bind:value={searchQuery} placeholder="Search tips..." size="sm" />
		</div>

		<Select bind:value={registerFilter} class="w-48">
			<option value="all">All Registers</option>
			<option value="FORMAL">Formal</option>
			<option value="NEUTRAL">Neutral</option>
			<option value="COLLOQUIAL">Colloquial</option>
		</Select>
	</div>

	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0" bind:scrollContainer>
		{#snippet children()}
			<div class="space-y-4">
				{#if !isEmpty(tipsToRender)}
					{#each tipsToRender as tip}
						{#if tip.type === 'GRAMMAR'}
							<GrammarTipCard tip={tip.data} />
						{:else if tip.type === 'VOCABULARY'}
							<VocabularyTipCard tip={tip.data} />
						{:else if tip.type === 'PHRASES'}
							<PhraseTipCard tip={tip.data} />
						{/if}
					{/each}
				{:else}
					<p class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
						No learning tips found for this category.
					</p>
				{/if}
			</div>
		{/snippet}
	</ScrollableWrapper>
{:else}
	<div class="text-center py-8 text-gray-500 dark:text-gray-400">
		<p>No learning tips available yet.</p>
	</div>
{/if}
