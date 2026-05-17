import type { ConversationType } from '$lib/types/conversation/domain/conversation';
import {
	getStorageItem,
	LOCAL_STORAGE_KEYS,
	removeStorageItem,
	setStorageItem
} from '$lib/utils/local-storage';
import {
	CONVERSATION_TYPES,
	DISABLED_CONVERSATION_TYPES
} from '$lib/features/conversations/shared/constants/enum_values';

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

	const raw = getStorageItem<string>(LOCAL_STORAGE_KEYS.DEFAULT_CONVERSATION_TYPE);

	if (raw === null || typeof raw !== 'string') {
		return null;
	}

	if (!isAllowedConversationType(raw)) {
		removeStorageItem(LOCAL_STORAGE_KEYS.DEFAULT_CONVERSATION_TYPE);

		return null;
	}

	return raw;
}

export function writeDefaultConversationTypeToStorage(type: ConversationType): void {
	if (DISABLED_CONVERSATION_TYPES.has(type)) {
		return;
	}

	setStorageItem(LOCAL_STORAGE_KEYS.DEFAULT_CONVERSATION_TYPE, type);
}

export function clearDefaultConversationTypeFromStorage(): void {
	removeStorageItem(LOCAL_STORAGE_KEYS.DEFAULT_CONVERSATION_TYPE);
}
