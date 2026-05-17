class SidebarStore {
	isExpanded = $state(true);

	toggleExpanded() {
		this.isExpanded = !this.isExpanded;
	}
}

export const sidebarStore = new SidebarStore();
