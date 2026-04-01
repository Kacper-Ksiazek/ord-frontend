<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { DailyActivityPoint } from '$lib/types/conversation/api/conversation-list-activity';
	import { groupDailyActivityByMonth } from './group-daily-activity-by-month';

	interface Props {
		days: DailyActivityPoint[];
	}

	const { days }: Props = $props();

	const monthGroups = $derived(groupDailyActivityByMonth(days));

	function dotClasses(count: number): string {
		if (count <= 0) {
			return 'bg-gray-200 dark:bg-gray-700';
		}
		if (count < 5) {
			return 'bg-primary-400 dark:bg-primary-600';
		}

		return 'bg-primary-600 dark:bg-primary-500';
	}

	function ariaLabel(date: string, count: number): string {
		const label = count === 0 ? 'No messages' : count === 1 ? '1 message' : `${count} messages`;

		return `${date}: ${label}`;
	}
</script>

<div
	class={cn(
		'flex gap-6',
		'bg-gray-50 dark:bg-gray-700/50',
		'text-gray-600 dark:text-gray-400',
		'border-gray-200 dark:border-gray-600 border rounded-lg p-4'
	)}
	role="group"
	aria-label="Message activity over the last 90 days, grouped by month"
>
	{#each monthGroups as group (group.monthKey)}
		<div class="flex min-w-0 flex-col gap-2 md:shrink-0">
			<div
				class="text-xs font-medium text-gray-500 dark:text-gray-400"
				id="activity-month-{group.monthKey}"
			>
				{group.label}
			</div>

			<div
				class="max-w-full flex-wrap gap-1 grid grid-cols-7"
				role="list"
				aria-labelledby="activity-month-{group.monthKey}"
			>
				{#each group.days as point (point.date)}
					<span
						role="listitem"
						class={cn('size-4 rounded-sm transition-colors', dotClasses(point.messageCount))}
						title="{point.date}: {point.messageCount} message{point.messageCount === 1 ? '' : 's'}"
						aria-label={ariaLabel(point.date, point.messageCount)}
					></span>
				{/each}
			</div>
		</div>
	{/each}
</div>
