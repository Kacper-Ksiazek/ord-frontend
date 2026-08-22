<script lang="ts">
	import { browser } from '$app/environment';
	import type { ApexOptions } from 'apexcharts';

	interface Props {
		options: ApexOptions;
		class?: string;
	}

	let { options, class: className = '' }: Props = $props();
	let el: HTMLDivElement | undefined = $state();

	$effect(() => {
		if (!browser || !el) {
			return;
		}

		const chartOptions = options;
		const host = el;
		let cancelled = false;
		let instance: { destroy: () => void; render: () => unknown } | undefined;

		void import('apexcharts').then(({ default: ApexCharts }) => {
			if (cancelled || !host) {
				return;
			}

			instance = new ApexCharts(host, chartOptions);
			void instance.render();
		});

		return () => {
			cancelled = true;
			instance?.destroy();
		};
	});
</script>

<div bind:this={el} class={className}></div>
