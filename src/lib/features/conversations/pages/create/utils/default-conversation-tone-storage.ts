import type { ConversationAITone } from '$conversations/types';
import { getStorageItem, removeStorageItem, setStorageItem } from '$lib/utils/local-storage';
import { CONVERSATION_TONES } from '$conversations/shared/constants/enum_values';

const STORAGE_KEY = 'default_conversation_tone';

function isAllowedTone(value: string): value is ConversationAITone {
	return CONVERSATION_TONES.includes(value as ConversationAITone);
}

/**
 * Reads the persisted default conversation tone. Clears invalid values from storage.
 */
export function readDefaultConversationToneFromStorage(): ConversationAITone | null {
	if (typeof localStorage === 'undefined') {
		return null;
	}

	const raw = getStorageItem<string>(STORAGE_KEY);

	if (raw === null || typeof raw !== 'string') {
		return null;
	}

	if (!isAllowedTone(raw)) {
		removeStorageItem(STORAGE_KEY);

		return null;
	}

	return raw;
}

export function writeDefaultConversationToneToStorage(tone: ConversationAITone): void {
	if (!isAllowedTone(tone)) {
		return;
	}

	setStorageItem(STORAGE_KEY, tone);
}

export function clearDefaultConversationToneFromStorage(): void {
	removeStorageItem(STORAGE_KEY);
}
