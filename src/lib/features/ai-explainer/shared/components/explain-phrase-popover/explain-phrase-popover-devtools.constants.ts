import type { LanguageName } from '$lib/types/core/domain/languages';

export interface ExplainPhraseDevtoolsSeed {
	phrase: string;
	language: LanguageName;
	context?: string;
	customInstruction?: string;
}

export const EXPLAIN_PHRASE_DEVTOOLS_SEEDS = {
	germanNoun: {
		phrase: 'Hund',
		language: 'GERMAN' as LanguageName
	},
	norwegianWithContext: {
		phrase: 'nuna',
		language: 'NORWEGIAN' as LanguageName,
		context: 'Jeg kjøpte en ny nuna til babyen i helgen.'
	},
	polishIdiomFull: {
		phrase: 'nie wytykać nosa',
		language: 'POLISH' as LanguageName,
		context: 'Nie wytykaj nosa tam, gdzie cię nie proszą — usłyszałem to od babci.',
		customInstruction:
			'Skup się na potocznym użyciu i ostrzeżeniu, żeby nie wtrącać się w cudze sprawy.'
	},
	englishPhrasalVerb: {
		phrase: 'break the ice',
		language: 'ENGLISH' as LanguageName,
		context: 'He told a joke to break the ice at the start of the meeting.',
		customInstruction: 'Explain for a B1 learner; mention informal meetings.'
	},
	englishAudacity: {
		phrase: 'audacity',
		language: 'ENGLISH' as LanguageName
	}
} satisfies Record<string, ExplainPhraseDevtoolsSeed>;
