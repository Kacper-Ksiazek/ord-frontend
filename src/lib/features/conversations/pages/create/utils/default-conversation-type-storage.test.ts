import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	clearDefaultConversationTypeFromStorage,
	readDefaultConversationTypeFromStorage,
	writeDefaultConversationTypeToStorage
} from './default-conversation-type-storage';

vi.mock('$lib/utils/local-storage', () => ({
	getStorageItem: vi.fn(),
	removeStorageItem: vi.fn(),
	setStorageItem: vi.fn()
}));

import { getStorageItem, removeStorageItem, setStorageItem } from '$lib/utils/local-storage';

describe('readDefaultConversationTypeFromStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(globalThis, 'localStorage', {
			value: {},
			configurable: true,
			writable: true
		});
	});

	describe('positive path', () => {
		it('should return a valid stored conversation type', () => {
			vi.mocked(getStorageItem).mockReturnValue('SMALL_TALK');

			const result = readDefaultConversationTypeFromStorage();

			expect(result).toBe('SMALL_TALK');
		});
	});

	describe('negative path', () => {
		it('should return null when storage is empty', () => {
			vi.mocked(getStorageItem).mockReturnValue(null);

			const result = readDefaultConversationTypeFromStorage();

			expect(result).toBeNull();
		});

		it('should clear and return null for disabled conversation types', () => {
			vi.mocked(getStorageItem).mockReturnValue('SCENARIO_ROLEPLAY');

			const result = readDefaultConversationTypeFromStorage();

			expect(result).toBeNull();
			expect(removeStorageItem).toHaveBeenCalledWith('default_conversation_type');
		});

		it('should clear and return null for unknown values', () => {
			vi.mocked(getStorageItem).mockReturnValue('INVALID');

			const result = readDefaultConversationTypeFromStorage();

			expect(result).toBeNull();
			expect(removeStorageItem).toHaveBeenCalledWith('default_conversation_type');
		});
	});

	describe('edge cases', () => {
		it('should return null when localStorage is unavailable', () => {
			const originalLocalStorage = globalThis.localStorage;
			Object.defineProperty(globalThis, 'localStorage', {
				value: undefined,
				configurable: true
			});

			const result = readDefaultConversationTypeFromStorage();

			expect(result).toBeNull();

			Object.defineProperty(globalThis, 'localStorage', {
				value: originalLocalStorage,
				configurable: true
			});
		});
	});
});

describe('writeDefaultConversationTypeToStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		Object.defineProperty(globalThis, 'localStorage', {
			value: {},
			configurable: true,
			writable: true
		});
	});

	describe('positive path', () => {
		it('should persist an allowed conversation type', () => {
			writeDefaultConversationTypeToStorage('SMALL_TALK');

			expect(setStorageItem).toHaveBeenCalledWith('default_conversation_type', 'SMALL_TALK');
		});
	});

	describe('negative path', () => {
		it('should not persist disabled conversation types', () => {
			writeDefaultConversationTypeToStorage('SCENARIO_ROLEPLAY');

			expect(setStorageItem).not.toHaveBeenCalled();
		});
	});
});

describe('clearDefaultConversationTypeFromStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('positive path', () => {
		it('should remove the stored default conversation type', () => {
			clearDefaultConversationTypeFromStorage();

			expect(removeStorageItem).toHaveBeenCalledWith('default_conversation_type');
		});
	});
});
