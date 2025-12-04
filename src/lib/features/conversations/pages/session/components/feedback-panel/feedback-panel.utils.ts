export function getScoreColor(score: number): 'green' | 'yellow' | 'orange' | 'red' {
	if (score >= 8) return 'green';
	if (score >= 6) return 'yellow';
	if (score >= 4) return 'orange';

	return 'red';
}

export function getSeverityColor(severity: number): 'yellow' | 'orange' | 'red' {
	if (severity === 1) return 'yellow';
	if (severity === 2) return 'orange';

	return 'red';
}
