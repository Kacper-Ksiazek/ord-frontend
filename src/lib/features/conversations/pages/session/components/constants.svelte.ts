import * as breakpoints from '$lib/utils/breakpoints.svelte';

const SIDEPANEL_WIDTH = $derived.by(() => {
	if (breakpoints.isUltrawide.current) {
		return 860;
	}

	if (breakpoints.isMonitor1920.current) {
		return 780;
	}

	return 640;
});

export function getSidepanelWidth(): number {
	return SIDEPANEL_WIDTH;
}
