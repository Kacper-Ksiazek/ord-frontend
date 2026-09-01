/**
 * Quiet traffic-light score tones (red, amber, gold, green). Same ranges; stronger chroma.
 */

export interface ScoreColorClasses {
	stroke: string;
	bg: string;
	text: string;
	value: string;
}

export interface ScoreChipClasses {
	bg: string;
	text: string;
}

type ScoreBand = 'null' | 'low' | 'lowMedium' | 'medium' | 'high' | 'perfect';

const SCORE_CHIP: Record<Exclude<ScoreBand, 'null'>, ScoreChipClasses> = {
	perfect: {
		bg: 'bg-score-perfect',
		text: 'text-on-ink'
	},
	high: {
		bg: 'bg-score-high',
		text: 'text-on-ink'
	},
	medium: {
		bg: 'bg-score-medium',
		text: 'text-on-ink'
	},
	lowMedium: {
		bg: 'bg-score-low-medium',
		text: 'text-on-ink'
	},
	low: {
		bg: 'bg-score-low',
		text: 'text-on-ink'
	}
};

const SCORE_COLORS: Record<ScoreBand, ScoreColorClasses> = {
	null: {
		stroke: 'stroke-line',
		bg: 'stroke-line',
		text: 'text-ink-subtle',
		value: 'text-ink-subtle'
	},
	perfect: {
		stroke: 'stroke-score-perfect',
		bg: 'stroke-score-perfect-soft',
		text: 'text-ink-muted',
		value: 'text-score-perfect'
	},
	high: {
		stroke: 'stroke-score-high',
		bg: 'stroke-score-high-soft',
		text: 'text-ink-muted',
		value: 'text-score-high'
	},
	medium: {
		stroke: 'stroke-score-medium',
		bg: 'stroke-score-medium-soft',
		text: 'text-ink-muted',
		value: 'text-score-medium'
	},
	lowMedium: {
		stroke: 'stroke-score-low-medium',
		bg: 'stroke-score-low-medium-soft',
		text: 'text-ink-muted',
		value: 'text-score-low-medium'
	},
	low: {
		stroke: 'stroke-score-low',
		bg: 'stroke-score-low-soft',
		text: 'text-ink-muted',
		value: 'text-score-low'
	}
};

function getScoreBand(score: number | null): ScoreBand {
	if (score === null) {
		return 'null';
	}

	if (score === 10) {
		return 'perfect';
	}

	if (score >= 8) {
		return 'high';
	}

	if (score >= 6) {
		return 'medium';
	}

	if (score >= 4) {
		return 'lowMedium';
	}

	return 'low';
}

export function getScoreColorClasses(score: number | null): ScoreColorClasses {
	return SCORE_COLORS[getScoreBand(score)];
}

export function getScoreChipClasses(score: number): ScoreChipClasses {
	const band = getScoreBand(score);

	if (band === 'null') {
		return { bg: 'bg-accent-soft', text: 'text-ink-subtle' };
	}

	return SCORE_CHIP[band];
}
