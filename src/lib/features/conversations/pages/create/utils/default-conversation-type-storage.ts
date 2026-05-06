import type { ConversationType } from '$lib/types/conversation/domain/conversation';
import { getStorageItem, removeStorageItem, setStorageItem } from '$lib/utils/local-storage';
import {
	CONVERSATION_TYPES,
	DISABLED_CONVERSATION_TYPES
} from '$lib/features/conversations/shared/constants/enum_values';

const STORAGE_KEY = 'default_conversation_type';

function isAllowedConversationType(value: string): value is ConversationType {
	return (
		CONVERSATION_TYPES.includes(value as ConversationType) &&
		!DISABLED_CONVERSATION_TYPES.has(value as ConversationType)
	);
}

/**
 * Reads the persisted default conversation type. Clears invalid / blocked values from storage.
 */
export function readDefaultConversationTypeFromStorage(): ConversationType | null {
	if (typeof localStorage === 'undefined') {
		return null;
	}

	const raw = getStorageItem<string>(STORAGE_KEY);

	if (raw === null || typeof raw !== 'string') {
		return null;
	}

	if (!isAllowedConversationType(raw)) {
		removeStorageItem(STORAGE_KEY);

		return null;
	}

	return raw;
}

export function writeDefaultConversationTypeToStorage(type: ConversationType): void {
	if (DISABLED_CONVERSATION_TYPES.has(type)) {
		return;
	}

	setStorageItem(STORAGE_KEY, type);
}

export function clearDefaultConversationTypeFromStorage(): void {
	removeStorageItem(STORAGE_KEY);
}
