/** Small, non-reactive least-recently-used cache. The oldest entry is evicted once `limit` is exceeded. */
export class LruCache<TValue> {
	private readonly entries = new Map<string, TValue>();

	constructor(private readonly limit: number) {}

	get(key: string): TValue | undefined {
		if (!this.entries.has(key)) {
			return undefined;
		}

		const value = this.entries.get(key) as TValue;

		this.entries.delete(key);
		this.entries.set(key, value);

		return value;
	}

	set(key: string, value: TValue): void {
		this.entries.delete(key);
		this.entries.set(key, value);

		if (this.entries.size > this.limit) {
			const oldestKey = this.entries.keys().next().value;

			if (oldestKey !== undefined) {
				this.entries.delete(oldestKey);
			}
		}
	}
}
