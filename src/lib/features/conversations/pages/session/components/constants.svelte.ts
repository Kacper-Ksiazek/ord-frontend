import * as breakpoints from '$lib/utils/breakpoints.svelte';

const SIDEPANEL_WIDTH = $derived.by(() => {
	if (breakpoints.isUltrawide.current) {
		return 860;
	}

	if (breakpoints.isMonitor1920.current) {
		return 780;
	}

	if (breakpoints.isBigLaptop.current) {
		return 640;
	}

	return 540;
});

export function getSidepanelWidth(): number {
	return SIDEPANEL_WIDTH;
}

const MESSAGES_MAX_WIDTH = $derived.by(() => {
	if (breakpoints.isUltrawide.current) {
		return 'max-w-[1440px]';
	}

	if (breakpoints.isMonitor1920.current) {
		return 'max-w-[1200px]';
	}

	if (breakpoints.isBigLaptop.current) {
		return 'max-w-[1000px]';
	}

	if (breakpoints.isSmallLaptop.current) {
		return 'max-w-[900px]';
	}

	return 'max-w-[800px]';
});

export function getMessagesMaxWidth(): string {
	return MESSAGES_MAX_WIDTH;
}
