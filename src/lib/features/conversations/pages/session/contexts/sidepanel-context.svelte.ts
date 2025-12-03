import { createContext } from 'svelte';

export type SidepanelContext = {
	isOpened: boolean;
};

export const [getSidepanelContext, setSidepanelContext] = createContext<SidepanelContext>();

export function createSidepanelContext() {
	setSidepanelContext({ isOpened: false });
}
