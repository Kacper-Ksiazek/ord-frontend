import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import type { TipRegister } from '$lib/types/ongoing-conversation/api/responses';

interface BaseBlock {
	type: 'translation' | 'examples' | 'text' | 'badges';
}

export interface TranslationBlock extends BaseBlock {
	type: 'translation';
	label?: string;
	translation: {
		text: string;
		Icon: LucideIcon;
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
	/** Optional icon (e.g., EXPLANATION_ICON) */
	Icon?: LucideIcon;
	/** Variant for styling */
	variant?: TailwindColor;
}

export interface BadgesBlock extends BaseBlock {
	type: 'badges';
	badges: {
		text: string;
		Icon?: LucideIcon;
	}[];
	severity?: {
		Icon: LucideIcon;
		value: string;
	};
}

export type AiAdviceBaseV2Block = TranslationBlock | ExamplesBlock | TextBlock | BadgesBlock;

/**
 * Props that always should be added to all derived cards props.
 */
export interface DerivedAiAdviceCardProps {
	/** Whether the card can be expanded/collapsed. Defaults to true. */
	isExpandable?: boolean;
	/** Whether the card starts expanded or collapsed. Defaults to false (collapsed). */
	defaultExpandState?: boolean;
}

export interface AiAdviceBaseV2Props extends DerivedAiAdviceCardProps {
	color: TabsSupportedTailwindColor;

	/** Not collapsible blocks */
	headerBlocks: AiAdviceBaseV2Block[];

	/** Collapsible blocks */
	bodyBlocks: AiAdviceBaseV2Block[];
}
