import type { ConversationType } from '$conversations/types';
import type { LanguageName } from '$lib/types/core/domain/languages';

export interface TopicPickerProps {
	selectedType: ConversationType | undefined;
	language: LanguageName;
	selectedTopic: string | undefined;
}
