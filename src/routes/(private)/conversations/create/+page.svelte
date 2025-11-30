<script lang="ts">
	import { CreateConversationForm } from '$lib/components/features/conversation/create';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>New Conversation</title>
</svelte:head>

<section
	class="w-full flex-1 max-w-[1200px] mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-8 my-8 flex flex-col"
>
	<Breadcrumb class="mb-6">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href="/conversations">Conversations</BreadcrumbItem>
		<BreadcrumbItem>
			<span class="text-black dark:text-white">Create new</span></BreadcrumbItem
		>
	</Breadcrumb>

	<CreateConversationForm />
</section>
