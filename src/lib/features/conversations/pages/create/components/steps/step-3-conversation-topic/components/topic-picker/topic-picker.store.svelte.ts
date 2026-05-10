import { browser } from '$app/environment';
import { SvelteMap } from 'svelte/reactivity';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';
import { getStorageItem, LOCAL_STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';

export type TopicBuckets = {
	pinned: string[];
	unpinned: string[];
};

const LEGACY_PINNED_TOPICS_KEY = 'ord.create-conversation.topic-picker.pinned-topics';

export const topicPickerUi = $state({
	useOwnTopic: false
});

export function resetTopicPickerCustomState() {
	topicPickerUi.useOwnTopic = false;
}

function normalizePinnedPayload(parsed: unknown): Partial<Record<ConversationType, string[]>> {
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
	const result: Partial<Record<ConversationType, string[]>> = {};
	for (const [key, val] of Object.entries(parsed)) {
		if (Array.isArray(val) && val.every((v) => typeof v === 'string')) {
			result[key as ConversationType] = val;
		}
	}

	return result;
}

function loadPinnedFromStorage(): Partial<Record<ConversationType, string[]>> {
	if (!browser) return {};

	const fromUtil = getStorageItem<unknown>(
		LOCAL_STORAGE_KEYS.CREATE_CONVERSATION_TOPIC_PICKER_PINNED_TOPICS
	);
	const normalized = normalizePinnedPayload(fromUtil);
	if (Object.keys(normalized).length > 0) {
		return normalized;
	}

	try {
		const raw = localStorage.getItem(LEGACY_PINNED_TOPICS_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw) as unknown;
		const legacy = normalizePinnedPayload(parsed);
		if (Object.keys(legacy).length > 0) {
			setStorageItem(LOCAL_STORAGE_KEYS.CREATE_CONVERSATION_TOPIC_PICKER_PINNED_TOPICS, legacy);
			localStorage.removeItem(LEGACY_PINNED_TOPICS_KEY);
		}

		return legacy;
	} catch {
		return {};
	}
}

function persistPinnedTopicsToStorage(): void {
	if (!browser) return;
	const data: Partial<Record<ConversationType, string[]>> = {};
	for (const [type, buckets] of topics) {
		data[type] = [...buckets.pinned];
	}
	setStorageItem(LOCAL_STORAGE_KEYS.CREATE_CONVERSATION_TOPIC_PICKER_PINNED_TOPICS, data);
}

/** Reorders buckets so pinned matches `savedPinned` (only topics that still exist). */
function applySavedPinnedOrder(buckets: TopicBuckets, savedPinned: string[]): TopicBuckets {
	const defaultOrder = [...buckets.pinned, ...buckets.unpinned];
	const inList = new Set(defaultOrder);

	const newPinned: string[] = [];
	for (const t of savedPinned) {
		if (inList.has(t) && !newPinned.includes(t)) {
			newPinned.push(t);
		}
	}

	const pinnedSet = new Set(newPinned);
	const newUnpinned = defaultOrder.filter((t) => !pinnedSet.has(t));

	return { pinned: newPinned, unpinned: newUnpinned };
}

function setBucketsAndPersist(type: ConversationType, buckets: TopicBuckets): void {
	topics.set(type, buckets);
	persistPinnedTopicsToStorage();
}

export const topics = new SvelteMap<ConversationType, TopicBuckets>([
	[
		'SMALL_TALK',
		{
			pinned: [],
			unpinned: [
				"What's your favorite way to spend a weekend?",
				'Have you seen any good movies lately?',
				'If you could travel anywhere, where would you go?'
			]
		}
	]
]);

if (browser) {
	const saved = loadPinnedFromStorage();
	for (const [type, buckets] of [...topics.entries()]) {
		const order = saved[type];
		if (order?.length) {
			topics.set(type, applySavedPinnedOrder(buckets, order));
		}
	}
}

export function getAllTopics(type: ConversationType): string[] {
	const b = topics.get(type);
	if (!b) return [];

	return [...b.pinned, ...b.unpinned];
}

export function removeTopicFromList(type: ConversationType, topicToRemove: string): void {
	const b = topics.get(type);
	if (!b) return;
	setBucketsAndPersist(type, {
		pinned: b.pinned.filter((t) => t !== topicToRemove),
		unpinned: b.unpinned.filter((t) => t !== topicToRemove)
	});
}

export function pinTopic(type: ConversationType, topic: string): void {
	const b = topics.get(type);
	if (!b || !b.unpinned.includes(topic)) return;
	setBucketsAndPersist(type, {
		pinned: [...b.pinned, topic],
		unpinned: b.unpinned.filter((t) => t !== topic)
	});
}

export function unpinTopic(type: ConversationType, topic: string): void {
	const b = topics.get(type);
	if (!b || !b.pinned.includes(topic)) return;
	setBucketsAndPersist(type, {
		pinned: b.pinned.filter((t) => t !== topic),
		unpinned: [...b.unpinned, topic]
	});
}

export function appendUnpinnedTopic(type: ConversationType, topic: string): void {
	const b = topics.get(type) ?? { pinned: [], unpinned: [] };
	topics.set(type, {
		pinned: b.pinned,
		unpinned: [...b.unpinned, topic]
	});
}
