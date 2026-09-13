import { animate } from 'motion';
import type { Attachment } from 'svelte/attachments';

export function toastEnter(): Attachment {
	return (element) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const animation = animate(
			element,
			{ opacity: [0, 1], x: [24, 0] },
			{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }
		);

		return () => animation.stop();
	};
}
