export type ToastVariant = 'success' | 'error' | 'ai-pending';

export type ToastItem = {
	id: string;
	message: string;
	title?: string;
	variant: ToastVariant;
};

export const TOAST_AUTO_DISMISS_MS = 4000;
export const TOAST_EXIT_DURATION_MS = 320;

type ToastInput = {
	message: string;
	title?: string;
	variant: ToastVariant;
};

class ToastStore {
	toasts = $state<ToastItem[]>([]);

	push(input: ToastInput) {
		const id = crypto.randomUUID();
		this.toasts = [...this.toasts, { id, ...input }];

		return id;
	}

	update(id: string, patch: Partial<Omit<ToastItem, 'id'>>) {
		this.toasts = this.toasts.map((toast) => (toast.id === id ? { ...toast, ...patch } : toast));
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}
}

export const toastStore = new ToastStore();
