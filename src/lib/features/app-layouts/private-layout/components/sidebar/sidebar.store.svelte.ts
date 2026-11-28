import { isMobile } from '$lib/utils/breakpoints.svelte';

class SidebarStore {
	/** Desktop rail: expanded (labels) vs collapsed (icons only). Persisted in localStorage. */
	isExpanded = $state(true);
	/** Mobile drawer visibility. Never persisted — the drawer always starts closed. */
	isMobileOpen = $state(false);

	/** Below Tailwind's `md` breakpoint the sidebar is an off-canvas drawer instead of a rail. */
	get isMobile(): boolean {
		return isMobile.current;
	}

	/** Whether sidebar items render their text labels (always in the mobile drawer). */
	get showsLabels(): boolean {
		return this.isMobile || this.isExpanded;
	}

	toggleExpanded() {
		this.isExpanded = !this.isExpanded;
	}

	openMobile() {
		this.isMobileOpen = true;
	}

	closeMobile() {
		this.isMobileOpen = false;
	}
}

export const sidebarStore = new SidebarStore();
