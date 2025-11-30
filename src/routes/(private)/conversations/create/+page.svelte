<script lang="ts">
	import { CreateConversationForm } from '$lib/components/features/conversation/create';
</script>

<svelte:head>
	<title>New Conversation</title>
</svelte:head>

<section
	class="w-full flex-1 max-w-[1200px] mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-8 my-8 flex flex-col"
>
	<CreateConversationForm />
</section>
