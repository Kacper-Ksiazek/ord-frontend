import { animate, stagger } from 'motion';
import type { Attachment } from 'svelte/attachments';

export type IntroStaggerOptions = {
	startDelay?: number;
	interval?: number;
	duration?: number;
	y?: number;
};

const INTRO_ITEM_SELECTOR = '[data-intro]';

const DEFAULTS = {
	startDelay: 0.5,
	interval: 0.1,
	duration: 0.52,
	y: -12
} as const;

export function introStagger(options: IntroStaggerOptions = {}): Attachment {
	const startDelay = options.startDelay ?? DEFAULTS.startDelay;
	const interval = options.interval ?? DEFAULTS.interval;
	const duration = options.duration ?? DEFAULTS.duration;
	const y = options.y ?? DEFAULTS.y;

	return (element) => {
		const items = element.querySelectorAll<HTMLElement>(INTRO_ITEM_SELECTOR);

		if (items.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const animation = animate(
			items,
			{ opacity: [0, 1], y: [y, 0] },
			{
				duration,
				delay: stagger(interval, { startDelay }),
				ease: [0.22, 1, 0.36, 1]
			}
		);

		return () => animation.stop();
	};
}
