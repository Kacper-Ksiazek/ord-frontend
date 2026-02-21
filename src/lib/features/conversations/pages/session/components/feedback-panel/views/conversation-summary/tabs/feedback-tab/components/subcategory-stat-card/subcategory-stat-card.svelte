<script lang="ts">
	import { IconCard } from '$lib/components/cards/icon-card';
	import type { IconCardVariant } from '$lib/components/cards/icon-card';
	import type { ConversationMessageMistakeSeverity } from '$lib/types/conversation/domain/conversation-message-feedback';
	import { CircleAlert, TriangleAlert, CircleX, BookOpen, Layers } from 'lucide-svelte';

	interface MistakeSeverityCardProps {
		severity: ConversationMessageMistakeSeverity;
		count: number;
		isCardActive: boolean;
		onSelect: (severity: ConversationMessageMistakeSeverity) => void;
	}

	interface SuggestionTypeCardProps {
		type: 'VOCABULARY' | 'STRUCTURE';
		count: number;
		isCardActive: boolean;
		onSelect: (type: 'VOCABULARY' | 'STRUCTURE') => void;
	}

	type Props = MistakeSeverityCardProps | SuggestionTypeCardProps;

	let props: Props = $props();

	const isMistakeCard = 'severity' in props;
	const isDisabled = $derived(props.count === 0);

	const { title, variant, Icon } = $derived.by(() => {
		if (isMistakeCard) {
			const mistakeProps = props as MistakeSeverityCardProps;
			return (
				{
					MINOR: {
						title: 'Minor',
						variant: 'red' as IconCardVariant,
						Icon: CircleAlert
					},
					MODERATE: {
						title: 'Moderate',
						variant: 'red' as IconCardVariant,
						Icon: TriangleAlert
					},
					CRITICAL: {
						title: 'Critical',
						variant: 'red' as IconCardVariant,
						Icon: CircleX
					}
				} satisfies Record<
					ConversationMessageMistakeSeverity,
					{
						title: string;
						variant: IconCardVariant;
						Icon: LucideIcon;
					}
				>
			)[mistakeProps.severity];
		} else {
			const suggestionProps = props as SuggestionTypeCardProps;
			return (
				{
					VOCABULARY: {
						title: 'Vocabulary',
						variant: 'purple' as IconCardVariant,
						Icon: BookOpen
					},
					STRUCTURE: {
						title: 'Structure',
						variant: 'purple' as IconCardVariant,
						Icon: Layers
					}
				} satisfies Record<
					'VOCABULARY' | 'STRUCTURE',
					{
						title: string;
						variant: IconCardVariant;
						Icon: LucideIcon;
					}
				>
			)[suggestionProps.type];
		}
	});

	function handleSelect() {
		if (isMistakeCard) {
			(props as MistakeSeverityCardProps).onSelect((props as MistakeSeverityCardProps).severity);
		} else {
			(props as SuggestionTypeCardProps).onSelect((props as SuggestionTypeCardProps).type);
		}
	}
</script>

<IconCard
	{title}
	value={props.count ?? '-'}
	{variant}
	isActive={props.isCardActive}
	disabled={isDisabled}
	onclick={handleSelect}
>
	{#snippet icon({ className })}
		<Icon class={className} />
	{/snippet}
</IconCard>
