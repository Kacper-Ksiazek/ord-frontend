import { browser } from '$app/environment';
import { SvelteMap } from 'svelte/reactivity';
import type { ConversationType } from '$conversations/types';
import { getStorageItem, setStorageItem } from '$lib/utils/local-storage';

const TOPIC_PICKER_PINNED_TOPICS_STORAGE_KEY = 'create_conversation_topic_picker_pinned_topics';

type TopicBuckets = {
	pinned: string[];
	unpinned: string[];
};

class TopicPickerStore {
	useOwnTopic = $state(false);

	topics = new SvelteMap<ConversationType, TopicBuckets>([
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

	constructor() {
		if (!browser) return;

		const raw = getStorageItem<unknown>(TOPIC_PICKER_PINNED_TOPICS_STORAGE_KEY);
		const saved: Partial<Record<ConversationType, string[]>> = {};

		if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
			for (const [key, val] of Object.entries(raw)) {
				if (Array.isArray(val) && val.every((v) => typeof v === 'string')) {
					saved[key as ConversationType] = val;
				}
			}
		}

		for (const [type, buckets] of [...this.topics.entries()]) {
			const order = saved[type];

			if (order?.length) {
				this.topics.set(type, this.#applySavedPinnedOrder(buckets, order));
			}
		}
	}

	/** Reorders buckets so pinned matches `savedPinned` (only topics that still exist). */
	#applySavedPinnedOrder(buckets: TopicBuckets, savedPinned: string[]): TopicBuckets {
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

	#setBucketsAndPersist(type: ConversationType, buckets: TopicBuckets): void {
		this.topics.set(type, buckets);

		if (!browser) return;

		const data: Partial<Record<ConversationType, string[]>> = {};

		for (const [conversationType, topicBuckets] of this.topics) {
			data[conversationType] = [...topicBuckets.pinned];
		}

		setStorageItem(TOPIC_PICKER_PINNED_TOPICS_STORAGE_KEY, data);
	}

	resetCustomState(): void {
		this.useOwnTopic = false;
	}

	getAllTopics(type: ConversationType): string[] {
		const b = this.topics.get(type);

		if (!b) return [];

		return [...b.pinned, ...b.unpinned];
	}

	removeTopicFromList(type: ConversationType, topicToRemove: string): void {
		const b = this.topics.get(type);

		if (!b) return;

		this.#setBucketsAndPersist(type, {
			pinned: b.pinned.filter((t) => t !== topicToRemove),
			unpinned: b.unpinned.filter((t) => t !== topicToRemove)
		});
	}

	pinTopic(type: ConversationType, topic: string): void {
		const b = this.topics.get(type);

		if (!b || !b.unpinned.includes(topic)) return;

		this.#setBucketsAndPersist(type, {
			pinned: [...b.pinned, topic],
			unpinned: b.unpinned.filter((t) => t !== topic)
		});
	}

	unpinTopic(type: ConversationType, topic: string): void {
		const b = this.topics.get(type);

		if (!b || !b.pinned.includes(topic)) return;

		this.#setBucketsAndPersist(type, {
			pinned: b.pinned.filter((t) => t !== topic),
			unpinned: [...b.unpinned, topic]
		});
	}

	appendUnpinnedTopic(type: ConversationType, topic: string): void {
		const b = this.topics.get(type) ?? { pinned: [], unpinned: [] };

		this.topics.set(type, {
			pinned: b.pinned,
			unpinned: [...b.unpinned, topic]
		});
	}
}

export const topicPickerStore = new TopicPickerStore();
