<script lang="ts">
	import { Badge } from 'flowbite-svelte';
	import { Briefcase, Users, Zap } from 'lucide-svelte';
	import type { TipRegister } from '$lib/types/ongoing-conversation/api/responses';
	import type { TabsSupportedTailwindColor } from '$lib/components/tabs/tabs.types';

	interface Props {
		register: TipRegister;
		color: TabsSupportedTailwindColor;
	}

	let { register, color }: Props = $props();

	const label = $derived.by(() => {
		switch (register) {
			case 'FORMAL':
				return 'Formal';
			case 'INFORMAL':
				return 'Informal';
			case 'COLLOQUIAL':
				return 'Colloquial';
		}
	});

	const Icon = $derived.by(() => {
		switch (register) {
			case 'FORMAL':
				return Briefcase;
			case 'INFORMAL':
				return Users;
			case 'COLLOQUIAL':
				return Zap;
		}
	});
</script>

<Badge {color} class="flex items-center gap-1">
	<Icon class="w-3 h-3" />

	{label}
</Badge>
