export function uniqueE2eWord(label: string, workerIndex: number): string {
	const suffix = Date.now().toString(36);

	return `e2e${label}w${workerIndex}${suffix}`;
}
