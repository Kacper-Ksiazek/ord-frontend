<script lang="ts">
import type { SVGIconProps } from '$lib/assets/images/types';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';
import ExamPractice from './exam-practice.svg.svelte';
import OxfordDebate from './oxford-debate.svg.svelte';
import RolePlay from './role-play.svg.svelte';
import SmallTalk from './small-talk.svg.svelte';
import TopicExploration from './topic-exploration.svg.svelte';

interface ConversationTypeProps extends SVGIconProps {
	conversationType: ConversationType;
}

const { conversationType, ...restProps }: ConversationTypeProps = $props();
</script>

{#if conversationType === "SMALL_TALK"}
  <SmallTalk {...restProps} />
{:else if conversationType === "SCENARIO_ROLEPLAY"}
  <RolePlay {...restProps} />
{:else if conversationType === "EXAM_PRACTICE"}
  <ExamPractice {...restProps} />
{:else if conversationType === "TOPIC_EXPLORATION"}
  <TopicExploration {...restProps} />
{:else if conversationType === "OXFORD_DEBATE"}
  <OxfordDebate {...restProps} />
{/if}
