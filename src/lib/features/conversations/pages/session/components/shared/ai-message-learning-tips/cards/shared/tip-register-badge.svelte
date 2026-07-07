<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import { Briefcase, Users, Zap } from 'lucide-svelte';
	import type { TipRegister } from '$conversations/types/ongoing-conversation/api/responses';
	import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';

	interface Props {
		register: TipRegister;
		color: TabsSupportedTailwindColor;
	}

	let { register, color }: Props = $props();

	const label = $derived.by(() => {
		switch (register) {
			case 'FORMAL':
				return 'Formal';
			case 'NEUTRAL':
				return 'Neutral';
			case 'COLLOQUIAL':
				return 'Colloquial';
		}
	});

	const Icon = $derived.by(() => {
		switch (register) {
			case 'FORMAL':
				return Briefcase;
			case 'NEUTRAL':
				return Users;
			case 'COLLOQUIAL':
				return Zap;
		}
	});
</script>

<Badge {color} class="flex items-center gap-1">
	<Icon class="w-4 h-4" />

	{label}
</Badge>
