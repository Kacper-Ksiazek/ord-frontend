import { toastStore, type ToastVariant } from './toast.store.svelte';

function showToast(message: string, variant: ToastVariant) {
	toastStore.push(message, variant);
}

export const toast = {
	success: (message: string) => showToast(message, 'success'),
	error: (message: string) => showToast(message, 'error')
};
