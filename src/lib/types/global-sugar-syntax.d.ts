import type { Icon } from 'lucide-svelte';
/**
 * Global Sugar Syntax Types
 *
 * Ambient type declarations for globally available type aliases
 * and utility types that improve developer experience across the application.
 *
 * These types are available everywhere without explicit imports.
 */

declare global {
	type Percentage = `${number | string}%`;

	/**
	 * TimeInMs - represents a duration or timestamp in milliseconds
	 * Provides semantic clarity that a number represents time in milliseconds
	 */
	type TimeInMs = number;

	/**
	 * LucideIcon - represents a Lucide icon
	 * Provides semantic clarity that a type represents a Lucide icon
	 */
	type LucideIcon = typeof Icon;

	/**
	 * TailwindColor - represents a Tailwind CSS color name
	 * Provides type safety for Tailwind color names used throughout the application
	 * Includes standard Tailwind colors and custom theme colors
	 */
	type TailwindColor =
		| 'slate'
		| 'gray'
		| 'zinc'
		| 'neutral'
		| 'stone'
		| 'red'
		| 'orange'
		| 'amber'
		| 'yellow'
		| 'lime'
		| 'green'
		| 'emerald'
		| 'teal'
		| 'cyan'
		| 'sky'
		| 'blue'
		| 'indigo'
		| 'violet'
		| 'purple'
		| 'fuchsia'
		| 'pink'
		| 'rose'
		| 'primary'
		| 'secondary';
}
