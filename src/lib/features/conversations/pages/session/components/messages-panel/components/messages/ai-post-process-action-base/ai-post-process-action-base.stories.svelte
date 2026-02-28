<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AiPostProcessActionBase from './ai-post-process-action-base.svelte';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';
	import ConversationContextDecorator from '$lib/features/conversations/pages/session/contexts/storybook-decorators/conversation-context-decorator.svelte';
	import SidepanelContextDecorator from '$lib/features/conversations/pages/session/contexts/storybook-decorators/sidepanel-context-decorator.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	const { Story } = defineMeta({
		component: AiPostProcessActionBase,
		title: 'Features/Conversations/Session/AIPostProcessActionBase',
		decorators: [
			() => ConversationContextDecorator as any, //
			() => SidepanelContextDecorator as any,
			() => CenterComponentDecorator as any
		],
		args: {
			label: 'Wskazówki do nauki',
			tooltipContent: 'Kliknij, aby zobaczyć wskazówki do nauki',
			onclick: undefined
		},
		argTypes: {
			label: {
				control: { type: 'text' },
				description: 'Label text displayed with Sparkles icon'
			}
		}
	});
</script>

<Story
	name="Default"
	args={{
		label: 'Wskazówki do nauki',
		onclick: () => {
			console.log('Clicked!');
		}
	}}
>
	<TextWithThreeDotsAnimation
		text="Trwa przygotowywanie materiałów edukacyjnych"
		dotsWrapperClass="mb-1"
	/>
</Story>
