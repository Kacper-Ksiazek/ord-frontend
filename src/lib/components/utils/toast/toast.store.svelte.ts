export type ToastVariant = 'success' | 'error';

export type ToastItem = {
	id: string;
	message: string;
	variant: ToastVariant;
};

export const TOAST_AUTO_DISMISS_MS = 4000;
export const TOAST_EXIT_DURATION_MS = 320;

class ToastStore {
	toasts = $state<ToastItem[]>([]);

	push(message: string, variant: ToastVariant) {
		const id = crypto.randomUUID();
		this.toasts = [...this.toasts, { id, message, variant }];

		return id;
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}
}

export const toastStore = new ToastStore();
