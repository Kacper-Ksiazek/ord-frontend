import { Observable } from 'rxjs';

/** Simulates SSE character chunks for local UI devtools. */
export function createMockExplainerStream(fullText: string, charDelayMs = 14): Observable<string> {
	return new Observable((subscriber) => {
		let index = 0;

		const tick = () => {
			if (index >= fullText.length) {
				subscriber.complete();

				return;
			}

			subscriber.next(fullText[index]);
			index += 1;
		};

		const intervalId = setInterval(tick, charDelayMs);

		return () => {
			clearInterval(intervalId);
		};
	});
}
