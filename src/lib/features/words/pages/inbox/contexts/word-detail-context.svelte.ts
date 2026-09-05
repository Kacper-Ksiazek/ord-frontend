import { createContext } from 'svelte';

export type WordDetailContext = {
	isOpened: boolean;
	selectedWordId: string | null;
};

export const [getWordDetailContext, setWordDetailContext] = createContext<WordDetailContext>();

export function createWordDetailContext() {
	const context: WordDetailContext = $state({
		isOpened: false,
		selectedWordId: null
	});

	setWordDetailContext(context);
}

export function openWordDetail(context: WordDetailContext, wordId: string) {
	context.selectedWordId = wordId;
	context.isOpened = true;
}

export function closeWordDetail(context: WordDetailContext) {
	context.isOpened = false;

	globalThis.setTimeout(() => {
		if (!context.isOpened) {
			context.selectedWordId = null;
		}
	}, 300);
}

export function toggleWordDetail(context: WordDetailContext, wordId: string) {
	if (context.isOpened && context.selectedWordId === wordId) {
		closeWordDetail(context);

		return;
	}

	openWordDetail(context, wordId);
}
