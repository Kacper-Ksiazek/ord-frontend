import type { ConversationType } from '$conversations/types';
import type { LanguageName } from '$auth/types';

export interface TopicPickerProps {
	selectedType: ConversationType | undefined;
	language: LanguageName;
	selectedTopic: string | undefined;
}
