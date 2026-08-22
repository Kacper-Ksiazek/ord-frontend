<script lang="ts">
	import { defineChart, areaY } from '@tanstack/charts';
	import { scaleLinear } from '@tanstack/charts/scales/linear';
	import { scalePoint } from '@tanstack/charts/scales/point';
	import { TanStackChart, CHART_MARGINS_COMPACT } from '$lib/components/charts';
	import { cn } from '$lib/utils/cn';
	import type { LineChartCardProps } from './line-chart-card.types';
	import { getVariantColors } from '../icon-card/icon-card.constants';
	import { getLineColorForVariant } from './line-chart-card.constants';

	let {
		title,
		value,
		data,
		class: customClass = '',
		variant = 'primary',
		isActive = true,
		disabled = false,
		chartAriaLabel,
		onclick,
		onkeydown,
		...restProps
	}: LineChartCardProps = $props();

	const colors = $derived(getVariantColors(variant, isActive));
	const isClickable = $derived(typeof onclick === 'function');
	const lineColor = $derived(getLineColorForVariant(variant, isActive));

	const sparkRows = $derived(
		data.map((point, index) => ({
			id: String(index),
			index,
			value: point.value
		}))
	);

	const definition = $derived(
		defineChart({
			marks: [
				areaY(sparkRows, {
					id: 'sparkline',
					x: 'index',
					y: 'value',
					fill: lineColor,
					fillOpacity: 0.25,
					stroke: lineColor,
					strokeWidth: 2
				})
			],
			x: {
				scale: () => scalePoint<number>().padding(0.1),
				axis: false
			},
			y: {
				scale: scaleLinear,
				nice: true,
				axis: false,
				grid: false
			},
			margin: CHART_MARGINS_COMPACT
		})
	);

	const focusRingColor = $derived.by(() => {
		if (disabled) return '';
		switch (variant) {
			case 'primary':
				return 'focus:ring-primary-500';
			case 'blue':
				return 'focus:ring-blue-500';
			case 'green':
				return 'focus:ring-green-500';
			case 'purple':
				return 'focus:ring-purple-500';
			case 'red':
				return 'focus:ring-red-500';
			case 'inactive':
				return 'focus:ring-gray-400';
			default:
				return '';
		}
	});

	function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (disabled) return;
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (onclick && e.currentTarget) {
				const syntheticEvent = {
					...e,
					type: 'click',
					currentTarget: e.currentTarget
				} as unknown as MouseEvent & { currentTarget: EventTarget & HTMLDivElement };
				onclick(syntheticEvent);
			}
		}
		onkeydown?.(e);
	}

	function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLDivElement }) {
		if (disabled) return;
		onclick?.(e);
	}
</script>

<div
	class={cn(
		'p-4 rounded-lg flex-1 relative border transition-colors',
		'focus:outline-none focus:ring-2 focus:ring-offset-2',
		focusRingColor,
		colors.bg,
		colors.border,
		!isActive && !disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800/50',
		isClickable && 'cursor-pointer',
		disabled && 'opacity-50 cursor-not-allowed focus:ring-0',
		customClass
	)}
	{...isClickable
		? {
				role: 'button',
				tabindex: disabled ? -1 : 0,
				'aria-disabled': disabled,
				onclick: handleClick,
				onkeydown: handleKeydown
			}
		: {}}
	{...restProps}
>
	<div class={cn('text-sm', colors.text)}>{title}</div>
	<div class={cn('text-2xl font-bold', colors.valueText)}>{value}</div>

	{#if data.length > 0}
		<div
			class="h-16 w-full min-w-[4.5rem]"
			role={chartAriaLabel ? 'img' : undefined}
			aria-label={chartAriaLabel}
			aria-hidden={chartAriaLabel ? undefined : true}
		>
			<TanStackChart {definition} ariaLabel={chartAriaLabel ?? title} height={64} initialWidth={120} />
		</div>
	{:else}
		<div
			class="h-16 w-full min-w-[4.5rem] rounded bg-gray-100/60 dark:bg-gray-700/40"
			aria-hidden="true"
		></div>
	{/if}
</div>
