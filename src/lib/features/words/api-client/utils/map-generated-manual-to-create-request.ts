import type { AIGeneratedWordManual } from '../api/http-post-generate-word-manual';
import type { CreateWordDetailsRequest } from '../api/http-post-create-word-details';

export function mapGeneratedManualToCreateRequest(
	manual: AIGeneratedWordManual
): CreateWordDetailsRequest {
	return {
		useCases: manual.useCases ?? [],
		synonyms: manual.synonyms ?? [],
		antonyms: manual.antonyms ?? [],
		commonMistakes: manual.commonMistakes ?? [],
		exampleSentences: manual.exampleSentences ?? [],
		collocations: manual.collocations ?? [],
		pronunciation: manual.pronunciation ?? null,
		grammar: manual.grammar ?? null,
		culturalNotes: manual.culturalNotes ?? null,
		learningTips: manual.learningTips ?? null
	};
}
