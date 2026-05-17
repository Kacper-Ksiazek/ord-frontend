<script lang="ts">
	import ExamPractice from '$lib/assets/images/conversation/types/exam-practice.svg.svelte';
	import OxfordDebate from '$lib/assets/images/conversation/types/oxford-debate.svg.svelte';
	import RolePlay from '$lib/assets/images/conversation/types/role-play.svg.svelte';
	import SmallTalk from '$lib/assets/images/conversation/types/small-talk.svg.svelte';
	import TopicExploration from '$lib/assets/images/conversation/types/topic-exploration.svg.svelte';
	import type { SVGIconProps } from '$lib/assets/images/types';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';

	interface ConversationTypeProps extends SVGIconProps {
		conversationType: ConversationType;
	}

	const { conversationType, ...restProps }: ConversationTypeProps = $props();
</script>

{#if conversationType === 'SMALL_TALK'}
	<SmallTalk {...restProps} />
{:else if conversationType === 'SCENARIO_ROLEPLAY'}
	<RolePlay {...restProps} />
{:else if conversationType === 'EXAM_PRACTICE'}
	<ExamPractice {...restProps} />
{:else if conversationType === 'TOPIC_EXPLORATION'}
	<TopicExploration {...restProps} />
{:else if conversationType === 'OXFORD_DEBATE'}
	<OxfordDebate {...restProps} />
{/if}
