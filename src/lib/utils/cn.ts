import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes. Falsy values are skipped; later utilities win. */
export function cn(...inputs: unknown[]): string {
	return twMerge(inputs as never);
}
