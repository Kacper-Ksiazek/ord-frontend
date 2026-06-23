import type { SpeakTextProgress, SpeakTextStatus } from './speak-text.types';

export const speakTextPlayback = $state({
	id: null as string | number | null,
	status: 'idle' as SpeakTextStatus,
	progress: { currentTime: 0, duration: 0 } as SpeakTextProgress
});
