import { flip, shift } from '@floating-ui/dom';

/** Minimum gap between the popover and the viewport edge (px). */
const VIEWPORT_MARGIN = 12;

/**
 * Floating UI middleware for text-highlight popovers: after the preferred
 * `placement` and its opposite, try left and right so wide cards stay in view.
 */
export const highlightPopoverFloatingMiddlewares = [
	flip({
		fallbackPlacements: ['bottom', 'left', 'right'],
		padding: VIEWPORT_MARGIN
	}),
	shift({
		padding: VIEWPORT_MARGIN
	})
];
