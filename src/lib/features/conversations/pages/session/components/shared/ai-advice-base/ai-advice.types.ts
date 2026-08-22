import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';
import type { LearningTipCategory } from '$conversations/types';
import type { ConversationMessageMistakeSeverity } from '$conversations/types';
import type { TipRegister } from '$conversations/types';

interface BaseBlock {
	type: 'translation' | 'examples' | 'text' | 'badges';
}

export interface TranslationBlock extends BaseBlock {
	type: 'translation';
	label?: string;
	translation: {
		text: string;
		Icon?: LucideIcon;
		badges: {
			text: string;
			Icon?: LucideIcon;
			register?: TipRegister;
		}[];
	};
	nativeLanguage?: {
		text: string;
	};
}

export interface ExamplesBlock extends BaseBlock {
	type: 'examples';
	label: string;
	examples: string[];
	/** Optional icon override (ArrowRight for alternatives, default for examples) */
	Icon?: LucideIcon;
	/** Whether to parse **bold** markers */
	parseBold?: boolean;
	/** For highlight styling when parseBold is true */
	category?: LearningTipCategory;
}

export interface TextBlock extends BaseBlock {
	type: 'text';
	label: string;
	text: string;
	/** Optional leading icon (e.g. X for incorrect phrase, check for correction) */
	Icon?: LucideIcon;
	/** Tailwind classes for {@link Icon} */
	iconClass?: string;
	/** Subtle rounded background behind {@link Icon} */
	iconBgClass?: string;
	/** Variant for legacy dot swatch when no Icon is set */
	variant?: TailwindColor;
}

export interface BadgesBlock extends BaseBlock {
	type: 'badges';
	badges: {
		text: string;
		Icon?: LucideIcon;
	}[];
	severity?: {
		Icon?: LucideIcon;
		value: ConversationMessageMistakeSeverity;
	};
}

export type AiAdviceBaseBlock = TranslationBlock | ExamplesBlock | TextBlock | BadgesBlock;

/**
 * Props that always should be added to all derived cards props.
 */
export interface DerivedAiAdviceCardProps {
	/** Whether the card can be expanded/collapsed. Defaults to true. */
	isExpandable?: boolean;
	/** Whether the card starts expanded or collapsed. Defaults to false (collapsed). */
	defaultExpandState?: boolean;
	/** Show a subtle category label (e.g. when browsing all item types). */
	showCategoryLabel?: boolean;
	/** Category label text paired with {@link categoryIcon}. */
	categoryLabel?: string;
	/** Category icon paired with {@link categoryLabel}. */
	categoryIcon?: LucideIcon;
}

export interface AiAdviceBaseProps extends DerivedAiAdviceCardProps {
	color: TabsSupportedTailwindColor;

	/** Not collapsible blocks */
	headerBlocks: AiAdviceBaseBlock[];

	/** Collapsible blocks */
	bodyBlocks: AiAdviceBaseBlock[];
}
