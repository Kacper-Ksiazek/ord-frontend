import { toastStore, type ToastVariant } from './toast.store.svelte';

function showToast(message: string, variant: ToastVariant, title?: string) {
	return toastStore.push({ message, variant, title });
}

export type AiProgressToast = {
	id: string;
	success: (message: string, title?: string) => void;
	error: (message: string, title?: string) => void;
};

export const toast = {
	success: (message: string, title?: string) => showToast(message, 'success', title),
	error: (message: string, title?: string) => showToast(message, 'error', title),
	aiProgress: (message: string, title?: string): AiProgressToast => {
		const id = toastStore.push({
			message,
			title,
			variant: 'ai-pending'
		});

		return {
			id,
			success: (nextMessage, nextTitle) => {
				toastStore.update(id, {
					variant: 'success',
					message: nextMessage,
					title: nextTitle
				});
			},
			error: (nextMessage, nextTitle) => {
				toastStore.update(id, {
					variant: 'error',
					message: nextMessage,
					title: nextTitle
				});
			}
		};
	}
};
