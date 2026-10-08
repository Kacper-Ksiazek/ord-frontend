import { browser } from '$app/environment';
import { SvelteMap } from 'svelte/reactivity';
import type { ConversationType } from '$conversations/types';
import { getStorageItem, setStorageItem } from '$lib/utils/local-storage';

const TOPIC_PICKER_PINNED_TOPICS_STORAGE_KEY = 'create_conversation_topic_picker_pinned_topics';

type TopicBuckets = {
	pinned: string[];
	unpinned: string[];
	/** Stable UI order; pin/unpin does not reorder. */
	order: string[];
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
				],
				order: [
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

	#topicOrder(buckets: TopicBuckets): string[] {
		if (buckets.order.length > 0) {
			return buckets.order;
		}

		return [
			...buckets.unpinned,
			...buckets.pinned.filter((topic) => !buckets.unpinned.includes(topic))
		];
	}

	#topicsInList(buckets: TopicBuckets): Set<string> {
		return new Set([...buckets.pinned, ...buckets.unpinned]);
	}

	/** Restores saved pins, including generated topics that are not in the seed list. */
	#applySavedPinnedOrder(buckets: TopicBuckets, savedPinned: string[]): TopicBuckets {
		const displayOrder = this.#topicOrder(buckets);
		const inList = this.#topicsInList(buckets);

		const newPinned: string[] = [];
		const restoredExtras: string[] = [];

		for (const t of savedPinned) {
			if (!t || newPinned.includes(t)) continue;

			newPinned.push(t);

			if (!inList.has(t)) {
				restoredExtras.push(t);
			}
		}

		const pinnedSet = new Set(newPinned);
		const newUnpinned = displayOrder.filter((t) => inList.has(t) && !pinnedSet.has(t));

		return {
			pinned: newPinned,
			unpinned: newUnpinned,
			order: [...displayOrder, ...restoredExtras]
		};
	}

	#setBucketsAndPersist(type: ConversationType, buckets: TopicBuckets): void {
		const normalized: TopicBuckets = {
			...buckets,
			order: buckets.order.length > 0 ? buckets.order : this.#topicOrder(buckets)
		};

		this.topics.set(type, normalized);

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

	getTopicsInDisplayOrder(type: ConversationType): { topic: string; isPinned: boolean }[] {
		const b = this.topics.get(type);

		if (!b) return [];

		const pinnedSet = new Set(b.pinned);
		const inList = this.#topicsInList(b);

		return this.#topicOrder(b)
			.filter((topic) => inList.has(topic))
			.map((topic) => ({
				topic,
				isPinned: pinnedSet.has(topic)
			}));
	}

	getAllTopics(type: ConversationType): string[] {
		return this.getTopicsInDisplayOrder(type).map((item) => item.topic);
	}

	removeTopicFromList(type: ConversationType, topicToRemove: string): void {
		const b = this.topics.get(type);

		if (!b) return;

		const order = this.#topicOrder(b).filter((t) => t !== topicToRemove);

		this.#setBucketsAndPersist(type, {
			pinned: b.pinned.filter((t) => t !== topicToRemove),
			unpinned: b.unpinned.filter((t) => t !== topicToRemove),
			order
		});
	}

	pinTopic(type: ConversationType, topic: string): void {
		const b = this.topics.get(type);

		if (!b || !b.unpinned.includes(topic)) return;

		this.#setBucketsAndPersist(type, {
			pinned: [...b.pinned, topic],
			unpinned: b.unpinned.filter((t) => t !== topic),
			order: this.#topicOrder(b)
		});
	}

	unpinTopic(type: ConversationType, topic: string): void {
		const b = this.topics.get(type);

		if (!b || !b.pinned.includes(topic)) return;

		this.#setBucketsAndPersist(type, {
			pinned: b.pinned.filter((t) => t !== topic),
			unpinned: [...b.unpinned, topic],
			order: this.#topicOrder(b)
		});
	}

	appendUnpinnedTopic(type: ConversationType, topic: string): void {
		const b = this.topics.get(type) ?? { pinned: [], unpinned: [], order: [] };
		const order = this.#topicOrder(b);

		if (order.includes(topic)) {
			return;
		}

		this.topics.set(type, {
			pinned: b.pinned,
			unpinned: [...b.unpinned, topic],
			order: [...order, topic]
		});
	}
}

export const topicPickerStore = new TopicPickerStore();
