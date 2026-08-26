export type OrdLogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type OrdLogoMode = 'mark' | 'lockup';

export interface OrdLogoProps {
	size?: OrdLogoSize;
	/** Play the bristle-by-bristle draw once on mount. */
	animate?: boolean;
	/** `mark` is the two rings; `lockup` adds the ORD wordmark under the mark. */
	mode?: OrdLogoMode;
	class?: string;
	/** Prefix for SVG mask ids when more than one animated logo is on the page. */
	id?: string;
	/** Accessible name for the graphic. */
	ariaLabel?: string;
}
