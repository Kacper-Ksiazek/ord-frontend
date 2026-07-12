<script lang="ts">
	import { authStore } from '$auth/stores';
	import CountryFlag from '$lib/assets/images/country_flags/country_flag.svelte';

	interface AuthUserNativeLanguageFlagProps {
		class?: string;
	}

	const { class: className = '' }: AuthUserNativeLanguageFlagProps = $props();

	const userNativeLanguage = $derived(authStore.user?.nativeLanguage);
</script>

{#if userNativeLanguage}
	<CountryFlag flag={userNativeLanguage} class={className} />
{/if}
