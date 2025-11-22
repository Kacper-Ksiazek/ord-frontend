<script lang="ts">
import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Conversations</title>
</svelte:head>

<button onclick={() => goto("/conversations/create")}>New Conversation</button>
