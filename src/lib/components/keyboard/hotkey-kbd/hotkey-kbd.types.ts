import type { RegisterableHotkey } from '@tanstack/svelte-hotkeys';

export interface HotkeyKbdProps {
	/** Shortcut string (e.g. `Mod+Enter`) — shown in the badge and used for registration */
	hotkey: RegisterableHotkey;
	disabled?: boolean;
	/**
	 * Called when the global shortcut fires. Use a stable function reference when possible
	 * so registration is not torn down every render (e.g. `focus` an input, `click` a button).
	 * If omitted, the badge is shown but nothing is registered.
	 */
	onActivate?: () => void;
	class?: string;
	/** When set, replaces default chip surface/border colors (e.g. Button passes variant-aware classes). */
	hotkeyClass?: string;
}
