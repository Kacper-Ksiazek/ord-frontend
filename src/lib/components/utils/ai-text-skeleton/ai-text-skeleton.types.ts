export type AiTextSkeletonSize = 'sm' | 'md';

export interface AiTextSkeletonProps {
	/** Width of every line as a CSS length (e.g. `['100%', '92%', '64%']`). One entry per line. */
	lines?: string[];
	/** `md` matches body text (`text-base`), `sm` matches secondary text (`text-sm`). */
	size?: AiTextSkeletonSize;
	/** Optional status shown above the lines, e.g. "Explaining…". */
	label?: string;
	class?: string;
	dataTestId?: string;
}
