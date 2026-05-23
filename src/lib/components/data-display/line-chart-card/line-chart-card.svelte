<script lang="ts">
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { cn } from 'flowbite-svelte';
	import type { ApexOptions } from 'apexcharts';
	import type { LineChartCardProps } from './line-chart-card.types';
	import { getVariantColors } from '../icon-card/icon-card.constants';
	import { getLineColorForVariant } from './line-chart-card.constants';
	import { themeStore } from '$lib/stores/theme.svelte';

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
	const isDark = $derived(themeStore.isDark);

	const lineColor = $derived(getLineColorForVariant(variant, isActive));

	const chartOptions: ApexOptions = $derived.by(() => {
		const values = data.map((d) => d.value);
		const opacityFrom = isDark ? 0.42 : 0.38;

		return {
			chart: {
				type: 'area',
				height: 64,
				width: '100%',
				sparkline: { enabled: true },
				toolbar: { show: false },
				zoom: { enabled: false },
				animations: { enabled: true }
			},
			series: [
				{
					name: title,
					data: values
				}
			],
			colors: [lineColor],
			stroke: {
				curve: 'smooth',
				width: 2
			},
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 1,
					opacityFrom,
					opacityTo: 0.04,
					stops: [0, 90, 100]
				}
			},
			dataLabels: { enabled: false },
			tooltip: { enabled: false },
			markers: { size: 0, hover: { size: 0 } },
			xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
			yaxis: { show: false },
			grid: { show: false },
			legend: { show: false },
			states: {
				hover: { filter: { type: 'none' } },
				active: { filter: { type: 'none' } }
			}
		};
	});

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
			class="h-full w-full min-w-[4.5rem]"
			role={chartAriaLabel ? 'img' : undefined}
			aria-label={chartAriaLabel}
			aria-hidden={chartAriaLabel ? undefined : true}
		>
			<Chart options={chartOptions} />
		</div>
	{:else}
		<div
			class="h-full w-full min-w-[4.5rem] rounded bg-gray-100/60 dark:bg-gray-700/40"
			aria-hidden="true"
		></div>
	{/if}
</div>
